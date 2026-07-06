import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  MVP1_LESSON_IDS,
  MVP1_LESSON_SEQUENCE,
  MVP1_LOCKED_ISLANDS,
  findMvp1Lesson,
  type IslandId,
} from "../data/mvp1Progress";

export type LessonStatus = "done" | "current" | "locked" | "future-blocked";

async function logEvent(name: string, data?: Record<string, unknown>) {
  try {
    const { data: sess } = await supabase.auth.getSession();
    await supabase.from("app_events").insert({
      user_id: sess.session?.user.id ?? null,
      event_name: name,
      event_data: (data ?? null) as never,
    });
  } catch {
    /* silencioso */
  }
}

export function useMvp1Progress() {
  const [userId, setUserId] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user.id ?? null;
    setUserId(uid);
    if (!uid) {
      setCompletedLessonIds(new Set());
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("lesson_id, status")
      .eq("user_id", uid)
      .eq("status", "completed");
    if (error) {
      setLoadError("No pudimos cargar tu avance. Intenta recargar la app.");
      setLoading(false);
      return;
    }
    setCompletedLessonIds(new Set((data ?? []).map((r) => r.lesson_id)));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => completedLessonIds.has(lessonId),
    [completedLessonIds],
  );

  // Próxima clase no completada dentro de la secuencia MVP1
  const getCurrentLessonId = useCallback((): string | null => {
    for (const entry of MVP1_LESSON_SEQUENCE) {
      if (!completedLessonIds.has(entry.lessonId)) return entry.lessonId;
    }
    return null;
  }, [completedLessonIds]);

  const getNextLessonId = useCallback(
    (lessonId: string): string | null => {
      const idx = MVP1_LESSON_IDS.indexOf(lessonId);
      if (idx === -1 || idx === MVP1_LESSON_IDS.length - 1) return null;
      return MVP1_LESSON_IDS[idx + 1];
    },
    [],
  );

  const isLessonUnlocked = useCallback(
    (lessonId: string): boolean => {
      // Sólo lecciones dentro de la secuencia MVP1 pueden estar desbloqueadas
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
      const { error } = await supabase
        .from("lesson_progress")
        .upsert(
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
        return {
          ok: false,
          error: "No pudimos guardar tu avance. Revisa tu conexión e intenta nuevamente.",
        };
      }
      setCompletedLessonIds((prev) => {
        const next = new Set(prev);
        next.add(lessonId);
        return next;
      });
      logEvent("lesson_completed", { lesson_id: lessonId, island_id: islandId });
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
        return { ok: false, error: error.message };
      }
      logEvent("lesson_checkin_submitted", {
        lesson_id: params.lessonId,
        island_id: params.islandId,
        answer: params.answer,
      });
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
    refreshProgress: load,
    logEvent,
  };
}
