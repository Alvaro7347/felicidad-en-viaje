import { useState } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  feedbackOk: string;
  feedbackKo: string;
};

const QUESTIONS: Question[] = [
  {
    question: "¿Cuál parte del ukelele vibra para producir el sonido?",
    options: ["Cuerdas", "Clavijas", "Trastes", "Cuerpo"],
    correctIndex: 0,
    feedbackOk: "Exacto. Las cuerdas vibran y producen el sonido.",
    feedbackKo: "No pasa nada. Las que vibran para producir el sonido son las cuerdas.",
  },
  {
    question: "¿Qué parte sirve para afinar las cuerdas?",
    options: ["Clavijas", "Trastes", "Boca", "Mástil"],
    correctIndex: 0,
    feedbackOk: "Muy bien. Las clavijas permiten ajustar la afinación.",
    feedbackKo: "Casi. Las clavijas son las que permiten ajustar la afinación.",
  },
  {
    question: "¿Dónde apoyas los dedos para formar notas y acordes?",
    options: ["Mástil", "Cuerpo", "Puente", "Boca"],
    correctIndex: 0,
    feedbackOk: "Correcto. En el mástil apoyas los dedos para formar notas y acordes.",
    feedbackKo: "Buena aproximación. La zona donde apoyas los dedos para tocar notas y acordes es el mástil.",
  },
  {
    question: "¿Qué son los trastes?",
    options: [
      "Pequeñas divisiones que ayudan a encontrar sonidos",
      "Las cuerdas más graves",
      "Las clavijas pequeñas",
      "La parte hueca del cuerpo",
    ],
    correctIndex: 0,
    feedbackOk: "Exacto. Los trastes te ayudan a ubicar los sonidos.",
    feedbackKo: "Tranquilo. Los trastes son pequeñas divisiones que te ayudan a encontrar sonidos.",
  },
  {
    question: "¿Por qué es útil conocer las partes del ukelele?",
    options: [
      "Porque te da más confianza para tocar",
      "Porque hace que el ukelele suene solo",
      "Porque evita tener que practicar",
      "Porque reemplaza la afinación",
    ],
    correctIndex: 0,
    feedbackOk: "Sí. Conocer tu instrumento te ayuda a tocar con más seguridad.",
    feedbackKo: "Lo importante es esto: conocer tu instrumento te ayuda a tocar con más confianza.",
  },
];

function getResultMessage(score: number) {
  if (score === 5) return "Excelente. Ya reconoces muy bien las partes principales de tu ukelele.";
  if (score >= 3) return "Muy bien. Ya tienes una buena base para seguir navegando.";
  return "Vas comenzando, y eso está bien. Puedes repetir el reto y mirar tu ukelele con más calma.";
}

export function MissionSixScreen({ onBack }: { onBack: () => void }) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const q = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;
  const answered = selected !== null;
  const isCorrect = answered && selected === q.correctIndex;

  const reset = () => {
    setStarted(false);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
  };

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (isLast) {
      setShowResult(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const score = answers.reduce(
    (acc, a, i) => acc + (a === QUESTIONS[i].correctIndex ? 1 : 0),
    0,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Quiz Partes del Ukelele"
        subtitle="Pondrás a prueba lo que aprendiste sobre tu compañero musical."
      />

      {/* INTRO */}
      {!started && !showResult && (
        <>
          <Card>
            <div style={{
              display: "inline-block",
              background: B.greenLight, color: B.greenDark,
              fontWeight: 800, fontSize: 11,
              padding: "4px 10px", borderRadius: 999,
              letterSpacing: "0.6px", textTransform: "uppercase",
              marginBottom: 10,
            }}>
              Reto · 5 preguntas
            </div>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: B.dark }}>
              Este reto es corto. No se trata de saberlo perfecto, sino de reconocer
              mejor tu ukelele antes de seguir avanzando.
            </p>
          </Card>
          <Btn fullWidth onClick={() => setStarted(true)}>Comenzar quiz</Btn>
        </>
      )}

      {/* QUIZ */}
      {started && !showResult && (
        <>
          <div style={{
            fontSize: 12, fontWeight: 800, letterSpacing: "0.8px",
            textTransform: "uppercase", color: B.grayText,
          }}>
            Pregunta {currentIndex + 1} de {QUESTIONS.length}
          </div>

          <Card>
            <h2 style={{
              margin: "0 0 16px 0",
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 19, fontWeight: 800, lineHeight: 1.3, color: B.dark,
            }}>
              {q.question}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const showCorrect = answered && i === q.correctIndex;
                const showWrong = answered && isSelected && i !== q.correctIndex;

                let bg = B.white;
                let border = B.grayBorder;
                let color = B.dark;
                if (showCorrect) { bg = B.greenLight; border = B.green; }
                else if (showWrong) { bg = B.pinkLight; border = B.pink; }
                else if (isSelected) { border = B.dark; }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { if (!answered) setSelected(i); }}
                    disabled={answered}
                    style={{
                      textAlign: "left",
                      background: bg,
                      color,
                      border: `2px solid ${border}`,
                      borderRadius: 14,
                      padding: "12px 14px",
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: 14.5, fontWeight: 600,
                      cursor: answered ? "default" : "pointer",
                      transition: "background 0.15s, border-color 0.15s",
                      display: "flex", alignItems: "center", gap: 10,
                    }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: 999,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      background: showCorrect ? B.green : showWrong ? B.pink : "transparent",
                      color: showCorrect || showWrong ? B.white : B.grayText,
                      border: showCorrect || showWrong ? "none" : `2px solid ${B.grayBorder}`,
                      fontSize: 13, fontWeight: 800, flexShrink: 0,
                    }}>
                      {showCorrect ? "✓" : showWrong ? "✕" : String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {answered && (
            <Card style={{
              background: isCorrect ? B.greenLight : B.pinkLight,
              border: `1px solid ${isCorrect ? B.green : B.pink}`,
              padding: 16,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 800, letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: isCorrect ? B.greenDark : B.pink,
                marginBottom: 4,
              }}>
                {isCorrect ? "Correcto" : "Casi"}
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: B.dark }}>
                {isCorrect ? q.feedbackOk : q.feedbackKo}
              </p>
            </Card>
          )}

          <Btn fullWidth onClick={handleNext} disabled={!answered}>
            {isLast ? "Ver resultado" : "Siguiente"}
          </Btn>
        </>
      )}

      {/* RESULT */}
      {showResult && (
        <>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42, marginBottom: 6 }}>🎉</div>
            <div style={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.8px",
              textTransform: "uppercase", color: B.greenDark, marginBottom: 6,
            }}>
              Resultado
            </div>
            <h2 style={{
              margin: "0 0 10px 0",
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 24, fontWeight: 800, color: B.dark,
            }}>
              Obtuviste {score} de {QUESTIONS.length}
            </h2>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: B.dark }}>
              {getResultMessage(score)}
            </p>
          </Card>

          <Card style={{ background: B.greenLight, border: `1px solid ${B.green}` }}>
            <div style={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.8px",
              textTransform: "uppercase", color: B.greenDark, marginBottom: 6,
            }}>
              Microvictoria
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: B.dark }}>
              Microvictoria desbloqueada: ya reconoces las partes principales de tu ukelele.
            </p>
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Btn fullWidth variant="ghost" onClick={reset}>Reintentar quiz</Btn>
            <Btn fullWidth onClick={onBack}>Volver al Puerto de Inicio</Btn>
          </div>
        </>
      )}
    </div>
  );
}
