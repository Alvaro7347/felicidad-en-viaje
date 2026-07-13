/**
 * Detecta contextos donde NO se debe registrar el Service Worker de Push:
 * preview de Lovable, iframe, dev, o cuando el navegador no soporta Push.
 */
export interface PushEnvironment {
  supported: boolean;
  blockedReason: string | null; // null si está OK para intentar
}

export function detectPushEnvironment(): PushEnvironment {
  if (typeof window === "undefined") {
    return { supported: false, blockedReason: "SSR" };
  }
  if (!("serviceWorker" in navigator)) {
    return { supported: false, blockedReason: "Este navegador no soporta Service Workers." };
  }
  if (!("PushManager" in window)) {
    return { supported: false, blockedReason: "Este navegador no soporta Web Push." };
  }
  if (typeof Notification === "undefined") {
    return { supported: false, blockedReason: "Este navegador no soporta notificaciones." };
  }

  const host = window.location.hostname;
  const inIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();
  const isPreview =
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" ||
    host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" ||
    host.endsWith(".beta.lovable.dev");

  if (inIframe) {
    return {
      supported: false,
      blockedReason:
        "Las notificaciones no funcionan dentro del editor. Abre la app publicada en una pestaña completa.",
    };
  }
  if (isPreview) {
    return {
      supported: false,
      blockedReason:
        "Las notificaciones sólo están disponibles en la versión publicada de la app.",
    };
  }
  const isSecure =
    window.location.protocol === "https:" ||
    host === "localhost" ||
    host === "127.0.0.1";
  if (!isSecure) {
    return { supported: false, blockedReason: "Requiere HTTPS." };
  }
  return { supported: true, blockedReason: null };
}

/** Convierte base64url (VAPID public key) a Uint8Array esperado por pushManager.subscribe. */
export function b64urlToUint8Array(base64url: string): Uint8Array {
  const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
