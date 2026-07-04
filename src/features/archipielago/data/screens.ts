import type { Screen } from "../types";

export const ONBOARDING_SCREENS: Screen[] = ['welcome', 'onboarding', 'diagnosis', 'diagnosis-result'];

export const DEV_SCREENS: { label: string; screen: Screen }[] = [
  { label: '① Bienvenida',    screen: 'welcome' },
  { label: '② Onboarding',    screen: 'onboarding' },
  { label: '③ Diagnóstico',   screen: 'diagnosis' },
  { label: '④ Resultado',     screen: 'diagnosis-result' },
  { label: '⑤ Ruta Isla',     screen: 'route' },
  { label: '⑥ Misión DO',     screen: 'mission' },
  { label: '⑦ Celebración',   screen: 'celebration' },
];
