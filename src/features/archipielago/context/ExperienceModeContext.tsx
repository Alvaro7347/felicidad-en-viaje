import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ExperienceMode = "self_learning" | "accompanied_learning";

interface ExperienceModeContextValue {
  mode: ExperienceMode | null;
  loading: boolean;
  userId: string | null;
  setMode: (mode: ExperienceMode, opts?: { allowOverride?: boolean }) => Promise<void>;
  /** Limpia la modalidad consolidada (profiles.experience_mode = null) + cache. */
  clearMode: () => Promise<void>;
  refresh: () => Promise<void>;
  /** Cierra sesión y limpia todo caché per-user + claves legacy globales. */
  signOutAndClear: () => Promise<void>;
}

const Ctx = createContext<ExperienceModeContextValue | null>(null);

// Claves legacy — NUNCA se leen para decidir la modalidad de una cuenta autenticada.
// Se conservan sólo para poder borrarlas en signOut y evitar contaminación cruzada.
const LEGACY_KEYS = [
  "archipielago_experience_mode",
  "archipielago_selected_profile",
  "archipielago_user_name",
];

// Cache aislado por user_id.
const perUserKey = (uid: string) => `archipielago_experience_mode_v2:${uid}`;

function readPerUserCache(uid: string): ExperienceMode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(perUserKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { userId?: string; mode?: string };
    if (parsed.userId !== uid) return null;
    if (parsed.mode === "self_learning" || parsed.mode === "accompanied_learning") return parsed.mode;
    return null;
  } catch {
    return null;
  }
}

function writePerUserCache(uid: string, mode: ExperienceMode | null) {
  if (typeof window === "undefined") return;
  try {
    if (mode) {
      window.localStorage.setItem(perUserKey(uid), JSON.stringify({ userId: uid, mode }));
    } else {
      window.localStorage.removeItem(perUserKey(uid));
    }
  } catch { /* noop */ }
}

function clearLegacyGlobalKeys() {
  if (typeof window === "undefined") return;
  try {
    for (const k of LEGACY_KEYS) window.localStorage.removeItem(k);
  } catch { /* noop */ }
}

export function ExperienceModeProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setModeState] = useState<ExperienceMode | null>(null);
  const [loading, setLoading] = useState(true);
  const lastUidRef = useRef<string | null>(null);

  const loadForUid = useCallback(async (uid: string | null) => {
    // Cambio de identidad: reset inmediato y sin fugas entre cuentas.
    if (lastUidRef.current !== uid) {
      lastUidRef.current = uid;
      setModeState(null);
    }
    setUserId(uid);
    setLoading(true);
    if (!uid) {
      // Sin sesión: no exponer modalidad heredada de otra cuenta.
      setModeState(null);
      setLoading(false);
      return;
    }
    // Hint optimista SÓLO si el caché está firmado con este user_id.
    const cached = readPerUserCache(uid);
    if (cached) setModeState(cached);

    const { data, error } = await supabase
      .from("profiles")
      .select("experience_mode")
      .eq("id", uid)
      .maybeSingle();
    // Si la sesión cambió mientras esperábamos, ignorar.
    if (lastUidRef.current !== uid) return;
    if (error) {
      // Error de red → mantener loading para que el caller muestre reintento
      // sin heredar modalidad de otra cuenta ni asignar por defecto.
      setModeState(cached ?? null);
      setLoading(false);
      return;
    }
    const m = (data?.experience_mode ?? null) as ExperienceMode | null;
    if (m) {
      setModeState(m);
      writePerUserCache(uid, m);
    } else {
      // Sin valor persistido: el caller decide (inferencia o selector).
      setModeState(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      await loadForUid(data.session?.user.id ?? null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      const nextUid = s?.user.id ?? null;
      if (event === "SIGNED_OUT" || nextUid !== lastUidRef.current) {
        // Cambio de identidad → reset agresivo antes de recargar.
        setModeState(null);
        setLoading(true);
        if (event === "SIGNED_OUT") clearLegacyGlobalKeys();
      }
      void loadForUid(nextUid);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadForUid]);

  const setMode = useCallback(async (next: ExperienceMode, opts?: { allowOverride?: boolean }) => {
    const allowOverride = opts?.allowOverride === true;
    const uid = userId ?? (await supabase.auth.getSession()).data.session?.user.id ?? null;
    if (!uid) {
      // No hay sesión: no persistir nada globalmente.
      return;
    }
    if (!allowOverride) {
      // Verificación server-side: la modalidad consolidada no se sobrescribe.
      const { data: existing } = await supabase
        .from("profiles")
        .select("experience_mode")
        .eq("id", uid)
        .maybeSingle();
      const current = (existing?.experience_mode ?? null) as ExperienceMode | null;
      if (current && current !== next) {
        console.warn("[experience_mode] setMode bloqueado: modalidad ya consolidada", {
          current,
          attempted: next,
        });
        setModeState(current);
        writePerUserCache(uid, current);
        return;
      }
      if (current === next) {
        setModeState(current);
        writePerUserCache(uid, current);
        return;
      }
    }
    setModeState(next);
    writePerUserCache(uid, next);
    await supabase.from("profiles").upsert(
      { id: uid, experience_mode: next, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );
  }, [userId]);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    await loadForUid(data.session?.user.id ?? null);
  }, [loadForUid]);

  const signOutAndClear = useCallback(async () => {
    // Reset in-memory ANTES del signOut para que la próxima sesión arranque limpia.
    setModeState(null);
    setLoading(true);
    lastUidRef.current = null;
    clearLegacyGlobalKeys();
    await supabase.auth.signOut().catch(() => {});
  }, []);

  return (
    <Ctx.Provider value={{ mode, loading, userId, setMode, refresh, signOutAndClear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useExperienceMode() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useExperienceMode debe usarse dentro de ExperienceModeProvider.");
  return v;
}
