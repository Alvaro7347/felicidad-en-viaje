/**
 * Server functions del Centro de Ajustes.
 *
 * Contrato: TODO acceso a user_settings y profile pasa por aquí. El cliente
 * NUNCA escribe directamente en esas tablas — así RLS + validación + inferencia
 * de defaults viven en un único lugar.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ThemeSchema = z.enum(["system", "light", "dark"]);

const UpdateSettingsSchema = z
  .object({
    theme: ThemeSchema.optional(),
    notifications_enabled: z.boolean().optional(),
    weekly_report_enabled: z.boolean().optional(),
    inactivity_reminders_enabled: z.boolean().optional(),
    important_notices_enabled: z.boolean().optional(),
    timezone: z.string().min(1).max(64).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, "empty update");

const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

const AvatarPathSchema = z.object({
  path: z.string().trim().min(1).max(255).nullable(),
});

/** Bootstrap: garantiza fila en user_settings + retorna profile + settings + suscripciones activas. */
export const getSettingsBootstrap = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: existing, error: readErr } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (readErr) throw new Error(`getSettingsBootstrap read: ${readErr.message}`);

    let settings = existing;
    if (!settings) {
      const { data: inserted, error: insErr } = await supabase
        .from("user_settings")
        .insert({ user_id: userId })
        .select("*")
        .single();
      if (insErr) throw new Error(`getSettingsBootstrap init: ${insErr.message}`);
      settings = inserted;
    }

    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("id, name, email, experience_mode")
      .eq("id", userId)
      .maybeSingle();
    if (pErr) throw new Error(`getSettingsBootstrap profile: ${pErr.message}`);

    const { data: subs, error: sErr } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, user_agent, created_at")
      .eq("user_id", userId)
      .is("revoked_at", null)
      .order("created_at", { ascending: false });
    if (sErr) throw new Error(`getSettingsBootstrap subs: ${sErr.message}`);

    return { settings, profile, subscriptions: subs ?? [] };
  });

/** Actualiza cualquier subconjunto de user_settings. */
export const updateUserSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => UpdateSettingsSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const patch = { ...data, updated_at: new Date().toISOString() };
    const { data: row, error } = await supabase
      .from("user_settings")
      .update(patch)
      .eq("user_id", userId)
      .select("*")
      .single();
    if (error) throw new Error(`updateUserSettings: ${error.message}`);
    return row;
  });

/** Renombra el perfil (mismo campo que consume el resto del MVP1). */
export const updateProfileName = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => UpdateProfileSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({ name: data.name, updated_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) throw new Error(`updateProfileName: ${error.message}`);
    return { ok: true as const, name: data.name };
  });

/** Persiste ruta del avatar en Storage. El upload ocurre en cliente contra el bucket privado 'avatars'. */
export const updateAvatarPath = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => AvatarPathSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("user_settings")
      .update({ avatar_path: data.path, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
    if (error) throw new Error(`updateAvatarPath: ${error.message}`);
    return { ok: true as const, path: data.path };
  });

/**
 * Registra actividad significativa del usuario. Idempotente y barato.
 * Actualiza user_settings.last_active_at (fuente única de verdad para reactivación).
 * Llamar en: login, completar clase, guardar progreso, comentar, reaccionar, terminar diagnóstico.
 */
export const recordActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: { kind?: string } | undefined) => {
    const kind = typeof raw?.kind === "string" ? raw.kind.slice(0, 40) : "generic";
    return { kind };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const now = new Date().toISOString();

    // upsert por si aún no existe fila (usuario recién creado, sin abrir Ajustes).
    const { error } = await supabase
      .from("user_settings")
      .upsert(
        { user_id: userId, last_active_at: now, updated_at: now },
        { onConflict: "user_id" },
      );
    if (error) throw new Error(`recordActivity: ${error.message}`);

    // Registrar en app_events (best-effort; no bloqueante si falla).
    try {
      await supabase.from("app_events").insert({
        user_id: userId,
        event_name: `activity:${data.kind}`,
        event_data: {},
      });
    } catch (_) {
      /* ignore */
    }
    return { ok: true as const, at: now };
  });
