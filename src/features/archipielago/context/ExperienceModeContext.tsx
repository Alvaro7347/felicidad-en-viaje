import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ExperienceMode = "self_learning" | "accompanied_learning";

interface ExperienceModeContextValue {
  mode: ExperienceMode | null;
  loading: boolean;
  setMode: (mode: ExperienceMode) => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<ExperienceModeContextValue | null>(null);

const LS_CACHE_KEY = "archipielago_experience_mode";

function readCache(): ExperienceMode | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(LS_CACHE_KEY);
    if (v === "self_learning" || v === "accompanied_learning") return v;
    // Fallback a la caché legacy de perfil seleccionado.
    const legacy = window.localStorage.getItem("archipielago_selected_profile");
    if (legacy === "alejandra") return "self_learning";
    if (legacy === "maria_jose") return "accompanied_learning";
  } catch { /* noop */ }
  return null;
}

function writeCache(mode: ExperienceMode | null) {
  if (typeof window === "undefined") return;
  try {
    if (mode) window.localStorage.setItem(LS_CACHE_KEY, mode);
    else window.localStorage.removeItem(LS_CACHE_KEY);
  } catch { /* noop */ }
}

export function ExperienceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ExperienceMode | null>(() => readCache());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user.id ?? null;
    setUserId(uid);
    if (!uid) {
      setModeState(readCache());
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("experience_mode")
      .eq("id", uid)
      .maybeSingle();
    const m = (data?.experience_mode ?? null) as ExperienceMode | null;
    if (m) {
      setModeState(m);
      writeCache(m);
    } else {
      // Sin valor en DB → usar caché como fallback (no persistimos aún).
      setModeState(readCache());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { load(); });
    return () => { sub.subscription.unsubscribe(); };
  }, [load]);

  const setMode = useCallback(async (next: ExperienceMode) => {
    setModeState(next);
    writeCache(next);
    // Cache legacy para compatibilidad con código existente.
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          "archipielago_selected_profile",
          next === "self_learning" ? "alejandra" : "maria_jose",
        );
      } catch { /* noop */ }
    }
    const uid = userId ?? (await supabase.auth.getSession()).data.session?.user.id ?? null;
    if (!uid) return;
    await supabase.from("profiles").upsert(
      { id: uid, experience_mode: next, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );
  }, [userId]);

  return (
    <Ctx.Provider value={{ mode, loading, setMode, refresh: load }}>
      {children}
    </Ctx.Provider>
  );
}

export function useExperienceMode() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useExperienceMode debe usarse dentro de ExperienceModeProvider.");
  return v;
}
