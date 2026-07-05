// Data declarativa de las 11 lecciones de la Isla del Pulso.
// Se consume desde PulseLessonScreen (renderer genérico) y desde
// PulseIslandScreen. No hay progreso real todavía.

import acordeSolImg from "@/assets/chords/acorde-sol.png";

export type PulseLessonKind = 'video' | 'diagram' | 'closure';

export interface PulseDiagramAsset {
  label: string;
  filename: string;
  imageUrl?: string;
}

export interface PulseLesson {
  id: string;
  order: number;
  title: string;
  experientialTitle: string;
  subtitle: string;
  type: string;
  estimatedTime: string;
  kind: PulseLessonKind;
  description: string;
  objective: string;
  microVictory: string;
  antiFrustrationCopy: string;
  videoUrl?: string;
  videoId?: string;
  diagramAssets?: PulseDiagramAsset[];
}

const VIDEO_URL = 'https://www.youtube.com/watch?v=VObhKZhwZwc';
const VIDEO_ID = 'VObhKZhwZwc';

export const PULSE_LESSONS: PulseLesson[] = [
  {
    id: 'p1', order: 1,
    title: 'Acorde SOL',
    experientialTitle: 'El acorde de la luz: SOL',
    subtitle: 'Entiende el SOL como puerta a más canciones.',
    type: 'Video práctica', estimatedTime: '4 min', kind: 'video',
    description: 'Aquí va un video donde se enseña el acorde SOL.',
    objective: 'Entender el SOL como puerta a más canciones.',
    microVictory: 'Nuevo acorde clave desbloqueado.',
    antiFrustrationCopy: 'El SOL parece grande al principio, pero lo construiremos paso a paso.',
    videoUrl: VIDEO_URL, videoId: VIDEO_ID,
  },
  {
    id: 'p2', order: 2,
    title: 'Diagrama de Acorde SOL',
    experientialTitle: 'Mapa visual del SOL',
    subtitle: 'Refuerza el acorde SOL con apoyo visual.',
    type: 'Diagrama', estimatedTime: '2 min', kind: 'diagram',
    description: 'Aquí se muestra el diagrama del acorde SOL para que puedas revisar la posición con calma.',
    objective: 'Reforzar memoria visual del acorde SOL.',
    microVictory: 'Ya tienes tu mapa del SOL.',
    antiFrustrationCopy: 'Vuelve al mapa cada vez que tus dedos necesiten orientarse.',
    diagramAssets: [
      { label: 'Acorde SOL', filename: 'acorde-sol.png', imageUrl: acordeSolImg },
    ],
  },
  {
    id: 'p3', order: 3,
    title: 'SOL y DO ejercicio de cambio',
    experientialTitle: 'Puente SOL–DO',
    subtitle: 'Practica un cambio cercano y controlado.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí va un video donde se enseña el cambio de acorde entre DO y SOL.',
    objective: 'Practicar un cambio cercano y controlado.',
    microVictory: 'Primer puente del pulso construido.',
    antiFrustrationCopy: 'No buscamos velocidad todavía; buscamos que tus dedos encuentren el camino.',
    videoUrl: VIDEO_URL, videoId: VIDEO_ID,
  },
  {
    id: 'p4', order: 4,
    title: 'Cómo leer una partitura de acordes',
    experientialTitle: 'Leer el camino de los acordes',
    subtitle: 'Aprende a seguir una progresión simple.',
    type: 'Video', estimatedTime: '4 min', kind: 'video',
    description: 'Aquí va un video donde se enseña a leer una partitura de acordes.',
    objective: 'Comprender cómo seguir una progresión simple.',
    microVictory: 'Ya puedes leer una guía de acordes.',
    antiFrustrationCopy: 'No leerás partituras difíciles: aprenderás a seguir mapas simples de canciones.',
    videoUrl: VIDEO_URL, videoId: VIDEO_ID,
  },
  {
    id: 'p5', order: 5,
    title: 'La Vaca Lola marcando acorde',
    experientialTitle: 'La Vaca Lola en pulso',
    subtitle: 'Aplica DO y SOL en una canción simple.',
    type: 'Canción guiada', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí va un video donde se enseña La Vaca Lola marcando acordes.',
    objective: 'Aplicar DO y SOL en una canción simple.',
    microVictory: 'Primera canción infantil con SOL completada.',
    antiFrustrationCopy: 'Las canciones simples también construyen grandes músicos.',
    videoUrl: VIDEO_URL, videoId: VIDEO_ID,
  },
  {
    id: 'p6', order: 6,
    title: 'SOL y LAm ejercicio de cambio',
    experientialTitle: 'Puente SOL–LAm',
    subtitle: 'Entrena una distancia mayor entre acordes.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí va un video donde se enseña a cambiar de acorde entre SOL y LA menor.',
    objective: 'Trabajar distancia mayor entre acordes.',
    microVictory: 'Nuevo cambio dominado.',
    antiFrustrationCopy: 'Tus dedos están aprendiendo rutas nuevas. Dales tiempo.',
    videoUrl: VIDEO_URL, videoId: VIDEO_ID,
  },
  {
    id: 'p7', order: 7,
    title: 'SOL y FA ejercicio de cambio',
    experientialTitle: 'Puente SOL–FA',
    subtitle: 'Enfrenta un cambio desafiante con calma.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí va un video donde se enseña el cambio de acorde entre SOL y FA.',
    objective: 'Enfrentar un cambio desafiante con calma.',
    microVictory: 'Cambio difícil desbloqueado.',
    antiFrustrationCopy: 'Este cambio cuesta a muchos. Si te toma más tiempo, vas perfecto.',
    videoUrl: VIDEO_URL, videoId: VIDEO_ID,
  },
  {
    id: 'p8', order: 8,
    title: 'No se va marcando acorde',
    experientialTitle: 'No se va en pulso',
    subtitle: 'Toca una canción popular con cuatro acordes.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí va un video donde se enseña la canción No se va de Morat solo marcando los acordes.',
    objective: 'Sentir que cuatro acordes permiten tocar música popular.',
    microVictory: 'Canción popular desbloqueada.',
    antiFrustrationCopy: 'Sigue el pulso; si pierdes un cambio, vuelve en el siguiente.',
    videoUrl: VIDEO_URL, videoId: VIDEO_ID,
  },
  {
    id: 'p9', order: 9,
    title: 'Cifrado americano',
    experientialTitle: 'Descifra la clave americana',
    subtitle: 'Aprende el idioma moderno de los acordes.',
    type: 'Video + tarjeta', estimatedTime: '3 min', kind: 'video',
    description: 'Aquí va un video donde se enseña la clave americana.',
    objective: 'Entender el lenguaje moderno de los acordes.',
    microVictory: 'Ya puedes leer acordes en clave americana.',
    antiFrustrationCopy: 'Esto no es teoría pesada; es aprender el idioma de los cancioneros.',
    videoUrl: VIDEO_URL, videoId: VIDEO_ID,
  },
  {
    id: 'p10', order: 10,
    title: 'Despacito marcando acorde',
    experientialTitle: 'Despacito en pulso',
    subtitle: 'Aplica LAm–FA–DO–SOL usando cifrado.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí va un video donde se enseña la canción Despacito solo marcando acordes.',
    objective: 'Aplicar una canción reconocible usando los acordes aprendidos.',
    microVictory: 'Nueva canción reconocible desbloqueada.',
    antiFrustrationCopy: 'Aprender una secuencia es como aprender un camino: se vuelve familiar con cada vuelta.',
    videoUrl: VIDEO_URL, videoId: VIDEO_ID,
  },
  {
    id: 'p11', order: 11,
    title: 'Calma marcando acorde',
    experientialTitle: 'Calma en pulso',
    subtitle: 'Cierra la isla tocando con calma.',
    type: 'Cierre de isla', estimatedTime: '6 min', kind: 'closure',
    description: 'Aquí va un video donde se enseña la canción Calma de Pedro Capó solo marcando acorde.',
    objective: 'Cerrar la isla con una canción emocional y alegre.',
    microVictory: 'Cierre feliz de Isla del Pulso.',
    antiFrustrationCopy: 'Respira, disfruta y toca con calma. Llegaste más lejos de lo que creías.',
    videoUrl: VIDEO_URL, videoId: VIDEO_ID,
  },
];

export const PULSE_SUMMARY_CHIPS = [
  'Acorde SOL',
  'Cambio SOL–DO',
  'Cambio SOL–LAm',
  'Cambio SOL–FA',
  'Lectura de partitura de acordes',
  'Cifrado americano',
  'Canciones guiadas',
];

export const PULSE_CLOSURE_QUESTIONS = {
  feeling: {
    question: '¿Cómo te sientes al cerrar esta isla?',
    options: ['Feliz', 'Orgulloso', 'Con dudas', 'Motivado', 'Cansado'],
  },
  hardest: {
    question: '¿Qué fue lo que más te costó?',
    options: ['Acorde SOL', 'Cambios de acorde', 'Seguir el pulso', 'Cifrado americano', 'Nada por ahora'],
  },
  readiness: {
    question: '¿Qué tan listo te sientes para seguir a la Isla del Ritmo?',
    labels: ['Aún no', 'Con dudas', 'Más o menos', 'Bastante listo', 'Muy listo'],
  },
};

export function findPulseLesson(id: string): PulseLesson | undefined {
  return PULSE_LESSONS.find(l => l.id === id);
}
