// Data declarativa de las 11 lecciones de la Isla del Rasgueo.
// Sin cierre formal (según Hoja). Todas las lecciones son video.

export type StrummingLessonKind = 'video';

export interface StrummingLesson {
  id: string;
  order: number;
  title: string;
  experientialTitle: string;
  subtitle: string;
  type: string;
  estimatedTime: string;
  kind: StrummingLessonKind;
  description: string;
  objective: string;
  microVictory: string;
  antiFrustrationCopy: string;
  videoUrl: string;
  videoId: string;
}

const V_URL = 'https://www.youtube.com/watch?v=VObhKZhwZwc';
const V_ID = 'VObhKZhwZwc';

export const STRUMMING_LESSONS: StrummingLesson[] = [
  {
    id: 'strumming1', order: 1,
    title: 'Aprende el apagado',
    experientialTitle: 'Aprende el apagado',
    subtitle: 'Descubre cómo silenciar las cuerdas para darle intención al ritmo.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video enseñando el apagado.',
    objective: 'Aprender el recurso del apagado para dar más control rítmico.',
    microVictory: 'Apagado desbloqueado.',
    antiFrustrationCopy: 'El apagado requiere coordinación. Si al principio suena raro, vas bien: tu mano está aprendiendo.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'strumming2', order: 2,
    title: 'Toca Despacito de Luis Fonsi',
    experientialTitle: 'Toca Despacito',
    subtitle: 'Aplica ritmo y acordes en una canción reconocible.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Despacito de Luis Fonsi.',
    objective: 'Practicar una canción conocida usando rasgueo y cambios.',
    microVictory: 'Despacito entra a tu repertorio.',
    antiFrustrationCopy: 'No intentes tocarla perfecta. Primero sigue el pulso y vuelve cuando te pierdas.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'strumming3', order: 3,
    title: 'Toca Corazón de Los Auténticos Decadentes',
    experientialTitle: 'Toca Corazón',
    subtitle: 'Practica una canción energética con rasgueo constante.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando la canción Corazón de Los Auténticos Decadentes.',
    objective: 'Aplicar rasgueo constante en una canción alegre y rítmica.',
    microVictory: 'Corazón desbloqueada.',
    antiFrustrationCopy: 'La energía no significa apurarse. Mantén el ritmo estable.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'strumming4', order: 4,
    title: 'Aprende rasgueo de Balada 1',
    experientialTitle: 'Rasgueo de balada 1',
    subtitle: 'Incorpora un patrón suave para canciones lentas.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video enseñando el rasgueo de balada 1.',
    objective: 'Aprender un patrón de rasgueo para canciones lentas.',
    microVictory: 'Primer rasgueo de balada desbloqueado.',
    antiFrustrationCopy: 'Las baladas necesitan calma. Deja que el movimiento respire.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'strumming5', order: 5,
    title: 'Toca Creep de Radiohead',
    experientialTitle: 'Toca Creep',
    subtitle: 'Usa el rasgueo de balada en una canción intensa.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Creep de Radiohead.',
    objective: 'Aplicar rasgueo de balada en una canción emocional.',
    microVictory: 'Creep entra a tu repertorio.',
    antiFrustrationCopy: 'La intensidad no está en tocar fuerte, sino en sostener la intención.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'strumming6', order: 6,
    title: 'Toca One de U2',
    experientialTitle: 'Toca One',
    subtitle: 'Practica una canción emocional sosteniendo el pulso.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando One de U2.',
    objective: 'Practicar acompañamiento estable en una canción lenta y emocional.',
    microVictory: 'One desbloqueada.',
    antiFrustrationCopy: 'Tocar lento también es difícil. Dale valor a cada cambio bien respirado.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'strumming7', order: 7,
    title: 'Toca The Reason de Hoobastank',
    experientialTitle: 'Toca The Reason',
    subtitle: 'Aplica rasgueo y cambios en una balada moderna.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando The Reason de Hoobastank.',
    objective: 'Seguir desarrollando control rítmico en canciones de balada.',
    microVictory: 'The Reason entra a tu repertorio.',
    antiFrustrationCopy: 'Si una parte se siente difícil, repítela como una pequeña isla dentro de la canción.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'strumming8', order: 8,
    title: 'Aprende rasgueo de Balada 2',
    experientialTitle: 'Rasgueo de balada 2',
    subtitle: 'Suma una nueva variación para acompañamientos suaves.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video enseñando el rasgueo de balada 2.',
    objective: 'Aprender una segunda variación de rasgueo para baladas.',
    microVictory: 'Segundo rasgueo de balada desbloqueado.',
    antiFrustrationCopy: 'Una variación nueva puede desordenarte al principio. Vuelve al pulso y simplifica.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'strumming9', order: 9,
    title: 'Toca Miénteme una vez de Los Vásquez',
    experientialTitle: 'Toca Miénteme una vez',
    subtitle: 'Practica una canción popular con rasgueo de balada.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Miénteme una vez de Los Vásquez.',
    objective: 'Aplicar rasgueo de balada en una canción popular chilena.',
    microVictory: 'Miénteme una vez desbloqueada.',
    antiFrustrationCopy: 'No necesitas tocar como la grabación original. Necesitas acompañar con intención.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'strumming10', order: 10,
    title: 'Toca A Thousand Years de Christina Perri',
    experientialTitle: 'Toca A Thousand Years',
    subtitle: 'Acompaña una canción lenta cuidando emoción y ritmo.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando A Thousand Years de Christina Perri.',
    objective: 'Practicar una balada internacional con control y sensibilidad.',
    microVictory: 'A Thousand Years entra a tu repertorio.',
    antiFrustrationCopy: 'En una canción lenta, cada cambio se nota más. Eso también te ayuda a mejorar.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'strumming11', order: 11,
    title: 'Toca Mi Eterno amor secreto de Juan Antonio Solís',
    experientialTitle: 'Toca Mi Eterno amor secreto',
    subtitle: 'Cierra esta ruta aplicando tus rasgueos de balada.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Mi Eterno amor secreto de Juan Antonio Solís.',
    objective: 'Aplicar lo aprendido en una última canción de esta isla.',
    microVictory: 'Mi Eterno amor secreto entra a tu repertorio.',
    antiFrustrationCopy: 'Esta clase cierra la ruta por ahora, pero no necesita ser un cierre formal. Es una canción más para seguir tocando.',
    videoUrl: V_URL, videoId: V_ID,
  },
];

export function findStrummingLesson(id: string): StrummingLesson | undefined {
  return STRUMMING_LESSONS.find(l => l.id === id);
}
