import type { RouteNode } from "../types";

export const START_PORT_NODES: RouteNode[] = [
  { id: 'n1', title: 'Conoce a tu guía', subtitle: 'Una bienvenida de SoundKeleles', icon: '👋', status: 'done', type: 'Video', time: '2 min' },
  { id: 'n2', title: 'Cuéntanos de ti', subtitle: 'Tu motivo será el combustible de este viaje.', icon: '💗', status: 'done', type: 'Reflexión', time: '3 min' },
  { id: 'n3', title: 'Qué es el Archipiélago', subtitle: 'Aprende cómo navegar tu viaje musical.', icon: '🗺️', status: 'done', type: 'Orientación', time: '3 min' },
  { id: 'n4', title: 'Historia del Ukelele', subtitle: 'Conoce el viaje de este pequeño instrumento.', icon: '🌺', status: 'done', type: 'Video', time: '3 min' },
  { id: 'n5', title: 'Partes del Ukelele', subtitle: 'Conoce las partes de tu compañero musical.', icon: '🎸', status: 'current', type: 'Video', time: '3 min' },
  { id: 'n6', title: 'Quiz Partes del Ukelele', subtitle: 'Reconoce las partes principales de tu instrumento.', icon: '🧩', status: 'locked', type: 'Quiz', time: '3 min' },
  { id: 'n7', title: 'Toma tu ukelele sin tensión', subtitle: 'Postura, agarre y respiración', icon: '🎸', status: 'locked', type: 'Microclase', time: '4 min' },
  // Nota: "Sello desbloqueado / Guardián del Silencio" queda pendiente de reubicación futura.
  { id: 'n8', title: 'Afina tu primer sonido', subtitle: 'Aprende a usar el afinador', icon: '🎵', status: 'locked', type: 'Práctica', time: '5 min' },
  { id: 'n9', title: 'Listo para zarpar', subtitle: 'Cierra el Puerto de Inicio y recibe tu insignia.', icon: '⛵', status: 'locked', type: 'Cierre', time: '3 min' },
];

export const ROUTE_STAGES = [
  { id: 'puerto-inicio', title: 'Puerto de Inicio', status: 'active' as const, progress: 50, completionText: 'completado' },
  { id: 'primeras-melodias', title: 'Isla de Primeras Melodías', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'pulso', title: 'Isla del Pulso', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'ritmo', title: 'Isla del Ritmo', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'musical', title: 'Isla Musical', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'alegria', title: 'Isla de la Alegría', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'acordes', title: 'Isla de los Acordes', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'rasgueo', title: 'Isla del Rasgueo', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'canciones', title: 'Isla de las Canciones', status: 'locked' as const, progress: 0, completionText: 'completada' },
];
