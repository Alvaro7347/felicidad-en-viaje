/**
 * Gestiona la suscripción Web Push del navegador actual.
 * - Registra /sw.js solo si el entorno lo permite (fuera de preview/iframe).
 * - subscribe(): pide permiso al usuario, crea la suscripción y la sincroniza al backend.
 * - unsubscribe(): cancela en el navegador y marca revoked_at en el backend.
 * - status: 'unsupported' | 'blocked' | 'unregistered' | 'granted' | 'denied' | 'default'.
 */

import { useCallback, useEffect, useState } from "react";
import {
  b64urlToUint8Array,
  detectPushEnvironment,
} from "../utils/pushEnvironment";
import { settingsRepository } from "../services/settingsRepository";

export type PushStatus =
  | "loading"
  | "unsupported"
  | "blocked_preview"
  | "denied"
  | "default"
  | "granted";

interface State {
  status: PushStatus;
  reason: string | null;
  endpoint: string | null;
  busy: boolean;
  lastError: string | null;
}

export function usePushRegistration() {
  const [state, setState] = useState<State>({
    status: "loading",
    reason: null,
    endpoint: null,
    busy: false,
    lastError: null,
  });

  const evaluate = useCallback(async () => {
    const env = detectPushEnvironment();
    if (!env.supported) {
      setState((s) => ({
        ...s,
        status: env.blockedReason?.includes("editor") || env.blockedReason?.includes("publicada")
          ? "blocked_preview"
          : "unsupported",
        reason: env.blockedReason,
        endpoint: null,
      }));
      return;
    }
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const existing = await reg?.pushManager.getSubscription();
      const permission = Notification.permission;
      setState((s) => ({
        ...s,
        status:
          permission === "denied"
            ? "denied"
            : existing && permission === "granted"
              ? "granted"
              : "default",
        reason: null,
        endpoint: existing?.endpoint ?? null,
      }));
    } catch (e) {
      setState((s) => ({ ...s, status: "default", lastError: (e as Error).message }));
    }
  }, []);

  useEffect(() => {
    evaluate();
  }, [evaluate]);

  const subscribe = useCallback(async () => {
    setState((s) => ({ ...s, busy: true, lastError: null }));
    try {
      const env = detectPushEnvironment();
      if (!env.supported) {
        setState((s) => ({
          ...s,
          busy: false,
          status: "blocked_preview",
          reason: env.blockedReason,
        }));
        return { ok: false as const, reason: env.blockedReason };
      }

      // 1. Registrar el SW (idempotente).
      const reg =
        (await navigator.serviceWorker.getRegistration("/sw.js")) ??
        (await navigator.serviceWorker.register("/sw.js", { scope: "/" }));
      await navigator.serviceWorker.ready;

      // 2. Permiso.
      let perm = Notification.permission;
      if (perm === "default") perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState((s) => ({ ...s, busy: false, status: perm === "denied" ? "denied" : "default" }));
        return { ok: false as const, reason: `permission_${perm}` };
      }

      // 3. Clave VAPID pública.
      const { publicKey } = await settingsRepository.vapidPublicKey();

      // 4. Suscribir (o reutilizar existente).
      let subscription = await reg.pushManager.getSubscription();
      if (!subscription) {
        const keyBytes = b64urlToUint8Array(publicKey);
        const appKey = keyBytes.buffer.slice(
          keyBytes.byteOffset,
          keyBytes.byteOffset + keyBytes.byteLength,
        ) as ArrayBuffer;
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: appKey,
        });
      }


      // 5. Persistir en backend.
      const raw = subscription.toJSON();
      const p256dh = raw.keys?.p256dh;
      const auth = raw.keys?.auth;
      if (!raw.endpoint || !p256dh || !auth) {
        throw new Error("Invalid subscription payload");
      }
      await settingsRepository.registerSubscription({
        endpoint: raw.endpoint,
        p256dh,
        auth,
        userAgent: navigator.userAgent.slice(0, 500),
      });

      setState({
        status: "granted",
        reason: null,
        endpoint: raw.endpoint,
        busy: false,
        lastError: null,
      });
      return { ok: true as const, endpoint: raw.endpoint };
    } catch (e) {
      setState((s) => ({ ...s, busy: false, lastError: (e as Error).message }));
      return { ok: false as const, reason: (e as Error).message };
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setState((s) => ({ ...s, busy: true, lastError: null }));
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const subscription = await reg?.pushManager.getSubscription();
      const endpoint = subscription?.endpoint ?? null;
      if (subscription) await subscription.unsubscribe();
      if (endpoint) await settingsRepository.unregisterSubscription(endpoint);
      setState({
        status: "default",
        reason: null,
        endpoint: null,
        busy: false,
        lastError: null,
      });
      return { ok: true as const };
    } catch (e) {
      setState((s) => ({ ...s, busy: false, lastError: (e as Error).message }));
      return { ok: false as const, reason: (e as Error).message };
    }
  }, []);

  const sendTest = useCallback(async () => {
    setState((s) => ({ ...s, busy: true, lastError: null }));
    try {
      const res = await settingsRepository.sendTestPush();
      setState((s) => ({ ...s, busy: false }));
      return res;
    } catch (e) {
      setState((s) => ({ ...s, busy: false, lastError: (e as Error).message }));
      return { ok: false as const, reason: (e as Error).message };
    }
  }, []);

  return { ...state, subscribe, unsubscribe, sendTest, refresh: evaluate };
}
