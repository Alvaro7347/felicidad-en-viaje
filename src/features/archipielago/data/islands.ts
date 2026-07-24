import type { RouteNode } from "../types";

// Nota: `status` aquí es sólo un valor por defecto para tipado.
// El estado real (done / current / locked) se calcula dinámicamente en RouteScreen
// a partir del progreso guardado en Supabase (useMvp1Progress).
export const START_PORT_NODES: RouteNode[] = [
  { id: 'n1', title: 'Conoce a tu guía', subtitle: 'Una bienvenida de SoundKeleles', icon: '👋', status: 'locked', type: 'Video', time: '2 min' },
  { id: 'n2', title: 'Cuéntanos de ti', subtitle: 'Tu motivo será el combustible de este viaje.', icon: '💗', status: 'locked', type: 'Reflexión', time: '3 min' },
  { id: 'n3', title: 'Qué es el Archipiélago', subtitle: 'Aprende cómo navegar tu viaje musical.', icon: '🗺️', status: 'locked', type: 'Orientación', time: '3 min' },
  { id: 'n4', title: 'Historia y Partes del Ukelele', subtitle: 'Conoce el viaje y las partes de tu compañero musical.', icon: '🌺', status: 'locked', type: 'Video', time: '5 min' },
  { id: 'n6', title: 'Quiz Partes del Ukelele', subtitle: 'Reconoce las partes principales de tu instrumento.', icon: '🧩', status: 'locked', type: 'Quiz', time: '3 min' },
  { id: 'n7', title: 'Toma tu ukelele sin tensión', subtitle: 'Postura, agarre y respiración', icon: '🎸', status: 'locked', type: 'Microclase', time: '4 min' },
  { id: 'n8', title: 'Afina tu primer sonido', subtitle: 'Aprende a usar el afinador', icon: '🎵', status: 'locked', type: 'Práctica', time: '5 min' },
  { id: 'n9', title: 'Listo para zarpar', subtitle: 'Cierra el Puerto de Inicio y recibe tu insignia.', icon: '⛵', status: 'locked', type: 'Cierre', time: '3 min' },
];

// Mapeo estable stage id (visual) → islandId (progreso MVP1).
export const STAGE_TO_ISLAND: Record<string, string> = {
  'puerto-inicio': 'start-port',
  'primeras-melodias': 'first-melodies',
  'pulso': 'pulse',
  'ritmo': 'rhythm',
  'musical': 'music',
  'alegria': 'joy',
  'acordes': 'chords',
  'rasgueo': 'strumming',
  'canciones': 'songs',
};

// Estos son metadatos visuales. El status/progress reales se calculan en RouteScreen.
export const ROUTE_STAGES = [
  { id: 'puerto-inicio', title: 'Puerto de Inicio', status: 'active' as const, progress: 0, completionText: 'completado' },
  { id: 'primeras-melodias', title: 'Isla de Primeras Melodías', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'pulso', title: 'Isla del Pulso', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'ritmo', title: 'Isla del Ritmo', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'musical', title: 'Isla Musical', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'alegria', title: 'Isla de la Alegría', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'acordes', title: 'Isla de los Acordes', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'rasgueo', title: 'Isla del Rasgueo', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'canciones', title: 'Isla de las Canciones', status: 'locked' as const, progress: 0, completionText: 'completada' },
];
