import { useState } from "react";
import { B } from "../data/brand";
import type { Screen } from "../types";
import { Btn } from "../components/Btn";

export function OnboardingScreen({ onStart }: { onStart: () => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pressedId, setPressedId] = useState<string | null>(null);

  const routeCards = [
    {
      id: 'quise',
      icon: '🌱',
      shortTitle: 'Quiero empezar',
      desc: 'Nunca he podido aprender, pero esta vez es diferente.',
      tag: 'Una ruta para ti, paso a paso.',
      active: true,
    },
    {
      id: 'familia',
      icon: '🏡',
      shortTitle: 'Quiero acompañar',
      desc: 'Para ayudar a mi familia a descubrir su música.',
      tag: null,
      active: false,
    },
    {
      id: 'regalo',
      icon: '🎸',
      shortTitle: 'Ya tengo experiencia',
      desc: 'Quiero seguir creciendo y tocar más.',
      tag: null,
      active: false,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 8 }}>

      {/* ── Hero: island + title ── */}
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 999,
          background: B.greenLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, margin: '0 auto 20px',
          boxShadow: `0 0 0 8px rgba(46,230,174,0.1)`,
        }}>
          🏝
        </div>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(22px, 5vw, 28px)',
          fontWeight: 800, color: B.dark,
          margin: '0 0 10px 0', lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          ¿Cómo quieres comenzar<br />
          tu <span style={{ color: B.green }}>viaje musical</span>?
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 18, color: B.green, letterSpacing: 4 }}>〰</span>
        </div>
        <p style={{ fontSize: 13, color: '#999', margin: 0, lineHeight: 1.6 }}>
          Cada ruta está diseñada<br />para acompañarte en tu momento actual.
        </p>
      </div>

      {/* ── Route cards — 3-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {routeCards.map((r) => {
          const isHovered = hoveredId === r.id;
          const isPressed = pressedId === r.id;

          const scale = isPressed
            ? (r.active ? 'scale(0.97)' : 'scale(0.98)')
            : isHovered
            ? (r.active ? 'scale(1.03)' : 'scale(1.015)')
            : 'scale(1)';

          const shadow = isPressed
            ? (r.active ? '0 2px 8px rgba(46,230,174,0.12)' : '0 1px 4px rgba(0,0,0,0.04)')
            : isHovered
            ? (r.active ? '0 8px 28px rgba(46,230,174,0.28)' : '0 4px 14px rgba(0,0,0,0.09)')
            : (r.active ? '0 4px 20px rgba(46,230,174,0.18)' : '0 2px 8px rgba(0,0,0,0.04)');

          return (
            <div
              key={r.id}
              onMouseEnter={() => setHoveredId(r.id)}
              onMouseLeave={() => { setHoveredId(null); setPressedId(null); }}
              onMouseDown={() => setPressedId(r.id)}
              onMouseUp={() => setPressedId(null)}
              onTouchStart={() => setPressedId(r.id)}
              onTouchEnd={() => setPressedId(null)}
              onTouchCancel={() => setPressedId(null)}
              style={{
                background: B.white,
                border: r.active ? `2px solid ${B.green}` : `1.5px solid #ebebeb`,
                borderRadius: 20,
                padding: '14px 10px 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: shadow,
                transform: scale,
                transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease',
                opacity: r.active ? 1 : 0.72,
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              {/* Top-right badge */}
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                {r.active
                  ? <div style={{
                      width: 20, height: 20, borderRadius: 999,
                      background: B.green, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: B.dark, fontWeight: 900,
                      transition: 'transform 0.18s ease',
                      transform: isPressed ? 'scale(0.9)' : isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}>✓</div>
                  : <div style={{
                      width: 18, height: 18, borderRadius: 999,
                      background: '#eee', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#aaa',
                    }}>🔒</div>
                }
              </div>

              {/* Icon circle */}
              <div style={{
                width: 56, height: 56, borderRadius: 999,
                background: r.active ? B.greenLight : '#f4f4f4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, marginBottom: 10,
                boxShadow: r.active
                  ? (isHovered ? `0 0 0 7px rgba(46,230,174,0.18)` : `0 0 0 5px rgba(46,230,174,0.12)`)
                  : 'none',
                filter: r.active ? 'none' : 'grayscale(0.3)',
                transition: 'box-shadow 0.2s ease',
              }}>
                {r.icon}
              </div>

              {/* Title */}
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 800, fontSize: 12,
                color: r.active ? B.dark : '#888',
                textAlign: 'center', lineHeight: 1.25,
                marginBottom: 6,
              }}>
                {r.shortTitle}
              </div>

              {/* Description */}
              <div style={{
                fontSize: 10, color: r.active ? '#777' : '#bbb',
                textAlign: 'center', lineHeight: 1.45,
                marginBottom: r.active ? 10 : 8,
              }}>
                {r.desc}
              </div>

              {/* Tag or pill */}
              {r.active && r.tag && (
                <div style={{
                  fontSize: 10, color: B.greenDark,
                  fontWeight: 800, textAlign: 'center',
                  lineHeight: 1.4,
                }}>
                  🌿 {r.tag}
                </div>
              )}
              {!r.active && (
                <div style={{
                  fontSize: 10, color: '#bbb', fontWeight: 700,
                  background: '#f2f2f2', borderRadius: 999,
                  padding: '3px 10px', whiteSpace: 'nowrap',
                }}>
                  Próximamente
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── CTA ── */}
      <div>
        <Btn onClick={onStart} fullWidth>Comenzar mi viaje 🚀</Btn>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#ccc', margin: '10px 0 0 0', fontStyle: 'italic' }}>
          Cada acorde es una pequeña victoria.
        </p>
      </div>

    </div>
  );
}

// ─── Screen: Diagnóstico musical inicial ─────────────────────────────────────
