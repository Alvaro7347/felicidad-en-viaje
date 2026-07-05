// Data declarativa de las 12 lecciones de la Isla de la Alegría.
// Se consume desde JoyLessonScreen (renderer genérico) y desde
// JoyIslandScreen. No hay progreso real todavía.

import chordLa from '@/assets/chords-joy/acorde-la.png';
import chordReMenor from '@/assets/chords-joy/acorde-re-menor.png';
import chordFaSostenidoMenor from '@/assets/chords-joy/acorde-fa-sostenido-menor.png';
import chordSiMenor from '@/assets/chords-joy/acorde-si-menor.png';

export type JoyLessonKind = 'video' | 'diagram' | 'multiVideo' | 'tablature' | 'closure';

export interface JoyVideo {
  label: string;
  title: string;
  videoUrl: string;
  videoId: string;
}

export interface JoyImageAsset {
  label: string;
  src?: string;
}

export interface JoyLesson {
  id: string;
  order: number;
  title: string;
  experientialTitle: string;
  subtitle: string;
  type: string;
  estimatedTime: string;
  kind: JoyLessonKind;
  description: string;
  objective: string;
  microVictory: string;
  antiFrustrationCopy: string;
  videoUrl?: string;
  videoId?: string;
  videos?: JoyVideo[];
  diagramAssets?: JoyImageAsset[];
  diagramPlaceholder?: string;
  tablatureAssets?: JoyImageAsset[];
  tablaturePlaceholder?: string;
}

const V_URL = 'https://www.youtube.com/watch?v=VObhKZhwZwc';
const V_ID = 'VObhKZhwZwc';

