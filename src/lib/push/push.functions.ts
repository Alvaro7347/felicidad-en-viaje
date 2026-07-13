/**
 * Server functions relacionadas con Web Push:
 * - getVapidPublicKey(): retorna la clave pública para pushManager.subscribe.
 * - registerPushSubscription(): guarda una suscripción del navegador.
 * - unregisterPushSubscription(): marca revoked_at.
 * - sendTestPush(): envía una notificación de prueba al propio usuario.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SubscriptionInput = z.object({
  endpoint: z.string().url().max(2048),
  p256dh: z.string().min(1).max(255),
  auth: z.string().min(1).max(255),
  userAgent: z.string().max(512).optional().nullable(),
});

const EndpointInput = z.object({
  endpoint: z.string().url().max(2048),
});

/** Devuelve la clave pública VAPID (segura de exponer al cliente). */
export const getVapidPublicKey = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) throw new Error("VAPID_PUBLIC_KEY not configured");
  return { publicKey: key };
});

/** Registra o actualiza (upsert por endpoint) una suscripción push del usuario. */
export const registerPushSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => SubscriptionInput.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: existing, error: findErr } = await supabase
      .from("push_subscriptions")
      .select("id, user_id, revoked_at")
      .eq("endpoint", data.endpoint)
      .maybeSingle();

    if (findErr) throw new Error(`registerPushSubscription lookup: ${findErr.message}`);

    if (existing) {
      // Si pertenece a otro user (ej: dispositivo compartido), lo re-asignamos.
      const { error: updErr } = await supabase
        .from("push_subscriptions")
        .update({
          user_id: userId,
          p256dh: data.p256dh,
          auth: data.auth,
          user_agent: data.userAgent ?? null,
          revoked_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (updErr) throw new Error(`registerPushSubscription update: ${updErr.message}`);
      return { ok: true as const, id: existing.id, updated: true };
    }

    const { data: inserted, error: insErr } = await supabase
      .from("push_subscriptions")
      .insert({
        user_id: userId,
        endpoint: data.endpoint,
        p256dh: data.p256dh,
        auth: data.auth,
        user_agent: data.userAgent ?? null,
      })
      .select("id")
      .single();

    if (insErr) throw new Error(`registerPushSubscription insert: ${insErr.message}`);
    return { ok: true as const, id: inserted.id, updated: false };
  });

/** Marca una suscripción como revocada (soft-delete). */
export const unregisterPushSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => EndpointInput.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("push_subscriptions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("endpoint", data.endpoint)
      .eq("user_id", userId);
    if (error) throw new Error(`unregisterPushSubscription: ${error.message}`);
    return { ok: true as const };
  });

/** Envía una notificación de prueba al usuario actual (todas sus suscripciones activas). */
export const sendTestPush = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: subs, error } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", userId)
      .is("revoked_at", null);
    if (error) throw new Error(error.message);
    if (!subs || subs.length === 0) {
      return { ok: false as const, reason: "no_subscriptions", sent: 0 };
    }
    const { sendWebPush } = await import("./webpush.server");
    let sent = 0;
    let goneCount = 0;
    for (const sub of subs) {
      const res = await sendWebPush(sub, {
        title: "SoundKeleles 🤙",
        body: "Las notificaciones están activadas correctamente.",
        url: "/",
        tag: "test-push",
      });
      if (res.ok) sent++;
      if (res.gone) {
        goneCount++;
        await supabase
          .from("push_subscriptions")
          .update({ revoked_at: new Date().toISOString() })
          .eq("endpoint", sub.endpoint);
      }
    }
    return { ok: sent > 0, sent, gone: goneCount };
  });
