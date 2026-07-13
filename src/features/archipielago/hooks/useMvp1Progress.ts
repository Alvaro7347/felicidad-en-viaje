import { useCallback, useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { recordActivity } from "@/lib/settings/settings.functions";
import { recordAppEvent } from "@/lib/events/events.functions";
import {
  MVP1_LESSON_IDS,
  MVP1_LESSON_SEQUENCE,
  MVP1_LOCKED_ISLANDS,
  findMvp1Lesson,
  type IslandId,
} from "../data/mvp1Progress";

export type LessonStatus = "done" | "current" | "locked" | "future-blocked";

// ── Store global compartido (single source of truth) ───────────────
interface ProgressState {
  userId: string | null;
  completedLessonIds: Set<string>;
  loading: boolean;
  loadError: string | null;
}

let state: ProgressState = {
  userId: null,
  completedLessonIds: new Set(),
  loading: true,
  loadError: null,
};

const listeners = new Set<() => void>();

function setState(patch: Partial<ProgressState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot() {
  return state;
}

// Control por generación: sólo la carga más reciente puede aplicar resultados.
// Cualquier respuesta con `gen !== loadGen` se descarta silenciosamente.
let loadGen = 0;
let currentUid: string | null = null;
let authSubscription: { unsubscribe: () => void } | null = null;

function resetForUid(uid: string | null) {
  currentUid = uid;
  setState({
    userId: uid,
    completedLessonIds: new Set(),
    loading: true,
    loadError: null,
  });
}

async function loadProgress(): Promise<void> {
  const gen = ++loadGen;
  setState({ loading: true, loadError: null });

  const { data: sess } = await supabase.auth.getSession();
  if (gen !== loadGen) return;

  const uid = sess.session?.user.id ?? null;

  // Cambio de identidad detectado en medio de la carga → reset agresivo antes
  // de continuar, así el usuario nuevo nunca ve datos del anterior.
  if (uid !== currentUid) {
    currentUid = uid;
    setState({ userId: uid, completedLessonIds: new Set() });
  }

  if (!uid) {
    setState({ userId: null, completedLessonIds: new Set(), loading: false });
    return;
  }

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, status")
    .eq("user_id", uid)
    .eq("status", "completed");

  if (gen !== loadGen) return;

  if (error) {
    setState({
      userId: uid,
      loading: false,
      loadError: "No pudimos cargar tu avance. Intenta recargar la app.",
    });
    return;
  }
  setState({
    userId: uid,
    completedLessonIds: new Set((data ?? []).map((r) => r.lesson_id)),
    loading: false,
  });
}

function ensureAuthListener() {
  if (authSubscription) return;
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    const nextUid = session?.user.id ?? null;
    if (event === "SIGNED_OUT") {
      resetForUid(null);
    } else if (nextUid !== currentUid) {
      resetForUid(nextUid);
    }
    void loadProgress();
  });
  authSubscription = data.subscription;
}

// Evita listeners duplicados en HMR / hot reload / test re-mounts.
if (
  typeof import.meta !== "undefined" &&
  (import.meta as { hot?: { dispose: (cb: () => void) => void } }).hot
) {
  (import.meta as { hot: { dispose: (cb: () => void) => void } }).hot.dispose(() => {
    authSubscription?.unsubscribe();
    authSubscription = null;
    listeners.clear();
    loadGen++;
  });
}

async function logEvent(name: string, data?: Record<string, unknown>) {
  try {
    // La server function fija user_id desde la sesión; no la llamamos si no hay
    // sesión activa (evita 401 innecesarios).
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session?.user.id) return;
    await recordAppEvent({ data: { event_name: name, event_data: data } });
  } catch {
    /* silencioso */
  }
}

