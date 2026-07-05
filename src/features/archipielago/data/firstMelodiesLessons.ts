// Data declarativa de las 10 lecciones de la Isla de Primeras Melodías.
// Se consume desde FirstMelodiesLessonScreen (renderer genérico) y desde
// FirstMelodiesIslandScreen (ruta visual). No hay progreso real todavía.

import acordeDoImg from "@/assets/chords/acorde-do.png";
import acordesLamFaImg from "@/assets/chords/acordes-lam-fa.png";

export type LessonKind = 'video' | 'diagram' | 'community' | 'closure';

export interface DiagramAsset {
  label: string;         // "Acorde DO"
  filename: string;      // referencia interna, útil para debug/futuro PDF
  imageUrl?: string;     // URL/import de imagen renderizable inline
}

export interface Lesson {
  id: string;             // m1..m10 (coincide con nodos de la isla)
  order: number;          // 1..10
  title: string;          // Título "oficial" del curso
  experientialTitle: string; // Título experiencial mostrado al alumno
  subtitle: string;
  type: string;           // "Video práctica" | "Diagrama" | ...
  estimatedTime: string;  // "4 min"
  kind: LessonKind;
  description: string;
  objective: string;
  microVictory: string;
  antiFrustrationCopy: string;

  // Solo video
  videoUrl?: string;
  videoId?: string;
  videoPending?: boolean;

  // Solo diagrama
  pdfAssets?: DiagramAsset[];
}

