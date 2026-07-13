/**
 * Repositorio del Centro de Ajustes.
 * Única puerta desde el cliente hacia las server-fns de settings/push/activity.
 * No debe existir ninguna otra llamada directa a esas server-fns desde la UI.
 */

import {
  getSettingsBootstrap,
  updateUserSettings,
  updateProfileName,
  updateAvatarPath,
  recordActivity,
} from "@/lib/settings/settings.functions";
import {
  getVapidPublicKey,
  registerPushSubscription,
  unregisterPushSubscription,
  sendTestPush,
} from "@/lib/push/push.functions";
import { supabase } from "@/integrations/supabase/client";

export type SettingsBootstrap = Awaited<ReturnType<typeof getSettingsBootstrap>>;
export type UserSettingsRow = SettingsBootstrap["settings"];

export const settingsRepository = {
  bootstrap: () => getSettingsBootstrap(),
  updateSettings: (patch: Parameters<typeof updateUserSettings>[0] extends undefined ? never : { data: Parameters<typeof updateUserSettings>[0] extends { data: infer D } ? D : never }) =>
    updateUserSettings(patch),
  updateName: (name: string) => updateProfileName({ data: { name } }),
  setAvatarPath: (path: string | null) => updateAvatarPath({ data: { path } }),
  vapidPublicKey: () => getVapidPublicKey(),
  registerSubscription: (input: {
    endpoint: string;
    p256dh: string;
    auth: string;
    userAgent?: string | null;
  }) => registerPushSubscription({ data: input }),
  unregisterSubscription: (endpoint: string) =>
    unregisterPushSubscription({ data: { endpoint } }),
  sendTestPush: () => sendTestPush(),
  recordActivity: (kind: string) => recordActivity({ data: { kind } }),
};

/** URL firmada de corta vida para renderizar el avatar (bucket privado). */
export async function getAvatarSignedUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/**
 * Sube un avatar al bucket privado.
 * Path canónico: `${userId}/avatar-${timestamp}.${ext}` — cumple la RLS
 * `((storage.foldername(name))[1] = auth.uid())`.
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const path = `${userId}/avatar-${Date.now()}.${safeExt}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: false,
    contentType: file.type || `image/${safeExt}`,
  });
  if (error) throw new Error(`upload avatar: ${error.message}`);
  return path;
}

export async function deleteAvatarObject(path: string): Promise<void> {
  await supabase.storage.from("avatars").remove([path]);
}
