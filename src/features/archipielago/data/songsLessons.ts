// Data declarativa de las 11 lecciones de la Isla de las Canciones.
// Sin cierre formal (según Hoja). Todas las lecciones son video.

export type SongsLessonKind = 'video';

export interface SongsLesson {
  id: string;
  order: number;
  title: string;
  experientialTitle: string;
  subtitle: string;
  type: string;
  estimatedTime: string;
  kind: SongsLessonKind;
  description: string;
  objective: string;
  microVictory: string;
  antiFrustrationCopy: string;
  videoUrl: string;
  videoId: string;
}

const V_URL = 'https://www.youtube.com/watch?v=VObhKZhwZwc';
const V_ID = 'VObhKZhwZwc';

export const SONGS_LESSONS: SongsLesson[] = [
  {
    id: 'songs1', order: 1,
    title: 'Toca Shivers de Ed Sheeran',
    experientialTitle: 'Toca Shivers',
    subtitle: 'Comienza esta isla con una canción pop moderna.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Shivers de Ed Sheeran.',
    objective: 'Practicar una canción pop moderna en ukelele.',
    microVictory: 'Shivers entra a tu repertorio.',
    antiFrustrationCopy: 'Las canciones pop pueden parecer rápidas. Empieza lento y luego sube energía.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'songs2', order: 2,
    title: 'Toca Arrancacorazones de Ataque 77',
    experientialTitle: 'Toca Arrancacorazones',
    subtitle: 'Suma una canción intensa y reconocible a tu repertorio.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Arrancacorazones de Ataque 77.',
    objective: 'Practicar una canción reconocible con energía y cambios constantes.',
    microVictory: 'Arrancacorazones desbloqueada.',
    antiFrustrationCopy: 'La intensidad se construye sosteniendo el ritmo, no apurando los cambios.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'songs3', order: 3,
    title: 'El uso del cejillo en ukelele',
    experientialTitle: 'Usa el cejillo en tu ukelele',
    subtitle: 'Aprende cómo el cejillo abre nuevas posibilidades sonoras.',
    type: 'Video práctica', estimatedTime: '5 min', kind: 'video',
    description: 'Aquí irá un video explicando el uso del cejillo en ukelele.',
    objective: 'Comprender para qué sirve el cejillo y cómo usarlo en canciones.',
    microVictory: 'Cejillo incorporado al viaje.',
    antiFrustrationCopy: 'El cejillo no es un atajo menor; es una herramienta musical real.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'songs4', order: 4,
    title: 'Toca Fuentes de Ortiz de Ed Maverick usando cejillo',
    experientialTitle: 'Fuentes de Ortiz con cejillo',
    subtitle: 'Usa el cejillo para acompañar una canción emocional.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Fuentes de Ortiz de Ed Maverick.',
    objective: 'Aplicar el uso del cejillo en una canción concreta.',
    microVictory: 'Primera canción con cejillo desbloqueada.',
    antiFrustrationCopy: 'Si el cejillo cambia la sensación del instrumento, dale unos minutos a tu mano para adaptarse.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'songs5', order: 5,
    title: 'Toca Tu cárcel de Los Enanitos Verdes',
    experientialTitle: 'Toca Tu cárcel',
    subtitle: 'Lleva un clásico latinoamericano a tu ukelele.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Tu cárcel de Los Enanitos Verdes.',
    objective: 'Practicar un clásico latinoamericano en formato ukelele.',
    microVictory: 'Tu cárcel entra a tu repertorio.',
    antiFrustrationCopy: 'Un clásico no tiene que sonar idéntico al original. Tiene que empezar a sonar en tus manos.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'songs6', order: 6,
    title: 'Toca Antología de Shakira',
    experientialTitle: 'Toca Antología',
    subtitle: 'Practica una canción melódica con expresión.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Antología de Shakira.',
    objective: 'Trabajar una canción melódica cuidando ritmo y emoción.',
    microVictory: 'Antología desbloqueada.',
    antiFrustrationCopy: 'En canciones melódicas, tocar simple y estable vale mucho.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'songs7', order: 7,
    title: 'Toca Quiero ser de Amaia Montero',
    experientialTitle: 'Toca Quiero ser',
    subtitle: 'Suma una canción luminosa a tu repertorio.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Quiero ser de Amaia Montero.',
    objective: 'Practicar una canción pop melódica y cercana.',
    microVictory: 'Quiero ser entra a tu repertorio.',
    antiFrustrationCopy: 'Cada canción nueva reutiliza habilidades que ya construiste antes.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'songs8', order: 8,
    title: 'Toca Andar conmigo de Julieta Venegas',
    experientialTitle: 'Toca Andar conmigo',
    subtitle: 'Practica una canción alegre y cercana.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Andar conmigo de Julieta Venegas.',
    objective: 'Aplicar acompañamiento de ukelele en una canción alegre.',
    microVictory: 'Andar conmigo desbloqueada.',
    antiFrustrationCopy: 'Una canción alegre no exige velocidad; exige continuidad.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'songs9', order: 9,
    title: 'Toca Miel de Lauri García',
    experientialTitle: 'Toca Miel',
    subtitle: 'Explora una canción dulce con acompañamiento simple.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Miel de Lauri García.',
    objective: 'Practicar una canción suave y expresiva.',
    microVictory: 'Miel entra a tu repertorio.',
    antiFrustrationCopy: 'Tocar suave también requiere control. No subestimes las canciones simples.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'songs10', order: 10,
    title: 'Toca Eso que tú me das de Jarabe de Palo',
    experientialTitle: 'Toca Eso que tú me das',
    subtitle: 'Celebra tu avance con una canción llena de gratitud.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Eso que tú me das de Jarabe de Palo.',
    objective: 'Practicar una canción luminosa y emotiva.',
    microVictory: 'Eso que tú me das entra a tu repertorio.',
    antiFrustrationCopy: 'Esta canción puede ser una celebración: no busques perfección, busca presencia.',
    videoUrl: V_URL, videoId: V_ID,
  },
  {
    id: 'songs11', order: 11,
    title: 'Toca Estrellitas y Duendes de Juan Luis Guerra',
    experientialTitle: 'Toca Estrellitas y Duendes',
    subtitle: 'Cierra esta ruta con una canción cálida de Juan Luis Guerra.',
    type: 'Canción guiada', estimatedTime: '6 min', kind: 'video',
    description: 'Aquí irá un video enseñando Estrellitas y Duendes de Juan Luis Guerra.',
    objective: 'Aplicar lo aprendido en una última canción de esta isla.',
    microVictory: 'Estrellitas y Duendes vuelve a tu repertorio con más seguridad.',
    antiFrustrationCopy: 'Repetir una canción en otra etapa no es retroceder; es tocarla con más recursos.',
    videoUrl: V_URL, videoId: V_ID,
  },
];

export function findSongsLesson(id: string): SongsLesson | undefined {
  return SONGS_LESSONS.find(l => l.id === id);
}
