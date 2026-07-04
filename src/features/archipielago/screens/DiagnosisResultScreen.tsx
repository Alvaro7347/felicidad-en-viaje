import { B } from "../data/brand";
import { DIAG_QUESTIONS } from "../data/diagnosis";
import type { DiagAnswers } from "../types";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { DiagnosisProgress } from "../components/DiagnosisProgress";

// ─── Interpretation helpers ───────────────────────────────────────────────────

interface Insight {
  icon: string;
  title: string;
  text: string;
}

function getStartingPoint(answers: DiagAnswers): Insight {
  const a1 = (answers[1] as string) ?? '';
  const beginner = /nunca he tocado|no pude|vergüenza|frustré/i.test(a1);
  if (beginner) {
    return {
      icon: '🌱',
      title: 'Estás comenzando desde cero',
      text: 'Vamos a partir simple.',
    };
  }
  return {
    icon: '🌱',
    title: 'Ya tenemos claro tu punto de partida',
    text: 'Tu ruta partirá desde donde estás hoy.',
  };
}

function getMotivation(answers: DiagAnswers): Insight {
  const a2 = (answers[2] as string) ?? '';
  if (/demostrarme/i.test(a2)) {
    return { icon: '💪', title: 'Quieres demostrarte que sí puedes', text: 'Tu ruta tendrá pequeñas victorias.' };
  }
  if (/soñé/i.test(a2)) {
    return { icon: '✨', title: 'Hay un sueño musical pendiente', text: 'Vamos a convertirlo en pasos simples.' };
  }
  if (/felicidad/i.test(a2)) {
    return { icon: '💛', title: 'Buscas un momento para ti', text: 'Tu práctica será breve, amable y disfrutable.' };
  }
  if (/compartir/i.test(a2)) {
    return { icon: '🤝', title: 'Quieres compartir música', text: 'Tu ruta te acercará a tocar algo real.' };
  }
  return { icon: '💫', title: 'Tu motivación importa', text: 'Vamos a usarla como motor de tu avance.' };
}

function getSupport(answers: DiagAnswers): Insight {
  const raw = answers[5];
  const needs = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const has = (kw: RegExp) => needs.some((n) => kw.test(n));

  if (has(/paso a paso|acompañ/i)) {
    return { icon: '🧭', title: 'Necesitas avanzar acompañado', text: 'Irás paso a paso, sin presión.' };
  }
  if (has(/explicaciones simples/i)) {
    return { icon: '📖', title: 'Necesitas explicaciones simples', text: 'Evitaremos lo complejo al comienzo.' };
  }
  if (has(/pocos minutos/i)) {
    return { icon: '⏱', title: 'Necesitas una práctica realista', text: 'Trabajaremos con tiempos cortos.' };
  }
  if (has(/anime|frustre/i)) {
    return { icon: '🌈', title: 'Necesitas apoyo cuando aparezca la frustración', text: 'Tu ruta reforzará cada pequeño avance.' };
  }
  return { icon: '🗺', title: 'Necesitas una ruta clara', text: 'Te guiaremos con pasos concretos.' };
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function DiagnosisResultScreen({ answers, userName, onEnter }: {
  answers: DiagAnswers;
  userName: string;
  onEnter: () => void;
}) {
  const firstName = (userName || '').trim().split(/\s+/)[0] || '';

  const insights: Insight[] = [
    getStartingPoint(answers),
    getMotivation(answers),
    getSupport(answers),
  ];

  const supportChips = [
    { icon: '🎬', label: 'Clases breves' },
    { icon: '⏱', label: 'Práctica de 15 min' },
    { icon: '👣', label: 'Paso a paso' },
    { icon: '🕊', label: 'Sin presión' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Unified diagnosis progress header — completed */}
      <DiagnosisProgress currentStep={DIAG_QUESTIONS.length} totalSteps={DIAG_QUESTIONS.length} completed />

      {/* Title + subtitle */}
      <div style={{ textAlign: 'left', padding: '4px 2px 0' }}>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(24px, 5.6vw, 30px)',
          color: B.dark,
          margin: 0,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}>
          {firstName ? `${firstName}, tu perfil ya está listo` : 'Tu perfil ya está listo'}
        </h1>

        <p style={{
          fontFamily: 'Quicksand, sans-serif',
          fontSize: 14,
          color: B.grayText,
          margin: '8px 0 0',
          lineHeight: 1.5,
        }}>
          Transformamos lo que nos contaste en una ruta hecha para ti.
        </p>
      </div>

      {/* Card: Lo que entendimos de ti */}
      <Card style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            color: B.dark,
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Lo que entendimos de ti
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {insights.map((ins, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0' }}>
                <div style={{
                  width: 36, height: 36, flexShrink: 0,
                  borderRadius: '50%',
                  background: B.greenLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>
                  {ins.icon}
                </div>
                <div style={{ minWidth: 0, paddingTop: 2 }}>
                  <div style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontWeight: 700, fontSize: 14, color: B.dark,
                    lineHeight: 1.35, marginBottom: 3,
                  }}>
                    {ins.title}
                  </div>
                  <div style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: 13, color: B.grayText, lineHeight: 1.5,
                  }}>
                    {ins.text}
                  </div>
                </div>
              </div>
              {i < insights.length - 1 && (
                <div style={{ height: 1, background: B.grayBorder, opacity: 0.7 }} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Card: Cómo te acompañaremos */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>🤝</span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            color: B.dark,
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Cómo te acompañaremos
          </h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {supportChips.map((c) => (
            <div key={c.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: B.gray,
              borderRadius: 999,
              padding: '8px 14px',
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: 700, fontSize: 12.5, color: B.dark,
              border: `1px solid ${B.grayBorder}`,
            }}>
              <span style={{ fontSize: 13 }}>{c.icon}</span>
              {c.label}
            </div>
          ))}
        </div>
      </Card>

      {/* Primary CTA */}
      <Btn onClick={onEnter} variant="primary" fullWidth>
        Comenzar mi ruta →
      </Btn>

      {/* Closing line */}
      <p style={{
        textAlign: 'center',
        fontFamily: 'Quicksand, sans-serif',
        fontSize: 12,
        color: B.grayText,
        margin: '-4px 0 0',
        fontStyle: 'italic',
      }}>
        Cada acorde es una pequeña victoria.
      </p>
    </div>
  );
}