export const FIRST_MELODIES_LESSONS: Lesson[] = [
  {
    id: 'm1',
    order: 1,
    title: 'Uso de las manos y el Acorde DO',
    experientialTitle: 'Tu primer acorde: DO',
    subtitle: 'Despierta tu mano izquierda y toca tu primer acorde.',
    type: 'Video práctica',
    estimatedTime: '4 min',
    kind: 'video',
    description: 'Aquí aprenderás el acorde DO y cómo se leen las manos en el ukelele.',
    objective: 'Sentir capacidad real en la mano izquierda.',
    microVictory: 'Primer acorde desbloqueado.',
    antiFrustrationCopy: 'Tus dedos no nacieron sabiendo; hoy empiezan a aprender el camino.',
    videoUrl: 'https://www.youtube.com/watch?v=VObhKZhwZwc',
    videoId: 'VObhKZhwZwc',
  },
  {
    id: 'm2',
    order: 2,
    title: 'Diagrama Acorde DO',
    experientialTitle: 'Mapa visual del DO',
    subtitle: 'Aprende a reconocer el acorde DO al verlo.',
    type: 'Diagrama',
    estimatedTime: '2 min',
    kind: 'diagram',
    description: 'Diagrama del acorde DO para reforzar la memoria visual.',
    objective: 'Reforzar memoria visual del acorde.',
    microVictory: 'Ya reconoces el DO al verlo.',
    antiFrustrationCopy: 'Vuelve a este mapa cada vez que lo necesites.',
    pdfAssets: [
      { label: 'Acorde DO', filename: 'acorde-do.pdf' },
    ],
  },
  {
    id: 'm3',
    order: 3,
    title: 'Acordes LAm y FA',
    experientialTitle: 'Dos nuevos amigos: LAm y FA',
    subtitle: 'Suma dos acordes nuevos sin abrumarte.',
    type: 'Video práctica',
    estimatedTime: '5 min',
    kind: 'video',
    description: 'Aprenderás los acordes LA menor y FA, cómo cambiar entre ellos y cómo leerlos en el diagrama.',
    objective: 'Ampliar posibilidades musicales sin abrumar.',
    microVictory: 'Ya tienes tres acordes base.',
    antiFrustrationCopy: 'Vamos de a poco: un dedo, una forma, una pequeña victoria.',
    videoUrl: 'https://www.youtube.com/watch?v=VObhKZhwZwc',
    videoId: 'VObhKZhwZwc',
  },
  {
    id: 'm4',
    order: 4,
    title: 'Diagrama acordes LAm y FA',
    experientialTitle: 'Mapas visuales LAm y FA',
    subtitle: 'Refuerza los acordes con apoyo visual.',
    type: 'Diagrama de acordes',
    estimatedTime: '3 min',
    kind: 'diagram',
    description: 'Diagramas de los acordes LA menor y FA para consulta visual.',
    objective: 'Memorizar acordes con apoyo visual.',
    microVictory: 'Ya puedes volver a tus mapas cuando lo necesites.',
    antiFrustrationCopy: 'Memorizar toma tiempo; los mapas están para acompañarte.',
    pdfAssets: [
      { label: 'Acorde LAm', filename: 'acorde-lam.pdf' },
      { label: 'Acorde FA', filename: 'acorde-fa.pdf' },
    ],
  },
  {
    id: 'm5',
    order: 5,
    title: 'Karaoke estrofa Tren al Sur usando LAm FA',
    experientialTitle: 'Tu primera estrofa: Tren al Sur',
    subtitle: 'Usa LAm y FA para sentir música real.',
    type: 'Karaoke',
    estimatedTime: '6 min',
    kind: 'video',
    description: 'Video con la estrofa de Tren al Sur usando LA menor y FA.',
    objective: 'Sentir que ya estás haciendo música real.',
    microVictory: 'Primera canción emocional desbloqueada.',
    antiFrustrationCopy: 'No importa si te atrasas: vuelve al próximo cambio y sigue navegando.',
    videoUrl: 'https://www.youtube.com/watch?v=VObhKZhwZwc',
    videoId: 'VObhKZhwZwc',
  },
  {
    id: 'm6',
    order: 6,
    title: 'Se enseña Stay With Me marcando acordes',
    experientialTitle: 'Stay With Me en acordes',
    subtitle: 'Consolida tus primeros acordes en una canción conocida.',
    type: 'Video práctica',
    estimatedTime: '5 min',
    kind: 'video',
    description: 'Aprende a tocar Stay With Me marcando LA menor, FA y DO.',
    objective: 'Consolidar DO, LAm y FA en una canción conocida.',
    microVictory: 'Ya puedes acompañar una canción reconocible.',
    antiFrustrationCopy: 'No estamos buscando perfección; estamos construyendo confianza musical.',
    videoUrl: 'https://www.youtube.com/watch?v=VObhKZhwZwc',
    videoId: 'VObhKZhwZwc',
  },
  {
    id: 'm7',
    order: 7,
    title: 'Karaoke Stay With Me',
    experientialTitle: 'Karaoke Stay With Me',
    subtitle: 'Practica cambios de acordes con guía temporal.',
    type: 'Karaoke',
    estimatedTime: '6 min',
    kind: 'video',
    description: 'Sigue con tu ukelele la canción Stay With Me.',
    objective: 'Practicar cambio de acordes con guía temporal.',
    microVictory: 'Segunda canción guiada completada.',
    antiFrustrationCopy: 'Si te pierdes, escucha, respira y vuelve al siguiente acorde.',
    videoUrl: 'https://www.youtube.com/watch?v=VObhKZhwZwc',
    videoId: 'VObhKZhwZwc',
  },
  {
    id: 'm8',
    order: 8,
    title: 'Carga tu video en la Comunidad SoundKeleles',
    experientialTitle: 'Comparte tu primer logro',
    subtitle: 'Podrás subir tu video de forma opcional para recibir feedback.',
    type: 'Comunidad',
    estimatedTime: '5 min',
    kind: 'community',
    description: 'Un espacio para compartir tu práctica y recibir comentarios de la comunidad SoundKeleles.',
    objective: 'Transformar práctica en comunidad y feedback.',
    microVictory: 'Tu primer hito compartido.',
    antiFrustrationCopy: 'Este video no es para juzgarte; es para mirar cuánto estás avanzando.',
  },
  {
    id: 'm9',
    order: 9,
    title: 'Ejercicio de digitación desde cero',
    experientialTitle: 'Dedos despiertos',
    subtitle: 'Entrena coordinación y digitación desde cero.',
    type: 'Video práctica',
    estimatedTime: '4 min',
    kind: 'video',
    description: 'Un ejercicio simple para despertar tus dedos desde cero.',
    objective: 'Preparar coordinación y agilidad desde cero.',
    microVictory: 'Tus dedos ya comenzaron a entrenar.',
    antiFrustrationCopy: 'La velocidad llega después; hoy celebramos que tus dedos se están despertando.',
    videoPending: true,
  },
  {
    id: 'm10',
    order: 10,
    title: 'Conceptos claves aprendidos',
    experientialTitle: 'Lo que ya conquistaste',
    subtitle: 'Revisa acordes, conceptos y logros aprendidos.',
    type: 'Resumen',
    estimatedTime: '3 min',
    kind: 'closure',
    description: 'Resumen de lo aprendido, medición breve y premio de cierre de isla.',
    objective: 'Hacer visible el aprendizaje logrado.',
    microVictory: 'Cierre consciente de avances.',
    antiFrustrationCopy: 'Mira todo lo que ya puedes reconocer y tocar. Esto es avance real.',
  },
];

export const FIRST_MELODIES_SUMMARY_CHIPS = [
  'Acorde DO',
  'Acordes LAm y FA',
  'Lectura de diagramas',
  'Primera estrofa guiada',
  'Stay With Me',
  'Digitación inicial',
  'Compartir logro opcional',
];

export const CLOSURE_QUESTIONS = {
  feeling: {
    question: '¿Cómo te sientes al cerrar esta isla?',
    options: ['Feliz', 'Orgulloso', 'Con dudas', 'Motivado', 'Nervioso'],
  },
  hardest: {
    question: '¿Qué fue lo que más te costó?',
    options: ['Cambiar acordes', 'Recordar posiciones', 'Seguir el ritmo', 'Grabar mi práctica', 'Nada por ahora'],
  },
  readiness: {
    question: '¿Qué tan listo te sientes para seguir a la próxima isla?',
    labels: ['Aún no', 'Con dudas', 'Más o menos', 'Bastante listo', 'Muy listo'],
  },
};

export function findLesson(id: string): Lesson | undefined {
  return FIRST_MELODIES_LESSONS.find(l => l.id === id);
}
