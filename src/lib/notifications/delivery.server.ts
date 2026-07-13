/**
 * Envío idempotente de notificaciones.
 *
 * Flujo (garantiza NUNCA duplicar envío gracias a UNIQUE(user_id, notification_type, period_key)):
 * 1. Reservar: INSERT ... ON CONFLICT DO NOTHING RETURNING id.
 *    - Si no retorna id, la entrega ya existe → salir (idempotencia real).
 * 2. Cargar suscripciones activas del usuario.
 *    - Si no hay, marcar failed con reason="no_subscriptions" y salir.
 * 3. Enviar push a cada suscripción (paralelo controlado).
 *    - Suscripciones con 404/410 se marcan revoked_at.
 * 4. Finalizar: UPDATE la MISMA fila reservada → sent | failed.
 *    - Los reintentos actualizan esa misma fila, nunca crean otra.
 *
 * Este módulo es server-only (usa supabaseAdmin). Se importa dinámicamente
 * dentro de handlers de rutas server-side para no filtrarse al bundle cliente.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { sendWebPush, type PushMessage } from "@/lib/push/webpush.server";

type DB = SupabaseClient<Database>;

export type NotificationType = "weekly_report" | `reactivation_d${3 | 7 | 14 | 30}`;

export interface DeliverParams {
  supabase: DB;
  userId: string;
  notificationType: NotificationType;
  periodKey: string;
  message: PushMessage;
  payload?: Record<string, unknown>;
}

export interface DeliverResult {
  status: "sent" | "skipped_duplicate" | "no_subscriptions" | "all_failed" | "partial";
  attempted: number;
  succeeded: number;
  gone: number;
}

/** Tiempo tras el cual una fila `pending` se considera huérfana (timeout/crash previo) y puede recuperarse. */
const PENDING_STALE_MS = 15 * 60 * 1000;

export async function deliverNotification(params: DeliverParams): Promise<DeliverResult> {
  const { supabase, userId, notificationType, periodKey, message, payload } = params;
  const payloadJson = (payload ?? {}) as Database["public"]["Tables"]["notification_deliveries"]["Insert"]["payload"];

  // 1. RESERVAR fila de entrega. Si ya existe, decidir según status.
  const { data: reserved, error: reserveErr } = await supabase
    .from("notification_deliveries")
    .insert({
      user_id: userId,
      notification_type: notificationType,
      period_key: periodKey,
      status: "pending",
      payload: payloadJson,
    })
    .select("id")
    .maybeSingle();

  let deliveryId: string;

  if (reserveErr && reserveErr.code !== "23505") {
    throw new Error(`deliverNotification reserve: ${reserveErr.message}`);
  }

  if (reserved) {
    deliveryId = reserved.id;
  } else {
    // Ya existe una fila (UNIQUE conflict). Distinguir estados sin duplicar filas.
    const { data: existing, error: exErr } = await supabase
      .from("notification_deliveries")
      .select("id, status, sent_at, created_at")
      .eq("user_id", userId)
      .eq("notification_type", notificationType)
      .eq("period_key", periodKey)
      .maybeSingle();
    if (exErr) throw new Error(`deliverNotification lookup: ${exErr.message}`);
    if (!existing) {
      // Carrera extraña: sin fila y sin conflicto reproducible → tratar como duplicada.
      return { status: "skipped_duplicate", attempted: 0, succeeded: 0, gone: 0 };
    }

    // sent → NUNCA reenviar.
    if (existing.status === "sent" || existing.sent_at) {
      return { status: "skipped_duplicate", attempted: 0, succeeded: 0, gone: 0 };
    }

    // pending "vivo" → otra ejecución concurrente lo está manejando. Salir sin duplicar.
    if (existing.status === "pending") {
      const ageMs = Date.now() - new Date(existing.created_at ?? Date.now()).getTime();
      if (ageMs < PENDING_STALE_MS) {
        return { status: "skipped_duplicate", attempted: 0, succeeded: 0, gone: 0 };
      }
      // pending huérfano (proceso previo cayó) → reutilizar la MISMA fila.
    }

    // failed o pending huérfano → reutilizar la fila, resetear a pending y reintentar.
    deliveryId = existing.id;
    const { error: resetErr } = await supabase
      .from("notification_deliveries")
      .update({ status: "pending", error: null, sent_at: null, payload: payloadJson })
      .eq("id", deliveryId);
    if (resetErr) throw new Error(`deliverNotification reset: ${resetErr.message}`);
  }

  // 2. Suscripciones activas.
  const { data: subs, error: subsErr } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", userId)
    .is("revoked_at", null);
  if (subsErr) throw new Error(`deliverNotification subs: ${subsErr.message}`);

  if (!subs || subs.length === 0) {
    await supabase
      .from("notification_deliveries")
      .update({ status: "failed", error: "no_subscriptions" })
      .eq("id", deliveryId);
    return { status: "no_subscriptions", attempted: 0, succeeded: 0, gone: 0 };
  }

  // 3. Enviar (paralelo).
  const results = await Promise.all(
    subs.map(async (sub) => {
      try {
        const res = await sendWebPush(sub, message, { ttlSeconds: 60 * 60 * 24, urgency: "normal" });
        if (res.gone) {
          await supabase
            .from("push_subscriptions")
            .update({ revoked_at: new Date().toISOString() })
            .eq("id", sub.id);
        }
        return { ok: res.ok, gone: res.gone, status: res.status, err: res.bodyText };
      } catch (e) {
        return { ok: false, gone: false, status: 0, err: (e as Error).message };
      }
    }),
  );

  const succeeded = results.filter((r) => r.ok).length;
  const gone = results.filter((r) => r.gone).length;
  const attempted = results.length;

  // 4. Finalizar.
  if (succeeded > 0) {
    await supabase
      .from("notification_deliveries")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", deliveryId);
    return {
      status: succeeded === attempted ? "sent" : "partial",
      attempted,
      succeeded,
      gone,
    };
  }

  const err = results
    .map((r) => `[${r.status}] ${r.err ?? "?"}`)
    .join(" | ")
    .slice(0, 800);
  await supabase
    .from("notification_deliveries")
    .update({ status: "failed", error: err })
    .eq("id", deliveryId);
  return { status: "all_failed", attempted, succeeded: 0, gone };
}
