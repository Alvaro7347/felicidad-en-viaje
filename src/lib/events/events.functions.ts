/**
 * Server function única y autenticada para registrar eventos de aplicación.
 *
 * Contrato:
 * - `user_id` SIEMPRE se toma de `context.userId` (sesión verificada por
 *   `requireSupabaseAuth`). Nunca aceptamos `user_id` del cliente.
 * - `event_name` se valida contra un formato estricto (a-z0-9._-, max 80 chars).
 * - `event_data` se sanitiza: objeto plano, hasta 20 claves, valores escalares
 *   (string ≤ 500 chars, number finito, boolean, null). Se descarta el resto.
 *
 * La RLS de `app_events` ya impide escribir eventos para otro usuario
 * (`INSERT WITH CHECK auth.uid() = user_id`), esta función añade defensa en
 * profundidad y un único punto de entrada auditables desde el cliente.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const EVENT_NAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,79}$/;
const MAX_DATA_KEYS = 20;
const MAX_STRING_LEN = 500;
const MAX_KEY_LEN = 40;
const KEY_RE = /^[a-zA-Z0-9_]{1,40}$/;

function sanitizeEventData(input: unknown): Record<string, unknown> | null {
  if (input == null) return null;
  if (typeof input !== "object" || Array.isArray(input)) return null;
  const raw = input as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  let count = 0;
  for (const key of Object.keys(raw)) {
    if (count >= MAX_DATA_KEYS) break;
    if (key.length > MAX_KEY_LEN || !KEY_RE.test(key)) continue;
    const value = raw[key];
    if (value === null) {
      out[key] = null;
      count++;
      continue;
    }
    if (typeof value === "string") {
      out[key] = value.slice(0, MAX_STRING_LEN);
      count++;
      continue;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      out[key] = value;
      count++;
      continue;
    }
    if (typeof value === "boolean") {
      out[key] = value;
      count++;
      continue;
    }
    // Ignoramos objetos anidados, arrays, funciones, symbols, etc.
  }
  return out;
}

const InputSchema = z.object({
  event_name: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .refine((s) => EVENT_NAME_RE.test(s), "invalid event_name"),
  event_data: z.unknown().optional(),
});

export const recordAppEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => InputSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const cleanData = sanitizeEventData(data.event_data);
    const { error } = await supabase.from("app_events").insert({
      user_id: userId,
      event_name: data.event_name,
      event_data: cleanData as never,
    });
    if (error) {
      // No devolvemos detalles del error al cliente; log server-side.
      console.error("[recordAppEvent] insert failed", {
        userId,
        event_name: data.event_name,
        message: error.message,
      });
      throw new Error("recordAppEvent failed");
    }
    return { ok: true as const };
  });
