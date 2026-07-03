import type { DiagQuestion } from "../types";

export const DIAG_QUESTIONS: DiagQuestion[] = [
  {
    id: 1,
    question: '¿Qué frase se parece más a tu historia con la música?',
    options: [
      'Siempre quise aprender, pero me frustré antes',
      'Nunca he tocado un instrumento',
      'Intenté guitarra, pero sentí que no pude',
      'Me da vergüenza equivocarme',
    ],
  },
  {
    id: 2,
    question: '¿Por qué quieres aprender a tocar ukelele?',
    subtitle: 'Tu motivo importa más de lo que crees.',
    options: [
      'Porque siempre soñé con tocar música',
      'Porque quiero demostrarme que sí puedo',
      'Porque quiero un momento de felicidad para mí',
      'Porque quiero compartir música con alguien',
    ],
  },
  {
    id: 3,
    question: '¿Qué emoción aparece cuando piensas en aprender música?',
    options: ['Ilusión ✨', 'Frustración 😤', 'Vergüenza 😳', 'Curiosidad 🔍', 'Miedo 😨', 'Felicidad 😊'],
  },
  {
    id: 4,
    question: '¿En cuánto tiempo te gustaría tocar tu primera canción?',
    subtitle: 'No hay respuesta incorrecta — solo tu ritmo.',
    options: [
      'Esta semana',
      'En dos semanas',
      'En un mes',
      'A mi propio ritmo',
      'No quiero apurarme',
    ],
  },
  {
    id: 5,
    question: '¿Qué necesitarías de esta app para no abandonar?',
    subtitle: 'Puedes elegir más de una.',
    options: [
      'Explicaciones simples',
      'Que me anime cuando me frustre',
      'Avanzar paso a paso',
      'Sentir que alguien me acompaña',
      'Practicar pocos minutos al día',
    ],
    multi: true,
  },
  {
    id: 6,
    question: '¿Cuánto tiempo real puedes practicar al día?',
    options: ['5 minutos', '10 minutos', '15 minutos', '20 minutos o más', 'No lo sé todavía'],
  },
];
