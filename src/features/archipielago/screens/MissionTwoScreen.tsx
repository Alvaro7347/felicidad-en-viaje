import { useState } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { Tag } from "../components/Tag";
import { BackBtn } from "../components/BackBtn";

export function MissionTwoScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      title: 'Bienvenido al Archipiélago de la Felicidad',
      text: 'No estás entrando a un curso tradicional. Estás entrando a un viaje musical diseñado para ayudarte a descubrir que sí puedes aprender.',
      visual: '🌊🏝️🎸',
    },
    {
      title: 'Cada isla representa una pequeña victoria',
      text: 'En este viaje no avanzas por perfección. Avanzas cada vez que logras una nueva experiencia musical.',
      visual: 'Isla del Silencio · Isla del Pulso · Isla del Ritmo · Isla de las Canciones',
    },
    {
      title: 'Cada logro tiene significado',
      text: 'No coleccionas puntos vacíos. Cada sello representa algo que venciste y un crecimiento emocional y musical.',
      visual: 'Guardián del Silencio · Primer Sonido · Ritmo Despierto',
    },
    {
      title: 'No viajarás solo/a',
      text: 'Tendrás un profesor guía y herramientas IA acompañándote durante el viaje, con comunidad y apoyo humano.',
      visual: '👩‍🏫 💬 🤍',
    },
    {
      title: 'Aquí no buscamos perfección',
      text: 'Queremos ayudarte a sentir que la música también puede ser para ti. Pequeñas victorias. Sin presión. Aprender disfrutando.',
      visual: '✨ Pequeñas victorias · sin presión · tocar la felicidad',
    },
    {
      title: 'Tu primera puerta musical te espera',
      text: 'Hoy no necesitas tocar perfecto. Solo necesitas comenzar.',
      visual: '🏁🎵',
    },
  ];
  const current = slides[slide];
  const prev = () => setSlide((s) => Math.max(0, s - 1));
  const next = () => setSlide((s) => Math.min(slides.length - 1, s + 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <Card style={{ background: B.green, padding: '18px 22px' }}>
        <Tag color="pink">Historia interactiva · 3 min</Tag>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(20px,4vw,26px)', margin: '10px 0 6px 0', color: B.dark }}>
          Conoce el Archipiélago
        </h2>
        <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.55 }}>
          Descubre cómo funciona este viaje musical.
        </p>
      </Card>
      <Card style={{ minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 44, marginBottom: 12 }}>{current.visual}</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
            Slide {slide + 1} de {slides.length}
          </div>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(18px,4vw,24px)', margin: '0 0 10px', color: B.dark, lineHeight: 1.2 }}>
            {current.title}
          </h3>
          <p style={{ margin: 0, color: '#666', lineHeight: 1.7, fontSize: 14 }}>{current.text}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <Btn variant="ghost" onClick={prev} fullWidth={false}>
            Anterior
          </Btn>
          {slide < slides.length - 1 ? (
            <Btn onClick={next} fullWidth={false}>
              Siguiente
            </Btn>
          ) : (
            <Btn onClick={onNext} fullWidth={false}>
              Ir a mi próxima misión
            </Btn>
          )}
        </div>
      </Card>
    </div>
  );
}
