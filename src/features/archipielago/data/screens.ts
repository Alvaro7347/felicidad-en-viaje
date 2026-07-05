import type { Screen } from "../types";

export const ONBOARDING_SCREENS: Screen[] = ['welcome', 'onboarding', 'diagnosis', 'diagnosis-result'];

export type LessonGroup = 'first-melodies' | 'pulse' | 'rhythm';

export interface DevScreenEntry {
  label: string;
  screen: Screen;
  lessonId?: string;
  lessonGroup?: LessonGroup;
}

export const DEV_SCREENS: DevScreenEntry[] = [
  { label: '① Bienvenida',        screen: 'welcome' },
  { label: '② Onboarding',        screen: 'onboarding' },
  { label: '③ Diagnóstico',       screen: 'diagnosis' },
  { label: '④ Resultado',         screen: 'diagnosis-result' },
  { label: '⑤ Ruta Isla',         screen: 'route' },
  { label: 'N1 · Conoce guía',            screen: 'mission-guide' },
  { label: 'N2 · Cuéntanos',              screen: 'mission-two' },
  { label: 'N3 · Qué es el Archipiélago', screen: 'mission-three' },
  { label: 'N4 · Historia del Ukelele',   screen: 'mission-four' },
  { label: 'N5 · Partes del Ukelele',     screen: 'mission' },
  { label: 'N6 · Quiz Partes',            screen: 'mission-six' },
  { label: 'N7 · Toma ukelele',           screen: 'mission-seven' },
  { label: 'N8 · Afinación',              screen: 'mission-eight' },
  { label: 'N9 · Listo para zarpar',      screen: 'mission-nine' },
  { label: 'Isla · Primeras Melodías',    screen: 'first-melodies-island' },
  { label: 'M1 · Acorde DO',              screen: 'first-melodies-lesson', lessonId: 'm1', lessonGroup: 'first-melodies' },
  { label: 'M2 · Diagrama DO',            screen: 'first-melodies-lesson', lessonId: 'm2', lessonGroup: 'first-melodies' },
  { label: 'M3 · LAm y FA',               screen: 'first-melodies-lesson', lessonId: 'm3', lessonGroup: 'first-melodies' },
  { label: 'M4 · Diagrama LAm/FA',        screen: 'first-melodies-lesson', lessonId: 'm4', lessonGroup: 'first-melodies' },
  { label: 'M5 · Tren al Sur',            screen: 'first-melodies-lesson', lessonId: 'm5', lessonGroup: 'first-melodies' },
  { label: 'M6 · Stay With Me',           screen: 'first-melodies-lesson', lessonId: 'm6', lessonGroup: 'first-melodies' },
  { label: 'M7 · Karaoke Stay',           screen: 'first-melodies-lesson', lessonId: 'm7', lessonGroup: 'first-melodies' },
  { label: 'M8 · Comunidad',              screen: 'first-melodies-lesson', lessonId: 'm8', lessonGroup: 'first-melodies' },
  { label: 'M9 · Digitación',             screen: 'first-melodies-lesson', lessonId: 'm9', lessonGroup: 'first-melodies' },
  { label: 'M10 · Cierre Melodías',       screen: 'first-melodies-lesson', lessonId: 'm10', lessonGroup: 'first-melodies' },
  { label: 'Isla · Pulso',                screen: 'pulse-island' },
  { label: 'P1 · Acorde SOL',             screen: 'pulse-lesson', lessonId: 'p1', lessonGroup: 'pulse' },
  { label: 'P2 · Diagrama SOL',           screen: 'pulse-lesson', lessonId: 'p2', lessonGroup: 'pulse' },
  { label: 'P3 · Puente SOL-DO',          screen: 'pulse-lesson', lessonId: 'p3', lessonGroup: 'pulse' },
  { label: 'P4 · Leer acordes',           screen: 'pulse-lesson', lessonId: 'p4', lessonGroup: 'pulse' },
  { label: 'P5 · Vaca Lola',              screen: 'pulse-lesson', lessonId: 'p5', lessonGroup: 'pulse' },
  { label: 'P6 · Puente SOL-LAm',         screen: 'pulse-lesson', lessonId: 'p6', lessonGroup: 'pulse' },
  { label: 'P7 · Puente SOL-FA',          screen: 'pulse-lesson', lessonId: 'p7', lessonGroup: 'pulse' },
  { label: 'P8 · No se va',               screen: 'pulse-lesson', lessonId: 'p8', lessonGroup: 'pulse' },
  { label: 'P9 · Cifrado americano',      screen: 'pulse-lesson', lessonId: 'p9', lessonGroup: 'pulse' },
  { label: 'P10 · Despacito',             screen: 'pulse-lesson', lessonId: 'p10', lessonGroup: 'pulse' },
  { label: 'P11 · Calma (Cierre Pulso)',  screen: 'pulse-lesson', lessonId: 'p11', lessonGroup: 'pulse' },
  { label: 'Isla · Ritmo',                screen: 'rhythm-island' },
  { label: 'R1 · Primer rasgueo',         screen: 'rhythm-lesson', lessonId: 'r1', lessonGroup: 'rhythm' },
  { label: 'R2 · LAm y FA rasgueo',       screen: 'rhythm-lesson', lessonId: 'r2', lessonGroup: 'rhythm' },
  { label: 'R3 · LAm y DO rasgueo',       screen: 'rhythm-lesson', lessonId: 'r3', lessonGroup: 'rhythm' },
  { label: 'R4 · FA y DO rasgueo',        screen: 'rhythm-lesson', lessonId: 'r4', lessonGroup: 'rhythm' },
  { label: 'R5 · SOL y DO rasgueo',       screen: 'rhythm-lesson', lessonId: 'r5', lessonGroup: 'rhythm' },
  { label: 'R6 · Un elefante',            screen: 'rhythm-lesson', lessonId: 'r6', lessonGroup: 'rhythm' },
  { label: 'R7 · Aprende Calma',          screen: 'rhythm-lesson', lessonId: 'r7', lessonGroup: 'rhythm' },
  { label: 'R8 · Karaoke Calma',          screen: 'rhythm-lesson', lessonId: 'r8', lessonGroup: 'rhythm' },
  { label: 'R9 · Feedback canción',       screen: 'rhythm-lesson', lessonId: 'r9', lessonGroup: 'rhythm' },
  { label: 'R10 · Aprende I Lava You',    screen: 'rhythm-lesson', lessonId: 'r10', lessonGroup: 'rhythm' },
  { label: 'R11 · Karaoke I Lava You',    screen: 'rhythm-lesson', lessonId: 'r11', lessonGroup: 'rhythm' },
  { label: 'R12 · Aprende La Bamba',      screen: 'rhythm-lesson', lessonId: 'r12', lessonGroup: 'rhythm' },
  { label: 'R13 · Karaoke La Bamba',      screen: 'rhythm-lesson', lessonId: 'r13', lessonGroup: 'rhythm' },
  { label: 'R14 · Cierre Ritmo',          screen: 'rhythm-lesson', lessonId: 'r14', lessonGroup: 'rhythm' },
  { label: '⑦ Celebración',               screen: 'celebration' },
];
