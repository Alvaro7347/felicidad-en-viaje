/**
 * Scheduler unificado de notificaciones.
 *
 * Endpoint público que dispara pg_cron cada hora. Verifica autenticación por
 * apikey (SUPABASE_PUBLISHABLE_KEY) y despacha:
 * - Reporte semanal: usuarios cuya hora local es Domingo 19:00 en su tz.
 * - Reactivación: usuarios con 3 / 7 / 14 / 30 días exactos sin actividad significativa.
 *
 * Idempotencia REAL: cada envío se reserva contra UNIQUE(user_id, notification_type, period_key)
 * en notification_deliveries. Dos ejecuciones concurrentes NUNCA enviarán dos veces.
 *
 * Ejecuciones múltiples (retry manual, cron duplicado, timeout parcial):
 * - La primera reserva la fila.
 * - Las siguientes chocan con el UNIQUE → status=skipped_duplicate.
 * - Reintentos de una fila fallida se hacen actualizando la MISMA fila.
 */

import { createFileRoute } from "@tanstack/react-router";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

import {
  buildReactivation,
  buildWeeklyReport,
  REACTIVATION_STAGES,
  type Mode,
  type ReactivationStage,
} from "@/lib/notifications/copy";
import { deliverNotification } from "@/lib/notifications/delivery.server";
import {
  MVP1_LESSON_SEQUENCE,
  MVP1_LESSON_IDS,
} from "@/features/archipielago/data/mvp1Progress";
import { ISLAND_TITLES } from "@/features/archipielago/data/journeyCatalog";

type DB = SupabaseClient<Database>;

interface SchedulerSummary {
  ranAt: string;
  weeklyReport: { evaluated: number; sent: number; skipped: number; failed: number };
  reactivation: {
    evaluated: number;
    perStage: Record<ReactivationStage, { sent: number; skipped: number; failed: number }>;
  };
}

export const Route = createFileRoute("/api/public/hooks/notifications-scheduler")({
  server: {
    handlers: {
      POST: async ({ request }) => runScheduler(request),
      GET: async ({ request }) => runScheduler(request),
    },
  },
});

async function runScheduler(request: Request): Promise<Response> {
  // Auth: apikey debe coincidir con la publishable key (misma que usa pg_cron).
  const apiKey = request.headers.get("apikey");
  const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!expected || !apiKey || apiKey !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const now = new Date();

  const summary: SchedulerSummary = {
    ranAt: now.toISOString(),
    weeklyReport: { evaluated: 0, sent: 0, skipped: 0, failed: 0 },
    reactivation: {
      evaluated: 0,
      perStage: {
        3: { sent: 0, skipped: 0, failed: 0 },
        7: { sent: 0, skipped: 0, failed: 0 },
        14: { sent: 0, skipped: 0, failed: 0 },
        30: { sent: 0, skipped: 0, failed: 0 },
      },
    },
  };

  try {
    await runWeeklyReports(supabaseAdmin as unknown as DB, now, summary);
    await runReactivation(supabaseAdmin as unknown as DB, now, summary);
  } catch (err) {
    console.error("[scheduler] fatal", err);
    return Response.json(
      { ok: false, error: (err as Error).message, summary },
      { status: 500 },
    );
  }

  return Response.json({ ok: true, summary });
}

// ─────────────────────────────────────────────────────────────────
// WEEKLY REPORT
// ─────────────────────────────────────────────────────────────────

/** ¿Es Domingo 19:00 hora local en `timezone`? Tolerancia de 1h para asegurar disparo aun con drift de cron. */
function isLocalSundayAt19(now: Date, timezone: string): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      hour: "numeric",
      hour12: false,
    }).formatToParts(now);
    const weekday = parts.find((p) => p.type === "weekday")?.value;
    const hourStr = parts.find((p) => p.type === "hour")?.value;
    const hour = hourStr ? Number.parseInt(hourStr, 10) : NaN;
    return weekday === "Sun" && hour === 19;
  } catch {
    // Timezone inválida → tratar como America/Santiago.
    return isLocalSundayAt19(now, "America/Santiago");
  }
}

/** ISO week para el period_key. Estable independiente del día del envío. */
function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const diff = date.getTime() - firstThursday.getTime();
  const week = 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

async function runWeeklyReports(
  supabase: DB,
  now: Date,
  summary: SchedulerSummary,
): Promise<void> {
  // Candidatos: reporte semanal activo + tiene experience_mode consolidado + no revocaron notificaciones.
  const { data: candidates, error } = await supabase
    .from("user_settings")
    .select("user_id, timezone, notifications_enabled, weekly_report_enabled")
    .eq("notifications_enabled", true)
    .eq("weekly_report_enabled", true);
  if (error) throw new Error(`weekly: candidates ${error.message}`);
  if (!candidates || candidates.length === 0) return;

  const periodKey = `weekly:${isoWeekKey(now)}`;

  for (const c of candidates) {
    if (!isLocalSundayAt19(now, c.timezone ?? "America/Santiago")) continue;
    summary.weeklyReport.evaluated++;

    // Requiere experience_mode consolidado en profiles.
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name, experience_mode")
      .eq("id", c.user_id)
      .maybeSingle();
    if (!profile?.experience_mode) continue;
    const mode = profile.experience_mode as Mode;

    // Nombre a mostrar según modalidad.
    const firstName = await resolveFirstName(supabase, c.user_id, mode, profile.name);

    // Métricas semanales.
    const stats = await computeWeeklyStats(supabase, c.user_id);

    const message = buildWeeklyReport({ mode, firstName, stats });
    try {
      const res = await deliverNotification({
        supabase,
        userId: c.user_id,
        notificationType: "weekly_report",
        periodKey,
        message,
        payload: { mode, stats },
      });
      if (res.status === "sent" || res.status === "partial") summary.weeklyReport.sent++;
      else if (res.status === "skipped_duplicate") summary.weeklyReport.skipped++;
      else summary.weeklyReport.failed++;
    } catch (e) {
      summary.weeklyReport.failed++;
      console.error("[weekly] deliver failed", c.user_id, e);
    }
  }
}

