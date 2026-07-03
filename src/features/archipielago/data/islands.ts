import type { RouteNode } from "../types";

export const SILENCE_NODES: RouteNode[] = [
  { id: 'n1', title: 'Conoce a tu guía', subtitle: 'Una bienvenida de SoundKeleles', icon: '👋', status: 'done', type: 'Video', time: '2 min' },
  { id: 'n2', title: 'Conoce el Archipiélago', subtitle: 'Descubre cómo funciona este viaje musical.', icon: '📝', status: 'done', type: 'Historia interactiva', time: '3 min' },
  { id: 'n3', title: 'Toma tu ukelele sin tensión', subtitle: 'Postura, agarre y respiración', icon: '🎸', status: 'done', type: 'Microclase', time: '4 min' },
  { id: 'n4', title: 'Afina tu primer sonido', subtitle: 'Aprende a usar el afinador', icon: '🎵', status: 'done', type: 'Práctica', time: '5 min' },
  { id: 'n5', title: 'Toca tu primer DO', subtitle: 'Hoy abrís tu primera puerta musical', icon: '🎶', status: 'current', type: 'Misión', time: '3 min' },
  { id: 'n6', title: 'Sube tu evidencia', subtitle: 'Un audio o video de tu acorde', icon: '📤', status: 'locked', type: 'Logro', time: '2 min' },
  { id: 'n7', title: '¿Cómo te sentiste?', subtitle: 'Registra tu emoción del día', icon: '💬', status: 'locked', type: 'Check-in', time: '1 min' },
  { id: 'n8', title: 'Sello desbloqueado', subtitle: 'Guardián del Silencio', icon: '🏅', status: 'achievement', time: '' },
];

export const ISLANDS = [
  {
    id: 'silencio',
    title: 'Isla del Silencio',
    subtitle: 'Tu punto de partida',
    status: 'active' as const,
    progress: 50,
    photo: PHOTOS.class,
    nextVictory: 'Toca tu primer DO',
    emotion: '🔥 Motivado/a',
    skill: 'Prepararte, conocer tu ukelele y tocar tu primer acorde.',
  },
  {
    id: 'pulso',
    title: 'Isla del Pulso',
    subtitle: 'Acordes en movimiento',
    status: 'locked' as const,
    progress: 0,
    photo: PHOTOS.workshop,
    nextVictory: '',
    emotion: '',
    skill: 'Cambiar acordes y mantener un pulso simple.',
  },
  {
    id: 'ritmo',
    title: 'Isla del Ritmo',
    subtitle: 'Coordinación y rasgueo',
    status: 'locked' as const,
    progress: 0,
    photo: PHOTOS.family,
    nextVictory: '',
    emotion: '',
    skill: 'Coordinar ambas manos y tocar tu primer rasgueo.',
  },
];
