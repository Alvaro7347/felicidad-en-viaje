// Data declarativa de las 12 lecciones de la Isla de los Acordes.
// Se consume desde ChordsLessonScreen y ChordsIslandScreen.
// No hay progreso real.

export type ChordsLessonKind = 'video' | 'diagram' | 'closure';

export interface ChordsImageAsset {
  label: string;
  src?: string;
}

export interface ChordsLesson {
  id: string;
  order: number;
  title: string;
  experientialTitle: string;
  subtitle: string;
  type: string;
  estimatedTime: string;
  kind: ChordsLessonKind;
  description: string;
  objective: string;
  microVictory: string;
  antiFrustrationCopy: string;
  videoUrl?: string;
  videoId?: string;
  diagramAssets?: ChordsImageAsset[];
  diagramPlaceholder?: string;
}

const V_URL = 'https://www.youtube.com/watch?v=VObhKZhwZwc';
const V_ID = 'VObhKZhwZwc';

export const CHORDS_LESSONS: ChordsLesson[] = [
  {
    id: 'chords1', order: 1,
    title: 'Qué es un acorde',
    experientialTitle: 'Entiende qué es un acorde',
    subtitle: 'Comprende cómo se forma un acorde y por qué suena como suena.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video explicando qué es un acorde, cómo se forma y qué tipos de acordes existen.',
    objective: 'Entender qué es un acorde y por qué varios sonidos pueden formar una unidad musical.',
    microVictory: 'Ya sabes qué estás tocando cuando haces un acorde.',
    antiFrustrationCopy: 'No necesitas entender toda la teoría de golpe. Hoy solo necesitas abrir la puerta.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'chords2', order: 2,
    title: 'Acordes Mayores',
    experientialTitle: 'El sonido de los acordes mayores',
    subtitle: 'Descubre la base alegre y estable de muchos acordes.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video explicando los acordes mayores.',
    objective: 'Reconocer qué caracteriza a los acordes mayores.',
    microVictory: 'Acordes mayores comprendidos.',
    antiFrustrationCopy: 'Los acordes mayores son una familia. No necesitas memorizarlos todos hoy.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'chords3', order: 3,
    title: 'Diagramas acordes Mayores',
    experientialTitle: 'Mapa visual de acordes mayores',
    subtitle: 'Revisa visualmente las formas de los acordes mayores.',
    type: 'Diagrama', estimatedTime: '5 min', kind: 'diagram',
    description: 'Aquí irán las imágenes con los acordes mayores.',
    objective: 'Estudiar visualmente las posiciones de los acordes mayores.',
    microVictory: 'Ya tienes un mapa para practicar acordes mayores.',
    antiFrustrationCopy: 'Mirar el diagrama no es hacer trampa; es aprender con apoyo visual.',
    diagramAssets: [],
    diagramPlaceholder: 'Imágenes de acordes mayores pendientes de adjuntar',
  },
  {
    id: 'chords4', order: 4,
    title: 'Cómo entrenar acordes con cejillo',
    experientialTitle: 'Primer acercamiento al cejillo',
    subtitle: 'Aprende cómo preparar tu mano para acordes con cejillo.',
    type: 'Video práctica', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video explicando cómo trabajar los acordes con cejillo.',
    objective: 'Comprender cómo entrenar la mano para acordes con cejillo sin tensión innecesaria.',
    microVictory: 'Ya sabes cómo empezar a practicar cejillo.',
    antiFrustrationCopy: 'El cejillo no se conquista con fuerza bruta; se construye con técnica y paciencia.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'chords5', order: 5,
    title: 'Acordes Sostenidos Mayores',
    experientialTitle: 'Nuevos colores sostenidos',
    subtitle: 'Suma nuevos colores usando acordes sostenidos mayores.',
    type: 'Video práctica', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video explicando los acordes sostenidos mayores.',
    objective: 'Comprender qué son los acordes sostenidos mayores y cómo se usan.',
    microVictory: 'Acordes sostenidos mayores desbloqueados.',
    antiFrustrationCopy: 'Los sostenidos pueden parecer raros al inicio, pero siguen una lógica musical.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'chords6', order: 6,
    title: 'Diagramas acordes Sostenidos Mayores',
    experientialTitle: 'Mapa visual de sostenidos mayores',
    subtitle: 'Usa mapas visuales para estudiar los acordes sostenidos.',
    type: 'Diagrama', estimatedTime: '5 min', kind: 'diagram',
    description: 'Aquí irán las imágenes con los acordes sostenidos mayores.',
    objective: 'Estudiar visualmente las posiciones de los acordes sostenidos mayores.',
    microVictory: 'Ya tienes un mapa para practicar sostenidos mayores.',
    antiFrustrationCopy: 'Cuando un acorde parece difícil, vuelve al mapa y busca una posición cómoda.',
    diagramAssets: [],
    diagramPlaceholder: 'Imágenes de acordes sostenidos mayores pendientes de adjuntar',
  },
  {
    id: 'chords7', order: 7,
    title: 'Acordes Menores',
    experientialTitle: 'El color emocional de los acordes menores',
    subtitle: 'Reconoce el sonido emocional de los acordes menores.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video explicando los acordes menores.',
    objective: 'Comprender qué caracteriza a los acordes menores.',
    microVictory: 'Acordes menores comprendidos.',
    antiFrustrationCopy: 'Los acordes menores no son tristes siempre; son colores nuevos para expresarte.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'chords8', order: 8,
    title: 'Diagramas acordes Menores',
    experientialTitle: 'Mapa visual de acordes menores',
    subtitle: 'Refuerza visualmente las formas de los acordes menores.',
    type: 'Diagrama', estimatedTime: '5 min', kind: 'diagram',
    description: 'Aquí irán las imágenes con los acordes menores.',
    objective: 'Estudiar visualmente las posiciones de los acordes menores.',
    microVictory: 'Ya tienes un mapa para practicar acordes menores.',
    antiFrustrationCopy: 'Los diagramas te ayudan a reconocer patrones, no solo posiciones aisladas.',
    diagramAssets: [],
    diagramPlaceholder: 'Imágenes de acordes menores pendientes de adjuntar',
  },
  {
    id: 'chords9', order: 9,
    title: 'Acordes Séptima, Séptima Menor y Maj7',
    experientialTitle: 'Acordes con más color',
    subtitle: 'Explora acordes con más color y tensión musical.',
    type: 'Video práctica', estimatedTime: '7 min', kind: 'video',
    description: 'Aquí irá un video explicando los acordes séptima, séptima menor y Maj7.',
    objective: 'Comprender la diferencia general entre acordes de séptima, séptima menor y Maj7.',
    microVictory: 'Nuevos colores armónicos desbloqueados.',
    antiFrustrationCopy: 'No tienes que dominarlos todos hoy. Primero aprende a reconocer que existen.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'chords10', order: 10,
    title: 'Diagrama de Acordes Séptima y Maj7',
    experientialTitle: 'Mapa visual de séptimas y Maj7',
    subtitle: 'Estudia visualmente acordes de séptima y Maj7.',
    type: 'Diagrama', estimatedTime: '5 min', kind: 'diagram',
    description: 'Aquí irán las imágenes con acordes séptima, séptima menor y Maj7.',
    objective: 'Reforzar visualmente las posiciones de acordes con séptima y Maj7.',
    microVictory: 'Ya tienes un mapa para explorar acordes con más color.',
    antiFrustrationCopy: 'Estos acordes son más avanzados. Acércate a ellos con curiosidad, no con presión.',
    diagramAssets: [],
    diagramPlaceholder: 'Imágenes de acordes séptima y Maj7 pendientes de adjuntar',
  },
  {
    id: 'chords11', order: 11,
    title: 'Transportando acordes',
    experientialTitle: 'Mueve tus acordes por el mapa',
    subtitle: 'Aprende a mover acordes para tocar en distintas tonalidades.',
    type: 'Video práctica', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video explicando cómo transportar acordes en ukelele.',
    objective: 'Comprender la idea básica de transportar acordes.',
    microVictory: 'Ya sabes que una canción puede moverse de tonalidad.',
    antiFrustrationCopy: 'Transportar acordes parece teoría, pero en realidad es una herramienta práctica para cantar y tocar mejor.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'chords12', order: 12,
    title: 'Cierre Isla de los Acordes',
    experientialTitle: 'Tu mapa de acordes creció',
    subtitle: 'Revisa lo aprendido y celebra tu comprensión musical.',
    type: 'Cierre de isla', estimatedTime: '4 min', kind: 'closure',
    description: 'Aquí irá un resumen con lo aprendido en la Isla de los Acordes.',
    objective: 'Hacer visible el avance logrado comprendiendo familias de acordes, diagramas, cejillo y transporte.',
    microVictory: 'Cierre consciente de la Isla de los Acordes.',
    antiFrustrationCopy: 'No aprendiste solo posiciones: empezaste a entender el lenguaje de la música.',
    videoUrl: V_URL, videoId: V_ID,
  },
];

export const CHORDS_SUMMARY_CHIPS = [
  'Qué es un acorde',
  'Acordes mayores',
  'Cejillo',
  'Sostenidos mayores',
  'Acordes menores',
  'Séptima / Maj7',
  'Transporte de acordes',
];

export const CHORDS_CLOSURE_QUESTIONS = {
  feeling: {
    question: '¿Cómo te sientes al cerrar esta isla?',
    options: ['Feliz', 'Orgulloso', 'Con dudas', 'Motivado', 'Cansado'],
  },
  hardest: {
    question: '¿Qué fue lo que más te costó?',
    options: [
      'Entender acordes mayores',
      'Entender acordes menores',
      'Acordes con cejillo',
      'Acordes sostenidos',
      'Acordes séptima / Maj7',
      'Transportar acordes',
      'Nada por ahora',
    ],
  },
  readiness: {
    question: '¿Qué tan listo te sientes para seguir avanzando?',
    labels: ['Aún no', 'Con dudas', 'Más o menos', 'Bastante listo', 'Muy listo'],
  },
};

export function findChordsLesson(id: string): ChordsLesson | undefined {
  return CHORDS_LESSONS.find(l => l.id === id);
}
