import { useState } from "react";
import { B } from "../data/brand";
import { DIAG_QUESTIONS } from "../data/diagnosis";
import type { Screen, DiagAnswers } from "../types";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { DiagnosisProgress } from "../components/DiagnosisProgress";

export function DiagnosisScreen({ onComplete }: { onComplete: (answers: DiagAnswers, name: string) => void }) {
  // step -1 = name input; steps 0..N-1 = questions
  const [step, setStep] = useState(-1);
  const [nameInput, setNameInput] = useState('');
  const [answers, setAnswers] = useState<DiagAnswers>({});
  const [multiSel, setMultiSel] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  const totalSteps = DIAG_QUESTIONS.length;
  // For the reusable header: on the name step show step 1 with 0% by clamping,
  // then step 0 → question 1, etc.
  const headerStep = step < 0 ? 1 : step + 1;

  const q = step >= 0 ? DIAG_QUESTIONS[step] : null;
  const isMulti = q?.multi ?? false;
  const chosen = q ? answers[q.id] : undefined;

  function advance(newAnswers: DiagAnswers) {
    setAnimating(true);
    setTimeout(() => {
      setMultiSel([]);
      if (step < totalSteps - 1) {
        setStep(step + 1);
      } else {
        onComplete(newAnswers, nameInput.trim() || 'Navegante');
      }
      setAnimating(false);
    }, 280);
  }

  function handleSingleSelect(opt: string) {
    const newAnswers = { ...answers, [q!.id]: opt };
    setAnswers(newAnswers);
    advance(newAnswers);
  }

  function toggleMulti(opt: string) {
    setMultiSel(prev =>
      prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]
    );
  }

  function confirmMulti() {
    if (multiSel.length === 0) return;
    const newAnswers = { ...answers, [q!.id]: multiSel };
    setAnswers(newAnswers);
    advance(newAnswers);
  }

  function handleNameContinue() {
    if (!nameInput.trim()) return;
    setAnimating(true);
    setTimeout(() => { setStep(0); setAnimating(false); }, 260);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, opacity: animating ? 0 : 1, transition: 'opacity 0.28s ease' }}>

      {/* ── Unified diagnosis progress header ── */}
      <DiagnosisProgress currentStep={headerStep} totalSteps={totalSteps} />


      {/* ── Step –1: Name input ── */}
      {step < 0 && (
        <Card>
          <div style={{ fontSize: 22, marginBottom: 14, textAlign: 'center' }}>👋</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: B.pink, marginBottom: 8, letterSpacing: '0.5px', textAlign: 'center' }}>
            Diagnóstico musical inicial
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
            fontSize: 'clamp(18px, 3.5vw, 22px)', color: B.dark,
            margin: '0 0 6px 0', lineHeight: 1.3, textAlign: 'center',
          }}>
            Antes de enseñarte,<br />queremos conocerte.
          </h2>
          <p style={{ fontSize: 14, color: '#888', textAlign: 'center', margin: '0 0 22px 0', lineHeight: 1.6 }}>
            ¿Cómo te llamás?
          </p>
          <input
            type="text"
            placeholder="Tu nombre…"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleNameContinue()}
            autoFocus
            style={{
              width: '100%', boxSizing: 'border-box',
              border: `2px solid ${nameInput.trim() ? B.green : B.grayBorder}`,
              borderRadius: 14, padding: '14px 18px',
              fontFamily: 'Quicksand, sans-serif', fontSize: 16, fontWeight: 700,
              color: B.dark, outline: 'none', marginBottom: 16,
              transition: 'border-color 0.2s',
              background: nameInput.trim() ? B.greenLight : B.white,
            }}
          />
          <Btn
            onClick={handleNameContinue}
            fullWidth
            variant={nameInput.trim() ? 'primary' : 'ghost'}
          >
            Comenzar mi diagnóstico →
          </Btn>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#ccc', margin: '12px 0 0', fontStyle: 'italic' }}>
            Esta app te escucha antes de enseñarte.
          </p>
        </Card>
      )}

      {/* ── Steps 0..N: Questions ── */}
      {step >= 0 && q && (
        <Card>
          <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, marginBottom: 8, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Pregunta {step + 1} de {totalSteps}
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
            fontSize: 'clamp(17px, 3.5vw, 21px)', color: B.dark,
            margin: '0 0 4px 0', lineHeight: 1.3,
          }}>
            {q.question}
          </h2>
          {q.subtitle && (
            <p style={{ fontSize: 13, color: '#999', margin: '0 0 18px 0', fontStyle: 'italic' }}>
              {q.subtitle}
            </p>
          )}
          {!q.subtitle && <div style={{ marginBottom: 18 }} />}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {q.options.map((opt) => {
              const isChosen = isMulti
                ? multiSel.includes(opt)
                : chosen === opt;
              return (
                <button
                  key={opt}
                  onClick={() => isMulti ? toggleMulti(opt) : handleSingleSelect(opt)}
                  style={{
                    textAlign: 'left',
                    border: `2px solid ${isChosen ? B.green : B.grayBorder}`,
                    background: isChosen ? B.greenLight : B.white,
                    borderRadius: 13, padding: '12px 15px', cursor: 'pointer',
                    fontFamily: 'Quicksand, sans-serif', fontWeight: isChosen ? 800 : 600,
                    fontSize: 14, color: isChosen ? B.dark : '#555',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <span style={{
                    width: 22, height: 22,
                    borderRadius: isMulti ? 6 : 999,
                    flexShrink: 0,
                    border: `2px solid ${isChosen ? B.green : B.grayBorder}`,
                    background: isChosen ? B.green : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: B.dark, fontWeight: 900,
                    transition: 'all 0.15s',
                  }}>
                    {isChosen ? '✓' : ''}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {isMulti && (
            <div style={{ marginTop: 16 }}>
              <Btn
                onClick={confirmMulti}
                fullWidth
                variant={multiSel.length > 0 ? 'primary' : 'ghost'}
              >
                {multiSel.length > 0 ? `Continuar con ${multiSel.length} selección${multiSel.length > 1 ? 'es' : ''} →` : 'Elige al menos una opción'}
              </Btn>
            </div>
          )}
        </Card>
      )}

      {/* Back + motivational */}
      {step > 0 && (
        <button onClick={() => setStep(step - 1)} style={{
          border: 'none', background: 'transparent', color: B.grayText,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Quicksand, sans-serif', padding: 0, textAlign: 'center',
        }}>
          ← Volver a la pregunta anterior
        </button>
      )}
      {step === 0 && (
        <button onClick={() => setStep(-1)} style={{
          border: 'none', background: 'transparent', color: B.grayText,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Quicksand, sans-serif', padding: 0, textAlign: 'center',
        }}>
          ← Volver al inicio
        </button>
      )}
    </div>
  );
}

// ─── Screen: Diagnosis Result ─────────────────────────────────────────────────