async function resolveFirstName(
  supabase: DB,
  userId: string,
  mode: Mode,
  profileName: string | null,
): Promise<string> {
  if (mode === "accompanied_learning") {
    const { data } = await supabase
      .from("parent_journeys")
      .select("student_name")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const raw = (data?.student_name ?? "").trim();
    const first = raw.split(/\s+/)[0];
    return first || "tu estudiante";
  }
  const raw = (profileName ?? "").trim();
  const first = raw.split(/\s+/)[0];
  return first || "amig@";
}

async function computeWeeklyStats(supabase: DB, userId: string) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const { data: rows } = await supabase
    .from("lesson_progress")
    .select("lesson_id, status, completed_at, created_at")
    .eq("user_id", userId)
    .in("lesson_id", MVP1_LESSON_IDS);

  const all = rows ?? [];
  const completed = all.filter((r) => r.status === "completed");
  const weekCompleted = completed.filter((r) => (r.completed_at ?? r.created_at) >= oneWeekAgo);

  const activeDaysSet = new Set(
    all
      .filter((r) => (r.completed_at ?? r.created_at) >= oneWeekAgo)
      .map((r) => (r.completed_at ?? r.created_at).slice(0, 10)),
  );

  const completedIds = new Set(completed.map((r) => r.lesson_id));
  // Próxima lección: primera del sequence NO completada.
  const next = MVP1_LESSON_SEQUENCE.find((l) => !completedIds.has(l.lessonId));
  const currentIslandId = next?.islandId ?? completed[completed.length - 1]?.lesson_id ? next?.islandId ?? null : null;

  const island = next?.islandId ?? null;
  const islandTitle = island ? ISLAND_TITLES[island] ?? null : null;
  const islandLessons = MVP1_LESSON_SEQUENCE.filter((l) => l.islandId === island);
  const islandCompleted = islandLessons.filter((l) => completedIds.has(l.lessonId)).length;
  const islandPct =
    islandLessons.length > 0 ? Math.round((islandCompleted / islandLessons.length) * 100) : 0;

  return {
    lessonsCompleted: weekCompleted.length,
    currentIslandTitle: islandTitle,
    currentIslandPct: islandPct,
    activeDays: activeDaysSet.size,
    nextLessonTitle: next?.label ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────
// REACTIVATION
// ─────────────────────────────────────────────────────────────────

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (24 * 3600 * 1000));
}

async function runReactivation(
  supabase: DB,
  now: Date,
  summary: SchedulerSummary,
): Promise<void> {
  const { data: candidates, error } = await supabase
    .from("user_settings")
    .select("user_id, last_active_at, notifications_enabled, inactivity_reminders_enabled")
    .eq("notifications_enabled", true)
    .eq("inactivity_reminders_enabled", true)
    .not("last_active_at", "is", null);
  if (error) throw new Error(`reactivation: candidates ${error.message}`);
  if (!candidates || candidates.length === 0) return;

  for (const c of candidates) {
    if (!c.last_active_at) continue;
    const days = daysBetween(new Date(c.last_active_at), now);
    if (!REACTIVATION_STAGES.includes(days as ReactivationStage)) continue;
    const stage = days as ReactivationStage;
    summary.reactivation.evaluated++;

    // experience_mode consolidado.
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name, experience_mode")
      .eq("id", c.user_id)
      .maybeSingle();
    if (!profile?.experience_mode) continue;
    const mode = profile.experience_mode as Mode;

    // Debe tener AL MENOS una suscripción activa.
    const { count: subCount } = await supabase
      .from("push_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", c.user_id)
      .is("revoked_at", null);
    if (!subCount || subCount === 0) continue;

    const firstName = await resolveFirstName(supabase, c.user_id, mode, profile.name);
    const message = buildReactivation({ mode, firstName, stage });

    // period_key incluye la fecha de última actividad → si el usuario vuelve,
    // last_active_at cambia, la cadena se reinicia con nuevos period_keys.
    const anchor = c.last_active_at.slice(0, 10);
    const periodKey = `reactivation:d${stage}:${anchor}`;

    try {
      const res = await deliverNotification({
        supabase,
        userId: c.user_id,
        notificationType: `reactivation_d${stage}` as const,
        periodKey,
        message,
        payload: { stage, mode, anchor },
      });
      const bucket = summary.reactivation.perStage[stage];
      if (res.status === "sent" || res.status === "partial") bucket.sent++;
      else if (res.status === "skipped_duplicate") bucket.skipped++;
      else bucket.failed++;
    } catch (e) {
      summary.reactivation.perStage[stage].failed++;
      console.error("[reactivation] deliver failed", c.user_id, e);
    }
  }
}
