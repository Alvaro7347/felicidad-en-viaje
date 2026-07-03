import type { Screen } from "../types";

export const ONBOARDING_SCREENS: Screen[] = ['welcome', 'onboarding', 'diagnosis', 'diagnosis-result', 'entry-moment'];

export const DEV_SCREENS: { label: string; screen: Screen }[] = [
  { label: '① Bienvenida',    screen: 'welcome' },
  { label: '② Onboarding',    screen: 'onboarding' },
  { label: '③ Diagnóstico',   screen: 'diagnosis' },
  { label: '④ Resultado',     screen: 'diagnosis-result' },
  { label: '⑤ Entrada',       screen: 'entry-moment' },
  { label: '⑥ Ruta Isla',     screen: 'route' },
  { label: '⑦ Misión DO',     screen: 'mission' },
  { label: '⑧ Celebración',   screen: 'celebration' },
];
