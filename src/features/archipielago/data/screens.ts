import type { Screen } from "../types";

export const ONBOARDING_SCREENS: Screen[] = ['welcome', 'onboarding', 'diagnosis', 'diagnosis-result'];

export const DEV_SCREENS: { label: string; screen: Screen }[] = [
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
  { label: 'Isla · Lección Primeras Melodías', screen: 'first-melodies-lesson' },
  { label: '⑦ Celebración',               screen: 'celebration' },
];
