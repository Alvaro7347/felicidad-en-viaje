import { B } from "../data/brand";
import { DIAG_QUESTIONS } from "../data/diagnosis";
import type { Screen, DiagAnswers } from "../types";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { DiagnosisProgress } from "../components/DiagnosisProgress";

export function DiagnosisResultScreen({ answers, userName, onEnter }: {
  answers: DiagAnswers;
  userName: string;
  onEnter: () => void;
}) {
  const firstName = userName.split(' ')[0];

  const needsVal = answers[5];
  const needsText = Array.isArray(needsVal)
    ? needsVal.join(' · ')
    : (needsVal ?? '—');

  const summary = [
    { label: 'Tu punto de partida', icon: '🌱', value: answers[1] as string ?? '—' },
    { label: 'Tu motivo de fondo', icon: '💛', value: answers[2] as string ?? '—' },
    { label: 'Tu emoción principal', icon: '💫', value: answers[3] as string ?? '—' },
    { label: 'Tu horizonte de tiempo', icon: '🗓', value: answers[4] as string ?? '—' },
    { label: 'Lo que necesitás de nosotros', icon: '🤝', value: needsText },
    { label: 'Tu ritmo de práctica', icon: '⏱', value: answers[6] ? `${answers[6]} al día` : '—' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Unified diagnosis progress header — completed state */}
      <DiagnosisProgress currentStep={DIAG_QUESTIONS.length} totalSteps={DIAG_QUESTIONS.length} completed />


      {/* Header — personalized */}
      <div style={{ background: B.green, borderRadius: 22, padding: '24px 26px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🧭</div>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
          fontSize: 'clamp(20px, 4vw, 26px)', color: B.dark,
          margin: '0 0 12px 0', lineHeight: 1.2,
        }}>
          {firstName}, tu viaje ya tiene brújula.
        </h2>
        <p style={{ fontSize: 14, color: '#4a4a49', margin: '0 0 12px 0', lineHeight: 1.7 }}>
          Tu viaje hacia la felicidad musical ya comenzó. Desde ahora,
          el Archipiélago usará todo lo que nos contaste para acompañarte
          con pequeñas victorias, sin presión y a tu propio ritmo.
        </p>
        <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['🎵 Música', '🏝 Viaje', '✨ Felicidad', '🌱 Victorias'].map(t => (
            <span key={t} style={{
              background: 'rgba(60,60,59,0.12)', borderRadius: 999,
              padding: '4px 12px', fontSize: 12, fontWeight: 800, color: B.dark,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Profile summary */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.grayText, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 14 }}>
          Tu perfil musical
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {summary.map((item) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '11px 13px', background: B.gray, borderRadius: 13,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: B.grayText, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.dark, lineHeight: 1.45 }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Btn onClick={onEnter} variant="pink" fullWidth>Entrar al Archipiélago 🏝</Btn>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#bbb', margin: '-6px 0 0', fontStyle: 'italic' }}>
        "No vienes a demostrar talento. Vienes a descubrir que sí puedes hacer música."
      </p>
    </div>
  );
}

// ─── Screen: Entry Moment (micro-transition) ──────────────────────────────────
