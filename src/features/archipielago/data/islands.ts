import type { RouteNode } from "../types";

export const START_PORT_NODES: RouteNode[] = [
  { id: 'n1', title: 'Conoce a tu guía', subtitle: 'Una bienvenida de SoundKeleles', icon: '👋', status: 'done', type: 'Video', time: '2 min' },
  { id: 'n2', title: 'Cuéntanos de ti', subtitle: 'Tu motivo será el combustible de este viaje.', icon: '💗', status: 'done', type: 'Reflexión', time: '3 min' },
  { id: 'n3', title: 'Toma tu ukelele sin tensión', subtitle: 'Postura, agarre y respiración', icon: '🎸', status: 'done', type: 'Microclase', time: '4 min' },
  { id: 'n4', title: 'Afina tu primer sonido', subtitle: 'Aprende a usar el afinador', icon: '🎵', status: 'done', type: 'Práctica', time: '5 min' },
  { id: 'n5', title: 'Toca tu primer DO', subtitle: 'Hoy abrís tu primera puerta musical', icon: '🎶', status: 'current', type: 'Misión', time: '3 min' },
  { id: 'n6', title: 'Sube tu evidencia', subtitle: 'Un audio o video de tu acorde', icon: '📤', status: 'locked', type: 'Logro', time: '2 min' },
  { id: 'n7', title: '¿Cómo te sentiste?', subtitle: 'Registra tu emoción del día', icon: '💬', status: 'locked', type: 'Check-in', time: '1 min' },
  { id: 'n8', title: 'Sello desbloqueado', subtitle: 'Guardián del Silencio', icon: '🏅', status: 'achievement', time: '' },
];

export const ROUTE_STAGES = [
  { id: 'puerto-inicio', title: 'Puerto de Inicio', status: 'active' as const, progress: 50, completionText: 'completado' },
  { id: 'primeras-melodias', title: 'Isla de Primeras Melodías', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'pulso', title: 'Isla del Pulso', status: 'locked' as const, progress: 0, completionText: 'completada' },
  { id: 'ritmo', title: 'Isla del Ritmo', status: 'locked' as const, progress: 0, completionText: 'completada' },
];
