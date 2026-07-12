import { useState } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";
import { LessonCompletionBox } from "../components/LessonCompletionBox";
import { LessonDiscussionSection } from "@/features/discussions/components/LessonDiscussionSection";

type Step = { icon: string; title: string; text: string };

const STEPS: Step[] = [
  {
    icon: "🗺️",
    title: "Este es tu mapa",
    text: "El Archipiélago es una ruta para aprender ukelele paso a paso, sin apuro y sin presión.",
  },
  {
    icon: "🏝️",
    title: "Cada isla tiene un propósito",
    text: "En cada isla trabajarás una parte distinta del viaje: prepararte, tocar tus primeros acordes, mejorar tu pulso y avanzar con ritmo.",
  },
  {
    icon: "🎯",
    title: "Avanzas por misiones pequeñas",
    text: "Cada misión es concreta y posible. Algunas tienen video, otras práctica, reflexión o pequeños retos.",
  },
  {
    icon: "⭐",
    title: "Los puntos no miden talento",
    text: "Los puntos y sellos no son para compararte. Son señales de avance: muestran que seguiste navegando.",
  },
  {
    icon: "🤝",
    title: "No navegas solo",
    text: "Si tienes dudas o te frustras, puedes pedir apoyo. Este viaje está diseñado para acompañarte.",
  },
];

export function MissionThreeScreen({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;
  const step = STEPS[index];

  const handleNext = () => {
    if (isLast) setFinished(true);
    else setIndex((i) => i + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="¿Qué es el Archipiélago?"
        subtitle="Antes de seguir, te mostraremos cómo funciona tu viaje musical."
      />

      {!finished ? (
        <>
          {/* Contador de pasos */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 2px",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: B.grayText,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
              }}
            >
              Paso {index + 1} de {STEPS.length}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: i === index ? 22 : 8,
                    height: 8,
                    borderRadius: 999,
                    background: i <= index ? B.green : B.grayBorder,
                    transition: "width 0.2s ease, background 0.2s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Tarjeta del paso */}
          <Card
            style={{
              minHeight: 260,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "32px 24px",
              background: B.greenLight,
              border: `1px solid ${B.grayBorder}`,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 999,
                background: B.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                boxShadow: "0 4px 18px rgba(46,230,174,0.25)",
                marginBottom: 18,
              }}
            >
              {step.icon}
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: B.dark,
                letterSpacing: "-0.01em",
                marginBottom: 10,
              }}
            >
              {step.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.65,
                color: B.dark,
                opacity: 0.78,
                maxWidth: 420,
              }}
            >
              {step.text}
            </p>
          </Card>

          {/* Controles */}
          <div style={{ display: "flex", gap: 10 }}>
            {!isFirst && (
              <button
                onClick={() => setIndex((i) => i - 1)}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: `1.5px solid ${B.grayBorder}`,
                  background: B.white,
                  color: B.dark,
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Anterior
              </button>
            )}
            <div style={{ flex: isFirst ? undefined : 1.4, width: isFirst ? "100%" : undefined }}>
              <Btn onClick={handleNext} fullWidth>
                {isLast ? "Terminar recorrido" : "Siguiente"}
              </Btn>
            </div>
          </div>
        </>
      ) : (
        // Microvictoria
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "32px 24px",
            background: B.white,
            border: `1.5px solid ${B.green}`,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: B.greenLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              marginBottom: 16,
            }}
          >
            🧭
          </div>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              color: B.greenDark,
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Microvictoria
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: B.dark,
              letterSpacing: "-0.01em",
              marginBottom: 10,
            }}
          >
            Ya sabes cómo navegar
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.65,
              color: B.dark,
              opacity: 0.78,
              maxWidth: 420,
              marginBottom: 22,
            }}
          >
            Ahora puedes volver al Puerto de Inicio y seguir avanzando una misión a la vez.
          </p>
        </Card>
      )}
      <LessonCompletionBox lessonId="n3" islandId="start-port" onCompleted={onBack} />
    </div>
  );
}