export function useMvp1Progress() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    ensureAuthListener();
    loadProgress();
  }, []);

  const { userId, completedLessonIds, loading, loadError } = snap;

  const isLessonCompleted = useCallback(
    (lessonId: string) => completedLessonIds.has(lessonId),
    [completedLessonIds],
  );

  const getCurrentLessonId = useCallback((): string | null => {
    for (const entry of MVP1_LESSON_SEQUENCE) {
      if (!completedLessonIds.has(entry.lessonId)) return entry.lessonId;
    }
    return null;
  }, [completedLessonIds]);

  const getNextLessonId = useCallback((lessonId: string): string | null => {
    const idx = MVP1_LESSON_IDS.indexOf(lessonId);
    if (idx === -1 || idx === MVP1_LESSON_IDS.length - 1) return null;
    return MVP1_LESSON_IDS[idx + 1];
  }, []);

  const isLessonUnlocked = useCallback(
    (lessonId: string): boolean => {
      if (!MVP1_LESSON_IDS.includes(lessonId)) return false;
      if (completedLessonIds.has(lessonId)) return true;
      const current = getCurrentLessonId();
      return current === lessonId;
    },
    [completedLessonIds, getCurrentLessonId],
  );

  const getLessonStatus = useCallback(
    (lessonId: string): LessonStatus => {
      if (!MVP1_LESSON_IDS.includes(lessonId)) return "future-blocked";
      if (completedLessonIds.has(lessonId)) return "done";
      const current = getCurrentLessonId();
      if (current === lessonId) return "current";
      return "locked";
    },
    [completedLessonIds, getCurrentLessonId],
  );

  const isIslandLocked = useCallback(
    (islandId: IslandId): boolean => MVP1_LOCKED_ISLANDS.includes(islandId),
    [],
  );

  const completeLesson = useCallback(
    async (
      lessonId: string,
      opts?: { islandId?: IslandId },
    ): Promise<{ ok: boolean; error?: string }> => {
      const entry = findMvp1Lesson(lessonId);
      const islandId = (opts?.islandId ?? entry?.islandId ?? "start-port") as IslandId;
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!uid) {
        return { ok: false, error: "Debes iniciar sesión para guardar tu avance." };
      }
      const { error } = await supabase.from("lesson_progress").upsert(
        {
          user_id: uid,
          lesson_id: lessonId,
          island_id: islandId,
          status: "completed",
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );
      if (error) {
        logEvent("lesson_progress_save_error", {
          lesson_id: lessonId,
          island_id: islandId,
          message: error.message,
        });
        return {
          ok: false,
          error: "No pudimos guardar tu avance. Revisa tu conexión e intenta nuevamente.",
        };
      }
      // Actualiza el store global inmediatamente → todos los consumidores re-renderizan.
      const nextSet = new Set(state.completedLessonIds);
      nextSet.add(lessonId);
      setState({ completedLessonIds: nextSet });
      logEvent("lesson_completed", { lesson_id: lessonId, island_id: islandId });
      // Marca actividad significativa para el ciclo de reactivación (best-effort).
      recordActivity({ data: { kind: "lesson_completed" } }).catch(() => {});
      return { ok: true };
    },
    [],
  );

  const submitCheckin = useCallback(
    async (params: {
      lessonId: string;
      islandId: IslandId;
      question: string;
      answer: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!uid) return { ok: false, error: "Sin sesión" };
      const { error } = await supabase.from("lesson_checkins").insert({
        user_id: uid,
        lesson_id: params.lessonId,
        island_id: params.islandId,
        question: params.question,
        answer: params.answer,
      });
      if (error) {
        logEvent("checkin_save_error", {
          lesson_id: params.lessonId,
          island_id: params.islandId,
          reason: error.message,
        });
        return { ok: false, error: error.message };
      }
      logEvent("lesson_checkin_submitted", {
        lesson_id: params.lessonId,
        island_id: params.islandId,
        answer: params.answer,
      });
      recordActivity({ data: { kind: "lesson_checkin" } }).catch(() => {});
      return { ok: true };
    },
    [],
  );

  return {
    userId,
    loading,
    loadError,
    completedLessonIds,
    isLessonCompleted,
    isLessonUnlocked,
    getLessonStatus,
    isIslandLocked,
    completeLesson,
    submitCheckin,
    getCurrentLessonId,
    getNextLessonId,
    refreshProgress: loadProgress,
    logEvent,
  };
}
