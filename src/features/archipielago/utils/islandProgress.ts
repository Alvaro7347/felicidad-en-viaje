import {
  MVP1_LESSON_SEQUENCE,
  type IslandId,
} from "../data/mvp1Progress";

export interface IslandProgressInput {
  isLessonCompleted: (lessonId: string) => boolean;
}

export function getIslandProgress(
  progress: IslandProgressInput,
  islandId: IslandId,
): { completed: number; total: number; pct: number } {
  const lessons = MVP1_LESSON_SEQUENCE.filter((l) => l.islandId === islandId);
  const total = lessons.length;
  const completed = lessons.filter((l) => progress.isLessonCompleted(l.lessonId)).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, pct };
}