export const JOY_LESSONS: JoyLesson[] = [
  {
    id: 'joy1', order: 1,
    title: 'Segundo Rasgueo',
    experientialTitle: 'Tu segundo rasgueo',
    subtitle: 'Descubre un nuevo movimiento para darle más alegría a tus canciones.',
    type: 'Video práctica', estimatedTime: '4 min', kind: 'video',
    description: 'Aquí irá un video enseñando un segundo rasgueo.',
    objective: 'Aprender un segundo patrón de rasgueo para enriquecer el acompañamiento.',
    microVictory: 'Segundo rasgueo desbloqueado.',
    antiFrustrationCopy: 'Un nuevo rasgueo se siente extraño al inicio; la mano necesita repetirlo con calma.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'joy2', order: 2,
    title: 'Cambios de acordes con segundo rasgueo',
    experientialTitle: 'Cambios con segundo rasgueo',
    subtitle: 'Practica tus cambios de acordes usando el nuevo rasgueo.',
    type: 'Práctica guiada', estimatedTime: '8 min', kind: 'multiVideo',
    description: 'Aquí irán 4 videos que el usuario debe ver y practicar todos. Los videos deben estar ordenados verticalmente.',
    objective: 'Coordinar cambios de acordes conocidos con el segundo rasgueo.',
    microVictory: 'Tus cambios ya empiezan a sonar con más movimiento.',
    antiFrustrationCopy: 'Primero sostén el rasgueo, después busca precisión. No intentes dominar todo al mismo tiempo.',
    videos: [
      { label: 'Cambio 1', title: 'Cambio de acorde entre LA menor y FA', videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 2', title: 'Cambio de acorde entre LA menor y DO', videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 3', title: 'Cambio de acorde entre SOL y FA',      videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 4', title: 'Cambio de acorde entre MI menor y SOL', videoUrl: V_URL, videoId: V_ID },
    ],
  },
  {
    id: 'joy3', order: 3,
    title: 'Acordes LA, RE menor, FA# menor y SI menor',
    experientialTitle: 'Nuevos acordes para nuevas canciones',
    subtitle: 'Agrega nuevos acordes para ampliar tu sonido musical.',
    type: 'Video práctica', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando los acordes LA, RE menor, FA# menor y SI menor.',
    objective: 'Aprender las posiciones básicas de LA, RE menor, FA# menor y SI menor.',
    microVictory: 'Cuatro nuevos acordes desbloqueados.',
    antiFrustrationCopy: 'No necesitas memorizar todos de inmediato. Elige uno, entiéndelo y luego avanza al siguiente.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'joy4', order: 4,
    title: 'Diagramas acordes LA, RE menor, FA# menor y SI menor',
    experientialTitle: 'Mapa visual de tus nuevos acordes',
    subtitle: 'Usa mapas visuales para memorizar tus nuevos acordes.',
    type: 'Diagrama', estimatedTime: '4 min', kind: 'diagram',
    description: 'Aquí irán las imágenes con los acordes LA, RE menor, FA# menor y SI menor.',
    objective: 'Reforzar visualmente las posiciones de LA, RE menor, FA# menor y SI menor.',
    microVictory: 'Ya tienes tu mapa visual para navegar estos nuevos acordes.',
    antiFrustrationCopy: 'Cuando tus dedos se pierdan, vuelve al mapa. Mirar el diagrama también es practicar.',
    diagramAssets: [
      { label: 'LA', src: chordLa },
      { label: 'RE menor', src: chordReMenor },
      { label: 'FA# menor', src: chordFaSostenidoMenor },
      { label: 'SI menor', src: chordSiMenor },
    ],
    diagramPlaceholder: 'Imágenes de acordes pendientes de adjuntar',
  },
  {
    id: 'joy5', order: 5,
    title: 'Toca Estrellitas y Duendes de Juan Luis Guerra',
    experientialTitle: 'Estrellitas y Duendes',
    subtitle: 'Aplica tus nuevos recursos en una canción de Juan Luis Guerra.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video con la canción Estrellitas y Duendes de Juan Luis Guerra.',
    objective: 'Aplicar nuevos acordes y rasgueo en una canción cálida y reconocible.',
    microVictory: 'Estrellitas y Duendes entra a tu repertorio.',
    antiFrustrationCopy: 'Las canciones con más acordes se aprenden por partes. No necesitas tocarla completa en el primer intento.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'joy6', order: 6,
    title: 'Cambio de acorde con segundo rasgueo nivel dos',
    experientialTitle: 'Segundo rasgueo nivel dos',
    subtitle: 'Profundiza tus cambios con una práctica más desafiante.',
    type: 'Práctica guiada', estimatedTime: '8 min', kind: 'multiVideo',
    description: 'Aquí irán 4 videos que el usuario debe ver y practicar todos. Los videos deben estar ordenados verticalmente.',
    objective: 'Practicar cambios más desafiantes usando el segundo rasgueo.',
    microVictory: 'Tu segundo rasgueo ya puede sostener cambios más exigentes.',
    antiFrustrationCopy: 'Si SI menor cuesta, no significa que vas mal. Los acordes más exigentes necesitan más repeticiones.',
    videos: [
      { label: 'Cambio 1', title: 'Cambio de acorde entre SI menor y LA menor', videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 2', title: 'Cambio de acorde entre SI menor y DO',       videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 3', title: 'Cambio de acorde entre SI menor y FA',       videoUrl: V_URL, videoId: V_ID },
      { label: 'Cambio 4', title: 'Cambio de acorde entre SI menor y SOL',      videoUrl: V_URL, videoId: V_ID },
    ],
  },
  {
    id: 'joy7', order: 7,
    title: 'Toca Loco tu forma de ser de Los Auténticos Decadentes',
    experientialTitle: 'Loco tu forma de ser',
    subtitle: 'Lleva tu ritmo a una canción alegre y reconocible.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video con la canción Loco tu forma de ser.',
    objective: 'Practicar una canción alegre usando rasgueo y cambios de acordes.',
    microVictory: 'Una canción alegre más entra a tu repertorio.',
    antiFrustrationCopy: 'El objetivo no es tocar perfecto; es sostener la energía y volver al ritmo cuando te pierdas.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'joy8', order: 8,
    title: 'Toca Lamento boliviano',
    experientialTitle: 'Lamento boliviano',
    subtitle: 'Practica una canción popular sosteniendo tus cambios y rasgueo.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video con la canción Lamento boliviano.',
    objective: 'Aplicar rasgueo, acordes y cambios en una canción popular latinoamericana.',
    microVictory: 'Lamento boliviano desbloqueada.',
    antiFrustrationCopy: 'Si una canción parece avanzar rápido, sigue escuchando el pulso. Siempre puedes volver en el siguiente cambio.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'joy9', order: 9,
    title: 'Toca Bachata Rosa de Juan Luis Guerra',
    experientialTitle: 'Bachata Rosa',
    subtitle: 'Explora una canción cálida de Juan Luis Guerra en ukelele.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video con la canción Bachata Rosa de Juan Luis Guerra.',
    objective: 'Practicar una canción melódica y alegre usando los recursos aprendidos.',
    microVictory: 'Bachata Rosa entra a tu repertorio.',
    antiFrustrationCopy: 'La musicalidad aparece cuando respiras y tocas con intención, no cuando corres.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'joy10', order: 10,
    title: 'Aprende a leer Tablaturas',
    experientialTitle: 'Aprende a leer tablaturas',
    subtitle: 'Descubre una nueva forma de leer melodías en el ukelele.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video donde aprenderás a leer tablaturas.',
    objective: 'Entender cómo leer una tablatura básica para tocar melodías simples.',
    microVictory: 'Ya puedes empezar a leer música en formato tablatura.',
    antiFrustrationCopy: 'La tablatura no es teoría pesada: es un mapa simple que te dice dónde tocar.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'joy11', order: 11,
    title: 'Toca canciones con Tablatura',
    experientialTitle: 'Tus primeras melodías con tablatura',
    subtitle: 'Usa la tablatura para tocar pequeñas melodías guiadas.',
    type: 'Tablatura', estimatedTime: '6 min', kind: 'tablature',
    description: 'Aquí irán imágenes con canciones que se pueden tocar con tablatura.',
    objective: 'Aplicar la lectura de tablaturas en canciones o melodías simples.',
    microVictory: 'Primera canción con tablatura desbloqueada.',
    antiFrustrationCopy: 'Lee lento. Una tablatura se toca paso a paso, número por número.',
    tablatureAssets: [],
    tablaturePlaceholder: 'Imágenes de tablatura pendientes de adjuntar',
  },
  {
    id: 'joy12', order: 12,
    title: 'Cierre de la Isla de la Alegría',
    experientialTitle: 'Tu alegría ya suena',
    subtitle: 'Revisa tu avance y celebra el sonido alegre que construiste.',
    type: 'Cierre de isla', estimatedTime: '4 min', kind: 'closure',
    description: 'Aquí irá un resumen con lo aprendido en la Isla de la Alegría.',
    objective: 'Hacer visible el avance logrado con segundo rasgueo, nuevos acordes, canciones y tablaturas.',
    microVictory: 'Cierre consciente de una isla llena de música y alegría.',
    antiFrustrationCopy: 'No llegaste aquí por tocar perfecto; llegaste porque seguiste tocando.',
    videoUrl: V_URL, videoId: V_ID,
  },
];

export const JOY_SUMMARY_CHIPS = [
  'Segundo rasgueo',
  'Cambios con segundo rasgueo',
  'LA',
  'RE menor',
  'FA# menor',
  'SI menor',
  'Estrellitas y Duendes',
  'Loco tu forma de ser',
  'Lamento boliviano',
  'Bachata Rosa',
  'Tablaturas',
];

export const JOY_CLOSURE_QUESTIONS = {
  feeling: {
    question: '¿Cómo te sientes al cerrar esta isla?',
    options: ['Feliz', 'Orgulloso', 'Con dudas', 'Motivado', 'Cansado'],
  },
  hardest: {
    question: '¿Qué fue lo que más te costó?',
    options: [
      'Segundo rasgueo',
      'Cambios de acordes',
      'Acordes nuevos',
      'SI menor',
      'Leer tablaturas',
      'Tocar canciones completas',
      'Nada por ahora',
    ],
  },
  readiness: {
    question: '¿Qué tan listo te sientes para seguir avanzando?',
    labels: ['Aún no', 'Con dudas', 'Más o menos', 'Bastante listo', 'Muy listo'],
  },
};

export function findJoyLesson(id: string): JoyLesson | undefined {
  return JOY_LESSONS.find(l => l.id === id);
}
