// Data declarativa de las 14 lecciones de la Isla del Ritmo.
// Se consume desde RhythmLessonScreen (renderer genérico) y desde
// RhythmIslandScreen. No hay progreso real todavía.

export type RhythmLessonKind = 'video' | 'multiVideo' | 'community' | 'closure';

export interface RhythmVideo {
  label: string;
  title: string;
  videoUrl: string;
  videoId: string;
}

export interface RhythmLesson {
  id: string;
  order: number;
  title: string;
  experientialTitle: string;
  subtitle: string;
  type: string;
  estimatedTime: string;
  kind: RhythmLessonKind;
  description: string;
  objective: string;
  microVictory: string;
  antiFrustrationCopy: string;
  videoUrl?: string;
  videoId?: string;
  videos?: RhythmVideo[];
}

const V_URL = 'https://www.youtube.com/watch?v=VObhKZhwZwc';
const V_ID = 'VObhKZhwZwc';

export const RHYTHM_LESSONS: RhythmLesson[] = [
  {
    id: 'r1', order: 1,
    title: 'Primer rasgueo',
    experientialTitle: 'Tu primer rasgueo',
    subtitle: 'Descubre el movimiento base que empieza a darle ritmo a tu música.',
    type: 'Video práctica', estimatedTime: '4 min', kind: 'video',
    description: 'Aquí irá un video enseñando el primer rasgueo.',
    objective: 'Aprender el primer movimiento rítmico de la mano derecha.',
    microVictory: 'Primer rasgueo desbloqueado.',
    antiFrustrationCopy: 'El ritmo no aparece de golpe; nace de repetir un movimiento simple con calma.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r2', order: 2,
    title: 'LAm y FA ejercicio con rasgueo',
    experientialTitle: 'LAm y FA con rasgueo',
    subtitle: 'Practica tus primeros cambios usando ritmo.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video enseñando a cambiar de acorde usando el primer rasgueo.',
    objective: 'Coordinar cambio de acordes con el rasgueo básico.',
    microVictory: 'Primer cambio con rasgueo completado.',
    antiFrustrationCopy: 'No necesitas correr; necesitas que tus manos empiecen a conversar.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r3', order: 3,
    title: 'LAm y DO ejercicio con rasgueo',
    experientialTitle: 'LAm y DO con rasgueo',
    subtitle: 'Une dos acordes conocidos con movimiento constante.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video de cambio de acorde con los acordes LA menor y DO usando el primer rasgueo.',
    objective: 'Practicar fluidez entre LA menor y DO usando ritmo.',
    microVictory: 'Cambio LAm–DO con rasgueo desbloqueado.',
    antiFrustrationCopy: 'Cada repetición le enseña a tus dedos dónde volver.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r4', order: 4,
    title: 'FA y DO ejercicio con rasgueo',
    experientialTitle: 'FA y DO con rasgueo',
    subtitle: 'Refuerza coordinación entre mano izquierda y derecha.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video de cambio de acorde con los acordes FA y DO usando el primer rasgueo.',
    objective: 'Coordinar FA y DO sin perder el movimiento rítmico.',
    microVictory: 'Cambio FA–DO con rasgueo completado.',
    antiFrustrationCopy: 'Si el rasgueo se corta, no fallaste; solo estás aprendiendo a sostenerlo.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r5', order: 5,
    title: 'SOL y DO ejercicio con rasgueo',
    experientialTitle: 'SOL y DO con rasgueo',
    subtitle: 'Suma el SOL a tus cambios con ritmo.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video de cambio de acorde con los acordes SOL y DO usando el primer rasgueo.',
    objective: 'Integrar SOL y DO manteniendo el pulso del rasgueo.',
    microVictory: 'Cambio SOL–DO con ritmo desbloqueado.',
    antiFrustrationCopy: 'El SOL puede sentirse grande, pero el ritmo te ayudará a ordenarlo.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r6', order: 6,
    title: 'Estrofa Un elefante se balanceaba',
    experientialTitle: 'Un elefante se balanceaba',
    subtitle: 'Aplica rasgueo en una estrofa simple y reconocible.',
    type: 'Tutorial + Karaoke', estimatedTime: '7 min', kind: 'multiVideo',
    description: 'Aquí irán dos videos puestos verticalmente. El primero es el tutorial de Un elefante se balanceaba, y el segundo es el karaoke de la canción.',
    objective: 'Aplicar el primer rasgueo en una canción simple.',
    microVictory: 'Primera estrofa con rasgueo completada.',
    antiFrustrationCopy: 'Las canciones simples son el mejor laboratorio para construir ritmo.',
    videos: [
      { label: 'Tutorial', title: 'Tutorial Un elefante se balanceaba', videoUrl: V_URL, videoId: V_ID },
      { label: 'Karaoke', title: 'Karaoke Un elefante se balanceaba', videoUrl: V_URL, videoId: V_ID },
    ],
  },
  {
    id: 'r7', order: 7,
    title: 'Aprende a tocar Calma de Pedro Capó',
    experientialTitle: 'Aprende Calma',
    subtitle: 'Prepara una canción alegre paso a paso.',
    type: 'Video práctica', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video donde aprenderás a tocar Calma de Pedro Capó en ukelele.',
    objective: 'Aprender la estructura base de Calma en ukelele.',
    microVictory: 'Calma empieza a tomar forma en tus manos.',
    antiFrustrationCopy: 'Aprender una canción es dividirla en partes pequeñas, no tocarla perfecta de inmediato.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r8', order: 8,
    title: 'Karaoke de Calma',
    experientialTitle: 'Toca Calma',
    subtitle: 'Sigue la canción completa con tus acordes y rasgueo.',
    type: 'Karaoke', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video de karaoke de la canción Calma de Pedro Capó.',
    objective: 'Practicar Calma siguiendo una guía de canción.',
    microVictory: 'Primera canción completa con rasgueo practicada.',
    antiFrustrationCopy: 'Si te pierdes, vuelve en el siguiente acorde. La música siempre te deja entrar de nuevo.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r9', order: 9,
    title: 'Recibe feedback de tu primera canción',
    experientialTitle: 'Comparte Calma y recibe feedback',
    subtitle: 'Comparte tu avance de forma opcional para recibir orientación.',
    type: 'Comunidad', estimatedTime: '5 min', kind: 'community',
    description: 'Aquí el alumno podrá cargar su video de la canción Calma de Pedro Capó y recibir feedback de la comunidad.',
    objective: 'Transformar una práctica individual en una oportunidad de acompañamiento.',
    microVictory: 'Tu primera canción puede ser compartida.',
    antiFrustrationCopy: 'Este video no es para juzgarte; es para mirar cuánto has avanzado.',
  },
  {
    id: 'r10', order: 10,
    title: 'Aprende a tocar I Lava You',
    experientialTitle: 'Aprende I Lava You',
    subtitle: 'Construye una nueva canción con calma y emoción.',
    type: 'Video práctica', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video donde aprenderás a tocar I Lava You en ukelele.',
    objective: 'Aprender una canción emotiva aplicando rasgueo y cambios.',
    microVictory: 'Nueva canción emocional desbloqueada.',
    antiFrustrationCopy: 'Tocar bonito no significa tocar perfecto; significa tocar con intención.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r11', order: 11,
    title: 'Toca I Lava You',
    experientialTitle: 'Karaoke I Lava You',
    subtitle: 'Acompaña la canción usando lo aprendido.',
    type: 'Karaoke', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video de karaoke de la canción I Lava You en ukelele.',
    objective: 'Practicar I Lava You siguiendo una guía musical.',
    microVictory: 'I Lava You tocada con acompañamiento.',
    antiFrustrationCopy: 'Escucha, respira y vuelve al pulso. No necesitas perseguir la canción; acompáñala.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r12', order: 12,
    title: 'Aprende a tocar La Bamba',
    experientialTitle: 'Aprende La Bamba',
    subtitle: 'Prepara una canción enérgica con ritmo constante.',
    type: 'Video práctica', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video donde aprenderás a tocar La Bamba en ukelele.',
    objective: 'Aprender una canción rítmica y reconocible.',
    microVictory: 'La Bamba empieza a sonar en tu ukelele.',
    antiFrustrationCopy: 'La energía llega cuando el movimiento se vuelve familiar.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r13', order: 13,
    title: 'Toca La Bamba',
    experientialTitle: 'Karaoke La Bamba',
    subtitle: 'Pon a prueba tu ritmo con una canción reconocible.',
    type: 'Karaoke', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video de karaoke de la canción La Bamba en ukelele.',
    objective: 'Practicar La Bamba siguiendo una guía musical.',
    microVictory: 'Canción rítmica completada.',
    antiFrustrationCopy: 'No se trata de tocar fuerte; se trata de sostener el ritmo con alegría.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'r14', order: 14,
    title: 'Cierre de la Isla del Ritmo',
    experientialTitle: 'Lo que tu ritmo ya logró',
    subtitle: 'Revisa tu avance y celebra tu nueva coordinación musical.',
    type: 'Cierre de isla', estimatedTime: '4 min', kind: 'closure',
    description: 'Aquí irá una clase resumen de lo que se aprendió en la Isla del Ritmo.',
    objective: 'Hacer visible el avance logrado en rasgueo, coordinación y canciones.',
    microVictory: 'Cierre consciente de tu nueva coordinación musical.',
    antiFrustrationCopy: 'Tu ritmo no apareció de golpe: lo construiste paso a paso.',
    videoUrl: V_URL, videoId: V_ID,
  },
];

export const RHYTHM_SUMMARY_CHIPS = [
  'Primer rasgueo',
  'Cambios con rasgueo',
  'Un elefante se balanceaba',
  'Calma',
  'Feedback de comunidad',
  'I Lava You',
  'La Bamba',
  'Coordinación mano izquierda/derecha',
];

export const RHYTHM_CLOSURE_QUESTIONS = {
  feeling: {
    question: '¿Cómo te sientes al cerrar esta isla?',
    options: ['Feliz', 'Orgulloso', 'Con dudas', 'Motivado', 'Cansado'],
  },
  hardest: {
    question: '¿Qué fue lo que más te costó?',
    options: [
      'Mantener el rasgueo',
      'Cambiar acordes a tiempo',
      'Seguir una canción completa',
      'Grabar mi práctica',
      'Nada por ahora',
    ],
  },
  readiness: {
    question: '¿Qué tan listo te sientes para seguir avanzando?',
    labels: ['Aún no', 'Con dudas', 'Más o menos', 'Bastante listo', 'Muy listo'],
  },
};

export function findRhythmLesson(id: string): RhythmLesson | undefined {
  return RHYTHM_LESSONS.find(l => l.id === id);
}
