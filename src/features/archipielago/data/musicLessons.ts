// Data declarativa de las 13 lecciones de la Isla Musical.
// Se consume desde MusicLessonScreen (renderer genérico) y desde
// MusicIslandScreen. No hay progreso real todavía.

import chordMiMenor from '@/assets/chords/acorde-mi-menor.png';
import chordSi7 from '@/assets/chords/acorde-si7.png';
import chordRe from '@/assets/chords/acorde-re.png';

export type MusicLessonKind = 'video' | 'diagram' | 'multiVideo' | 'community' | 'closure';

export interface MusicVideo {
  label: string;
  title: string;
  videoUrl: string;
  videoId: string;
}

export interface MusicDiagramAsset {
  label: string;
  src?: string; // Si no está disponible, se muestra placeholder.
}

export interface MusicLesson {
  id: string;
  order: number;
  title: string;
  experientialTitle: string;
  subtitle: string;
  type: string;
  estimatedTime: string;
  kind: MusicLessonKind;
  description: string;
  objective: string;
  microVictory: string;
  antiFrustrationCopy: string;
  videoUrl?: string;
  videoId?: string;
  videos?: MusicVideo[];
  diagramAssets?: MusicDiagramAsset[];
  diagramPlaceholder?: string;
}

const V_URL = 'https://www.youtube.com/watch?v=VObhKZhwZwc';
const V_ID = 'VObhKZhwZwc';

