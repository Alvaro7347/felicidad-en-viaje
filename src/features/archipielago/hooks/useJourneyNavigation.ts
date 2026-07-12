// Hook de navegación pedagógica (Commit 3 del saneamiento estructural).
//
// Centraliza cómo se abren misiones, lecciones e islas, cómo se aplica el
// modal de bloqueo y cómo se registran los eventos de navegación. NO cambia
// comportamiento visible: es una extracción 1:1 de la lógica que vivía
// inline en ArchipelagoApp.tsx.
//
// Reglas de este módulo (ver ticket Commit 3):
//   - No consulta Supabase.
//   - No guarda datos ni cambia modalidad.
//   - No renderiza componentes ni conoce textos visuales.
//   - No usa localStorage.
//   - No usa startsWith("n"|"m"|"p") para decidir navegación: usa
//     findMvp1Lesson + ISLAND_TO_LESSON_SCREEN + ISLAND_TO_ISLAND_SCREEN.

import { useCallback, useMemo } from "react";

import type { Screen } from "../types";
import { findMvp1Lesson, type IslandId } from "../data/mvp1Progress";
import { ISLAND_TO_ISLAND_SCREEN, ISLAND_TO_LESSON_SCREEN } from "../data/journeyCatalog";

export type ProgressLike = {
  loading: boolean;
  isLessonUnlocked: (lessonId: string) => boolean;
  getCurrentLessonId: () => string | null;
  logEvent: (name: string, payload?: Record<string, unknown>) => void;
};

export type ExperienceModeValue = "self_learning" | "accompanied_learning" | null;

export type LessonSetters = Partial<Record<IslandId, (lessonId: string) => void>>;

export interface UseJourneyNavigationArgs {
  progress: ProgressLike;
  experienceMode: ExperienceModeValue;
  setScreen: (screen: Screen) => void;
  setBlockedModal: (value: null | "island" | "lesson") => void;
  setJourneyOrigin: (value: "student" | "parent") => void;
  setRouteStudentName: (value: string | undefined) => void;
  /** Mapa islandId → setter del lessonId activo de esa isla. */
  lessonSetters: LessonSetters;
}

export interface JourneyNavigation {
  /** Abre el dashboard según la modalidad (self → self-journey, parent → parent-journey-dashboard). */
  goHome: () => void;
  /** Abre RouteScreen preservando journeyOrigin según la modalidad. */
  goToRoute: () => void;
  /** Abre una misión del Puerto de Inicio (n1..n9) con validación de progreso. */
  openMission: (lessonId: string) => void;
  /**
   * Abre cualquier lección MVP1 con validación de progreso. Resuelve por sí
   * misma la pantalla destino y el setter de lessonId adecuado a partir del
   * catálogo (sin usar startsWith).
   */
  openLesson: (lessonId: string) => void;
  /** Continúa el viaje desde la lección actual (o la indicada). */
  continueJourney: (lessonId: string | null) => void;
  /** Abre la pantalla de una isla (no la lección). */
  openIsland: (islandId: IslandId) => void;
  /** Muestra el modal de isla bloqueada y registra el evento. */
  openLockedIsland: (islandId: string) => void;
}


export function useJourneyNavigation(args: UseJourneyNavigationArgs): JourneyNavigation {
  const {
    progress,
    experienceMode,
    setScreen,
    setBlockedModal,
    setJourneyOrigin,
    setRouteStudentName,
    lessonSetters,
  } = args;

  const resolveScreenForLesson = useCallback((lessonId: string): Screen | null => {
    const entry = findMvp1Lesson(lessonId);
    if (!entry) return null;
    if (entry.islandId === "start-port") return entry.screen;
    return ISLAND_TO_LESSON_SCREEN[entry.islandId];
  }, []);

  const openLockedIsland = useCallback(
    (islandId: string) => {
      setBlockedModal("island");
      progress.logEvent("blocked_island_clicked", { island_id: islandId });
    },
    [progress, setBlockedModal],
  );

  const openMission = useCallback(
    (lessonId: string) => {
      if (progress.loading) return;
      const entry = findMvp1Lesson(lessonId);
      if (!entry) return;
      if (!progress.isLessonUnlocked(lessonId)) {
        setBlockedModal("lesson");
        progress.logEvent("blocked_lesson_clicked", { lesson_id: lessonId });
        return;
      }
      setScreen(entry.screen);
      progress.logEvent("lesson_opened", { lesson_id: lessonId });
    },
    [progress, setScreen, setBlockedModal],
  );

  const openLesson = useCallback(
    (lessonId: string) => {
      if (progress.loading) return;
      const entry = findMvp1Lesson(lessonId);
      if (!entry) return;
      if (!progress.isLessonUnlocked(lessonId)) {
        setBlockedModal("lesson");
        progress.logEvent("blocked_lesson_clicked", { lesson_id: lessonId });
        return;
      }
      const destination = resolveScreenForLesson(lessonId);
      if (!destination) return;
      if (entry.islandId !== "start-port") {
        lessonSetters[entry.islandId]?.(lessonId);
      }
      setScreen(destination);
      progress.logEvent("lesson_opened", { lesson_id: lessonId });
    },
    [progress, setScreen, setBlockedModal, lessonSetters, resolveScreenForLesson],
  );


  const openIsland = useCallback(
    (islandId: IslandId) => {
      setScreen(ISLAND_TO_ISLAND_SCREEN[islandId]);
    },
    [setScreen],
  );

  const goToRoute = useCallback(() => {
    if (experienceMode === "accompanied_learning") {
      setJourneyOrigin("parent");
      // routeStudentName se mantiene tal como fue hidratado desde parent_journeys.
    } else {
      setJourneyOrigin("student");
      setRouteStudentName(undefined);
    }
    setScreen("route");
  }, [experienceMode, setScreen, setJourneyOrigin, setRouteStudentName]);

  const goHome = useCallback(() => {
    if (experienceMode === "accompanied_learning") {
      setScreen("parent-journey-dashboard");
    } else {
      // Alejandra (self_learning): "Mi viaje" es el dashboard personal,
      // no el Archipiélago pedagógico.
      setScreen("self-journey");
    }
  }, [experienceMode, setScreen]);

  const continueJourney = useCallback(
    (lessonId: string | null) => {
      if (progress.loading) return;
      const cur = lessonId ?? progress.getCurrentLessonId();
      if (!cur) {
        setScreen("route");
        return;
      }
      openLesson(cur);
    },
    [progress, setScreen, openLesson],
  );

  return useMemo(
    () => ({
      resolveScreenForLesson,
      goHome,
      goToRoute,
      openMission,
      openLesson,
      continueJourney,
      openIsland,
      openLockedIsland,
    }),
    [
      resolveScreenForLesson,
      goHome,
      goToRoute,
      openMission,
      openLesson,
      continueJourney,
      openIsland,
      openLockedIsland,
    ],
  );
}
