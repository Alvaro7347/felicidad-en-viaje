import { useState } from "react";
import { B } from "../data/brand";
import type { Screen } from "../types";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";

export function EntryMomentScreen({ userName, onContinue }: { userName: string; onContinue: () => void }) {
  const firstName = userName.split(' ')[0];
  const [visible, setVisible] = useState(false);

  useState(() => { setTimeout(() => setVisible(true), 60); });

  const islands = [
    { name: 'Isla del\nSilencio', skill: 'Escucha', emoji: '🏝', active: true },
    { name: 'Isla del\nPulso', skill: 'Ritmo', emoji: '🏝', active: false },
    { name: 'Isla del\nRitmo', skill: 'Melodía', emoji: '🏝', active: false },
  ];

  const glossary = [
    { icon: '🏝', term: 'Isla', def: 'una habilidad musical' },
    { icon: '🎯', term: 'Misión', def: 'un pequeño desafío' },
    { icon: '✨', term: 'Microvictoria', def: 'un avance real' },
    { icon: '📖', term: 'Bitácora', def: 'tu progreso' },
  ];

  return (
    <div style={{
      minHeight: '65vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.55s ease, transform 0.55s ease',
    }}>
      <Card style={{ width: '100%', padding: '32px 24px', textAlign: 'center', overflow: 'hidden' }}>

        {/* ── 1. Mapa del Archipiélago ── */}
        <div style={{
          background: B.dark,
          borderRadius: 18,
          padding: '20px 16px 16px',
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            Tu Archipiélago de la Felicidad
          </div>

          {/* Islands row */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 0, marginBottom: 8 }}>
            {islands.map((island, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ textAlign: 'center', opacity: island.active ? 1 : 0.38, position: 'relative' }}>
                  {island.active && (
                    <div style={{
                      fontSize: 9, fontWeight: 800, color: B.green,
                      letterSpacing: '0.05em', marginBottom: 3,
                    }}>
                      EMPEZÁS AQUÍ
                    </div>
                  )}
                  <div style={{ fontSize: island.active ? 36 : 26 }}>🏝</div>
                  <div style={{
                    fontSize: 10, marginTop: 4,
                    color: island.active ? B.green : 'rgba(255,255,255,0.45)',
                    fontWeight: island.active ? 800 : 500,
                    whiteSpace: 'pre-line', lineHeight: 1.3,
                  }}>
                    {island.name}
                  </div>
                  <div style={{
                    fontSize: 9, marginTop: 2,
                    color: island.active ? 'rgba(46,230,174,0.7)' : 'rgba(255,255,255,0.25)',
                    fontStyle: 'italic',
                  }}>
                    {island.skill}
                  </div>
                </div>
                {/* Connector */}
                {i < islands.length - 1 && (
                  <div style={{
                    width: 28, height: 2, marginBottom: 22,
                    background: 'rgba(46,230,174,0.2)',
                    borderRadius: 999, flexShrink: 0,
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Water line */}
          <div style={{ height: 2, background: 'rgba(46,230,174,0.18)', borderRadius: 999, margin: '8px -4px 0' }} />
        </div>

        {/* ── 2. Explicación del sistema ── */}
        <div style={{
          background: '#f7fdfb',
          border: `1.5px solid ${B.greenLight}`,
          borderRadius: 14,
          padding: '16px 18px',
          marginBottom: 18,
          textAlign: 'left',
        }}>
          <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: B.dark, lineHeight: 1.5 }}>
            El Archipiélago es tu viaje musical.
          </p>
          <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.7, fontWeight: 500 }}>
            Cada isla representa una habilidad.<br />
            Cada misión es un pequeño avance.<br />
            No necesitás hacerlo perfecto.<br />
            Solo seguir navegando.
          </p>
        </div>

        {/* ── 3. Mini guía visual ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8, marginBottom: 20,
        }}>
          {glossary.map(({ icon, term, def }, i) => (
            <div key={i} style={{
              background: '#fafafa',
              border: '1.5px solid #eee',
              borderRadius: 10,
              padding: '10px 12px',
              textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              <div style={{ fontSize: 16 }}>{icon}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: B.dark }}>{term}</div>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 500, lineHeight: 1.4 }}>{def}</div>
            </div>
          ))}
        </div>

        {/* ── 4. Mensaje emocional ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, justifyContent: 'center' }}>
          <div style={{ flex: 1, height: 1.5, background: B.greenLight, borderRadius: 999, maxWidth: 48 }} />
          <span style={{ fontSize: 16 }}>🎵</span>
          <div style={{ flex: 1, height: 1.5, background: B.greenLight, borderRadius: 999, maxWidth: 48 }} />
        </div>

        <p style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
          fontSize: 'clamp(17px, 3.5vw, 22px)', color: B.dark,
          margin: '0 0 20px', lineHeight: 1.3,
        }}>
          Navegante, ya cruzaste la puerta.
        </p>

        {/* ── 5. CTA ── */}
        <Btn onClick={onContinue} fullWidth>
          Empezar mi primera misión →
        </Btn>
      </Card>
    </div>
  );
}

// ─── Screen: Ruta Isla del Silencio (visual node path) ────────────────────────