export const MUSIC_LESSONS: MusicLesson[] = [
  {
    id: 'music1', order: 1,
    title: 'Acordes MI menor y SI7',
    experientialTitle: 'Dos nuevos colores: MI menor y SI7',
    subtitle: 'Descubre dos acordes nuevos para ampliar tu repertorio.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video enseñando los acordes MI menor y SI7.',
    objective: 'Aprender las posiciones básicas de MI menor y SI7 en el ukelele.',
    microVictory: 'Dos acordes nuevos desbloqueados.',
    antiFrustrationCopy: 'MI menor y SI7 pueden parecer distintos al principio, pero los aprenderás paso a paso.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'music2', order: 2,
    title: 'Diagrama de Acordes MI menor y SI7',
    experientialTitle: 'Mapa visual de MI menor y SI7',
    subtitle: 'Refuerza visualmente las posiciones de tus nuevos acordes.',
    type: 'Diagrama', estimatedTime: '3 min', kind: 'diagram',
    description: 'Aquí irán las imágenes con los acordes MI menor y SI7.',
    objective: 'Memorizar visualmente la posición de MI menor y SI7.',
    microVictory: 'Ya tienes tu mapa visual de MI menor y SI7.',
    antiFrustrationCopy: 'Vuelve al diagrama cada vez que tus dedos necesiten orientarse.',
    diagramAssets: [
      { label: 'MI menor', src: chordMiMenor },
      { label: 'SI7', src: chordSi7 },
    ],
    diagramPlaceholder: 'Imagen de acordes pendiente de adjuntar',
  },
  {
    id: 'music3', order: 3,
    title: 'Cambios de MI menor con otros acordes',
    experientialTitle: 'MI menor en movimiento',
    subtitle: 'Practica cómo conectar MI menor con acordes que ya conoces.',
    type: 'Práctica guiada', estimatedTime: '8 min', kind: 'multiVideo',
    description: 'Aquí irán 5 videos que el usuario debe ver y practicar todos. Los videos deben estar ordenados verticalmente.',
    objective: 'Practicar cambios de MI menor hacia acordes ya conocidos.',
    microVictory: 'MI menor ya puede conectarse con tu repertorio.',
    antiFrustrationCopy: 'No necesitas dominar todos los cambios en una vuelta. Practica uno a la vez.',
    videos: [
      { label: 'Cambio 1', title: 'Cambio de acorde entre MI menor y LA menor', videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 2', title: 'Cambio de acorde entre MI menor y DO',       videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 3', title: 'Cambio de acorde entre MI menor y FA',       videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 4', title: 'Cambio de acorde entre MI menor y SI7',      videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 5', title: 'Cambio de acorde entre MI menor y SOL',      videoUrl: V_URL, videoId: V_ID },
    ],
  },
  {
    id: 'music4', order: 4,
    title: 'Cambios de SI7 con otros acordes',
    experientialTitle: 'SI7 en movimiento',
    subtitle: 'Entrena el SI7 en combinaciones musicales reales.',
    type: 'Práctica guiada', estimatedTime: '7 min', kind: 'multiVideo',
    description: 'Aquí irán 4 videos que el usuario debe ver y practicar todos. Los videos deben estar ordenados verticalmente.',
    objective: 'Practicar cambios de SI7 hacia acordes ya conocidos.',
    microVictory: 'SI7 empieza a entrar en tus canciones.',
    antiFrustrationCopy: 'El SI7 puede sentirse exigente. Avanza lento y celebra cada cambio limpio.',
    videos: [
      { label: 'Cambio 1', title: 'Cambio de acorde entre SI7 y LA menor', videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 2', title: 'Cambio de acorde entre SI7 y DO',       videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 3', title: 'Cambio de acorde entre SI7 y FA',       videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 4', title: 'Cambio de acorde entre SI7 y SOL',      videoUrl: V_URL, videoId: V_ID },
    ],
  },
  {
    id: 'music5', order: 5,
    title: 'Acorde RE',
    experientialTitle: 'El acorde RE entra al viaje',
    subtitle: 'Agrega un acorde clave para tocar más canciones.',
    type: 'Video práctica', estimatedTime: '4 min', kind: 'video',
    description: 'Aquí irá un video enseñando el acorde RE.',
    objective: 'Aprender la posición básica del acorde RE.',
    microVictory: 'Acorde RE desbloqueado.',
    antiFrustrationCopy: 'El RE puede sentirse apretado al principio; dale tiempo a tu mano para acomodarse.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'music6', order: 6,
    title: 'Diagrama de Acorde RE',
    experientialTitle: 'Mapa visual del RE',
    subtitle: 'Usa el mapa visual para memorizar la forma del RE.',
    type: 'Diagrama', estimatedTime: '2 min', kind: 'diagram',
    description: 'Aquí irá la imagen del acorde RE.',
    objective: 'Reforzar visualmente la posición del acorde RE.',
    microVictory: 'Ya tienes tu mapa visual del RE.',
    antiFrustrationCopy: 'Cuando la mano se confunda, vuelve al mapa y respira.',
    diagramAssets: [
      { label: 'RE' },
    ],
    diagramPlaceholder: 'Imagen del acorde RE pendiente de adjuntar',
  },
  {
    id: 'music7', order: 7,
    title: 'Cambios de RE con otros acordes',
    experientialTitle: 'RE en movimiento',
    subtitle: 'Conecta RE con tus acordes anteriores paso a paso.',
    type: 'Práctica guiada', estimatedTime: '9 min', kind: 'multiVideo',
    description: 'Aquí irán 6 videos que el usuario debe ver y practicar todos. Los videos deben estar ordenados verticalmente.',
    objective: 'Practicar cambios de RE hacia acordes ya aprendidos.',
    microVictory: 'RE ya puede moverse dentro de tu repertorio.',
    antiFrustrationCopy: 'Mientras más acordes conoces, más rutas aparecen. No tienes que recorrerlas todas perfecto hoy.',
    videos: [
      { label: 'Cambio 1', title: 'Cambio de acorde entre RE y LA menor', videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 2', title: 'Cambio de acorde entre RE y FA',       videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 3', title: 'Cambio de acorde entre RE y DO',       videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 4', title: 'Cambio de acorde entre RE y SOL',      videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 5', title: 'Cambio de acorde entre RE y MI menor', videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 6', title: 'Cambio de acorde entre RE y SI7',      videoUrl: V_URL, videoId: V_ID },
    ],
  },
  {
    id: 'music8', order: 8,
    title: 'Toca la canción Flaca de Andrés Calamaro',
    experientialTitle: 'Toca Flaca',
    subtitle: 'Aplica tus nuevos acordes en una canción reconocible.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video con la canción Flaca de Andrés Calamaro.',
    objective: 'Aplicar los acordes nuevos en una canción popular.',
    microVictory: 'Flaca entra a tu repertorio.',
    antiFrustrationCopy: 'Una canción no se conquista de una vez; se recorre por partes.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'music9', order: 9,
    title: 'Toca la canción Stay With Me',
    experientialTitle: 'Stay With Me con más recursos',
    subtitle: 'Vuelve a una canción conocida con más recursos musicales.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video con la canción Stay With Me.',
    objective: 'Reforzar una canción conocida usando mayor seguridad musical.',
    microVictory: 'Stay With Me vuelve a sonar con más confianza.',
    antiFrustrationCopy: 'Volver a una canción conocida también es avanzar: ahora la escuchas y la tocas distinto.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'music10', order: 10,
    title: 'Sube tus canciones a la comunidad y recibe feedback',
    experientialTitle: 'Comparte tus canciones',
    subtitle: 'Comparte tus avances de forma opcional con la comunidad.',
    type: 'Comunidad', estimatedTime: '5 min', kind: 'community',
    description: 'Aquí los alumnos podrán subir sus canciones y recibir feedback de la comunidad.',
    objective: 'Convertir la práctica individual en una experiencia acompañada.',
    microVictory: 'Tu música puede ser compartida.',
    antiFrustrationCopy: 'No necesitas mostrar una versión perfecta. Compartir también es parte del aprendizaje.',
  },
  {
    id: 'music11', order: 11,
    title: 'Aprende Tren al Sur de Los Prisioneros completa',
    experientialTitle: 'Aprende Tren al Sur completa',
    subtitle: 'Construye una canción chilena completa paso a paso.',
    type: 'Video práctica', estimatedTime: '7 min', kind: 'video',
    description: 'Aquí irá un video enseñando la canción Tren al Sur de Los Prisioneros.',
    objective: 'Aprender una canción completa integrando acordes, ritmo y cambios.',
    microVictory: 'Tren al Sur completa empieza a tomar forma.',
    antiFrustrationCopy: 'Una canción completa se aprende por estaciones: intro, partes, cambios y repetición.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'music12', order: 12,
    title: 'Toca Hakuna Matata',
    experientialTitle: 'Toca Hakuna Matata',
    subtitle: 'Disfruta una canción alegre usando lo aprendido.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video con la canción Hakuna Matata.',
    objective: 'Practicar una canción alegre con mayor soltura.',
    microVictory: 'Hakuna Matata desbloqueada.',
    antiFrustrationCopy: 'La alegría también se practica: toca simple, toca tranquilo y disfruta.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'music13', order: 13,
    title: 'Cierre de la Isla Musical',
    experientialTitle: 'Tu repertorio musical creció',
    subtitle: 'Revisa tus avances y celebra tu repertorio musical.',
    type: 'Cierre de isla', estimatedTime: '4 min', kind: 'closure',
    description: 'Aquí irá una encuesta del cierre de la Isla Musical.',
    objective: 'Hacer visible el avance logrado con nuevos acordes, cambios y canciones.',
    microVictory: 'Cierre consciente de tu repertorio musical.',
    antiFrustrationCopy: 'No llegaste aquí sabiendo todo: llegaste practicando paso a paso.',
    videoUrl: V_URL, videoId: V_ID,
  },
];

export const MUSIC_SUMMARY_CHIPS = [
  'MI menor',
  'SI7',
  'RE',
  'Cambios entre acordes',
  'Flaca',
  'Stay With Me',
  'Tren al Sur completa',
  'Hakuna Matata',
  'Comunidad y feedback',
];

export const MUSIC_CLOSURE_QUESTIONS = {
  feeling: {
    question: '¿Cómo te sientes al cerrar esta isla?',
    options: ['Feliz', 'Orgulloso', 'Con dudas', 'Motivado', 'Cansado'],
  },
  hardest: {
    question: '¿Qué fue lo que más te costó?',
    options: [
      'MI menor',
      'SI7',
      'RE',
      'Cambios entre acordes',
      'Tocar canciones completas',
      'Compartir mi avance',
      'Nada por ahora',
    ],
  },
  readiness: {
    question: '¿Qué tan listo te sientes para seguir avanzando?',
    labels: ['Aún no', 'Con dudas', 'Más o menos', 'Bastante listo', 'Muy listo'],
  },
};

export function findMusicLesson(id: string): MusicLesson | undefined {
  return MUSIC_LESSONS.find(l => l.id === id);
}
