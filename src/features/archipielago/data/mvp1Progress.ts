import type { Screen } from "../types";

export const MVP1_LAST_UNLOCKED_LESSON_ID = "p11";

export type IslandId =
  | "start-port"
  | "first-melodies"
  | "pulse"
  | "rhythm"
  | "music"
  | "joy"
  | "chords"
  | "strumming"
  | "songs";

export interface Mvp1LessonEntry {
  lessonId: string;
  islandId: IslandId;
  screen: Screen;
  label: string;
  order: number;
  isMvp1Enabled: boolean;
}

// Islas visibles pero bloqueadas durante MVP1
export const MVP1_LOCKED_ISLANDS: IslandId[] = [
  "rhythm",
  "music",
  "joy",
  "chords",
  "strumming",
  "songs",
];

export const MVP1_LESSON_SEQUENCE: Mvp1LessonEntry[] = [
  // Puerto de Inicio
  { lessonId: "n1", islandId: "start-port", screen: "mission-guide", label: "Conoce a tu guía", order: 1, isMvp1Enabled: true },
  { lessonId: "n2", islandId: "start-port", screen: "mission-two", label: "Cuéntanos de ti", order: 2, isMvp1Enabled: true },
  { lessonId: "n3", islandId: "start-port", screen: "mission-three", label: "Qué es el Archipiélago", order: 3, isMvp1Enabled: true },
  { lessonId: "n4", islandId: "start-port", screen: "mission-four", label: "Historia y Partes del Ukelele", order: 4, isMvp1Enabled: true },
  { lessonId: "n6", islandId: "start-port", screen: "mission-six", label: "Quiz Partes del Ukelele", order: 5, isMvp1Enabled: true },
  { lessonId: "n7", islandId: "start-port", screen: "mission-seven", label: "Toma tu ukelele sin tensión", order: 6, isMvp1Enabled: true },
  { lessonId: "n8", islandId: "start-port", screen: "mission-eight", label: "Afina tu primer sonido", order: 7, isMvp1Enabled: true },
  { lessonId: "n9", islandId: "start-port", screen: "mission-nine", label: "Listo para zarpar", order: 8, isMvp1Enabled: true },
  // Isla de Primeras Melodías
  { lessonId: "m1", islandId: "first-melodies", screen: "first-melodies-lesson", label: "Tu primer acorde: DO", order: 9, isMvp1Enabled: true },
  { lessonId: "m2", islandId: "first-melodies", screen: "first-melodies-lesson", label: "Mapa visual del DO", order: 10, isMvp1Enabled: true },
  { lessonId: "m3", islandId: "first-melodies", screen: "first-melodies-lesson", label: "Dos nuevos amigos: LAm y FA", order: 11, isMvp1Enabled: true },
  { lessonId: "m4", islandId: "first-melodies", screen: "first-melodies-lesson", label: "Mapas visuales LAm y FA", order: 12, isMvp1Enabled: true },
  { lessonId: "m5", islandId: "first-melodies", screen: "first-melodies-lesson", label: "Tu primera estrofa: Tren al Sur", order: 13, isMvp1Enabled: true },
  { lessonId: "m6", islandId: "first-melodies", screen: "first-melodies-lesson", label: "Stay With Me en acordes", order: 14, isMvp1Enabled: true },
  { lessonId: "m7", islandId: "first-melodies", screen: "first-melodies-lesson", label: "Karaoke Stay With Me", order: 15, isMvp1Enabled: true },
  { lessonId: "m8", islandId: "first-melodies", screen: "first-melodies-lesson", label: "Comparte tu primer logro", order: 16, isMvp1Enabled: true },
  { lessonId: "m9", islandId: "first-melodies", screen: "first-melodies-lesson", label: "Dedos despiertos", order: 17, isMvp1Enabled: true },
  { lessonId: "m10", islandId: "first-melodies", screen: "first-melodies-lesson", label: "Lo que ya conquistaste", order: 18, isMvp1Enabled: true },
  // Isla del Pulso
  { lessonId: "p1", islandId: "pulse", screen: "pulse-lesson", label: "El acorde de la luz: SOL", order: 19, isMvp1Enabled: true },
  { lessonId: "p2", islandId: "pulse", screen: "pulse-lesson", label: "Mapa visual del SOL", order: 20, isMvp1Enabled: true },
  { lessonId: "p3", islandId: "pulse", screen: "pulse-lesson", label: "Puente SOL–DO", order: 21, isMvp1Enabled: true },
  { lessonId: "p4", islandId: "pulse", screen: "pulse-lesson", label: "Leer el camino de los acordes", order: 22, isMvp1Enabled: true },
  { lessonId: "p5", islandId: "pulse", screen: "pulse-lesson", label: "La Vaca Lola en pulso", order: 23, isMvp1Enabled: true },
  { lessonId: "p6", islandId: "pulse", screen: "pulse-lesson", label: "Puente SOL–LAm", order: 24, isMvp1Enabled: true },
  { lessonId: "p7", islandId: "pulse", screen: "pulse-lesson", label: "Puente SOL–FA", order: 25, isMvp1Enabled: true },
  { lessonId: "p8", islandId: "pulse", screen: "pulse-lesson", label: "No se va en pulso", order: 26, isMvp1Enabled: true },
  { lessonId: "p9", islandId: "pulse", screen: "pulse-lesson", label: "Descifra la clave americana", order: 27, isMvp1Enabled: true },
  { lessonId: "p10", islandId: "pulse", screen: "pulse-lesson", label: "Despacito en pulso", order: 28, isMvp1Enabled: true },
  { lessonId: "p11", islandId: "pulse", screen: "pulse-lesson", label: "Calma marcando acorde", order: 29, isMvp1Enabled: true },
];

export const MVP1_LESSON_IDS = MVP1_LESSON_SEQUENCE.map((l) => l.lessonId);

export function findMvp1Lesson(lessonId: string): Mvp1LessonEntry | undefined {
  return MVP1_LESSON_SEQUENCE.find((l) => l.lessonId === lessonId);
}

// Check-ins críticos de cambio de acorde (no bloquean el avance)
export const CHORD_CHANGE_CHECKIN = {
  question: "¿Pudiste hacer el cambio al menos lento y sin detenerte demasiado?",
  options: [
    "Sí, puedo seguir",
    "Más o menos, quiero repetir",
    "Todavía no",
  ],
} as const;

export const LESSONS_WITH_CHORD_CHECKIN = new Set(["m3", "p3", "p6", "p7"]);

export function isChordCheckinLesson(lessonId: string): boolean {
  return LESSONS_WITH_CHORD_CHECKIN.has(lessonId);
}
