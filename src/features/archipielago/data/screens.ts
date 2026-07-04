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
  { label: 'N4 · Afinación',              screen: 'mission-four' },
  { label: 'N5 · Misión DO',              screen: 'mission' },
  { label: 'N7 · Toma ukelele',           screen: 'mission-seven' },
  { label: '⑦ Celebración',               screen: 'celebration' },
];
