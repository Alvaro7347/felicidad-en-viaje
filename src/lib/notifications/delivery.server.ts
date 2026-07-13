/**
 * Envío idempotente de notificaciones con CLAIM ATÓMICO.
 *
 * Garantías:
 *  - `UNIQUE(user_id, notification_type, period_key)` impide crear filas duplicadas.
 *  - El claim de una fila existente se hace en un único `UPDATE ... WHERE ... RETURNING id`
 *    condicional: sólo tiene éxito si la fila sigue en un estado reclamable
 *    (`failed`, o `pending` con `locked_at` nulo/expirado).
 *    Postgres serializa los UPDATE sobre la misma fila; solo UN worker recibe
 *    el RETURNING con id, el resto obtiene 0 filas y sale sin enviar nada.
 *  - El timeout de "pending huérfano" se mide contra `locked_at` (momento en que
 *    comenzó el procesamiento actual), no contra `created_at`.
 *
 * Este módulo es server-only (usa supabaseAdmin desde el llamador).
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

/** Tras este tiempo sin finalizar, se considera que el worker anterior murió y el lock puede recuperarse. */
const LOCK_STALE_MS = 15 * 60 * 1000;

export async function deliverNotification(params: DeliverParams): Promise<DeliverResult> {
  const { supabase, userId, notificationType, periodKey, message, payload } = params;
  const payloadJson = (payload ?? {}) as Database["public"]["Tables"]["notification_deliveries"]["Insert"]["payload"];
  const nowIso = new Date().toISOString();
  const staleCutoffIso = new Date(Date.now() - LOCK_STALE_MS).toISOString();

  // 1. RESERVAR fila (insert atómico). Si tiene éxito, ya somos dueños del lock.
  const { data: reserved, error: reserveErr } = await supabase
    .from("notification_deliveries")
    .insert({
      user_id: userId,
      notification_type: notificationType,
      period_key: periodKey,
      status: "pending",
      payload: payloadJson,
      locked_at: nowIso,
    })
    .select("id")
    .maybeSingle();

  if (reserveErr && reserveErr.code !== "23505") {
    throw new Error(`deliverNotification reserve: ${reserveErr.message}`);
  }

  let deliveryId: string | null = reserved?.id ?? null;

  if (!deliveryId) {
    // Fila ya existe (conflicto UNIQUE). Intentar CLAIM ATÓMICO sobre ella.
    // Un único UPDATE condicional decide el ganador: los perdedores obtienen 0 filas.
    const { data: claimed, error: claimErr } = await supabase
      .from("notification_deliveries")
      .update({
        status: "pending",
        locked_at: nowIso,
        error: null,
        sent_at: null,
        payload: payloadJson,
      })
      .eq("user_id", userId)
      .eq("notification_type", notificationType)
      .eq("period_key", periodKey)
      .neq("status", "sent")
      .or(`status.eq.failed,and(status.eq.pending,or(locked_at.is.null,locked_at.lt.${staleCutoffIso}))`)
      .select("id")
      .maybeSingle();

    if (claimErr) throw new Error(`deliverNotification claim: ${claimErr.message}`);

    if (!claimed) {
      // Otro worker ganó el claim, o la fila ya está `sent`. Salir sin enviar.
      return { status: "skipped_duplicate", attempted: 0, succeeded: 0, gone: 0 };
    }
    deliveryId = claimed.id;
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
      .update({ status: "failed", error: "no_subscriptions", locked_at: null })
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

  // 4. Finalizar (liberar lock).
  if (succeeded > 0) {
    await supabase
      .from("notification_deliveries")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        error: null,
        locked_at: null,
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
    .update({ status: "failed", error: err, locked_at: null })
    .eq("id", deliveryId);
  return { status: "all_failed", attempted, succeeded: 0, gone };
}
