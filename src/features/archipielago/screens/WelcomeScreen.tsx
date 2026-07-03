import { useState } from "react";
import { B } from "../data/brand";

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [hovBtn1, setHovBtn1] = useState(false);
  const [pressBtn1, setPressBtn1] = useState(false);
  const [hovBtn2, setHovBtn2] = useState(false);
  const [pressBtn2, setPressBtn2] = useState(false);

  return (
    <>
      <style>{`
        @keyframes sk-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes sk-welcome-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        background: B.white,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'sk-welcome-in 0.5s ease forwards',
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        overflowY: 'auto',
        padding: '0 28px',
        boxSizing: 'border-box',
      }}>

        {/* ── Logo + claim — una sola unidad de marca ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          paddingTop: 56,
          paddingBottom: 24,
          width: '100%',
        }}>
          <img
            src="/logo-calipso-cropped.png"
            alt="SoundKeleles"
            style={{
              width: 'min(210px, 56vw)',
              height: 'auto',
              display: 'block',
              animation: 'sk-float 3.6s ease-in-out infinite',
            }}
          />

          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(15px, 3.8vw, 19px)',
            fontWeight: 500,
            color: '#2A2F3A',
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: '0.01em',
          }}>
            Toca la felicidad
          </p>
        </div>

        {/* ── Botones — anclados al fondo, siempre visibles ── */}
        <div style={{
          width: '100%',
          maxWidth: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          paddingBottom: 56,
          flexShrink: 0,
        }}>

          {/* Botón principal — refinado, más fino y premium */}
          <div
            onMouseEnter={() => setHovBtn1(true)}
            onMouseLeave={() => { setHovBtn1(false); setPressBtn1(false); }}
            onMouseDown={() => setPressBtn1(true)}
            onMouseUp={() => setPressBtn1(false)}
            onTouchStart={() => setPressBtn1(true)}
            onTouchEnd={() => { setPressBtn1(false); onStart(); }}
            onTouchCancel={() => setPressBtn1(false)}
            onClick={onStart}
            style={{
              background: '#1BCA98',
              borderRadius: 14,
              padding: '14px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: '0.01em',
              color: B.white,
              boxShadow: pressBtn1
                ? '0 1px 4px rgba(27,202,152,0.18)'
                : hovBtn1
                ? '0 6px 18px rgba(27,202,152,0.28)'
                : '0 3px 10px rgba(27,202,152,0.18)',
              transform: pressBtn1 ? 'scale(0.985)' : hovBtn1 ? 'scale(1.01)' : 'scale(1)',
              transition: 'transform 0.16s ease, box-shadow 0.16s ease',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            No tengo cuenta
          </div>

          {/* Botón secundario — acompaña, no compite */}
          <div
            onMouseEnter={() => setHovBtn2(true)}
            onMouseLeave={() => { setHovBtn2(false); setPressBtn2(false); }}
            onMouseDown={() => setPressBtn2(true)}
            onMouseUp={() => setPressBtn2(false)}
            onTouchStart={() => setPressBtn2(true)}
            onTouchEnd={() => setPressBtn2(false)}
            onTouchCancel={() => setPressBtn2(false)}
            style={{
              background: 'transparent',
              border: `1px solid rgba(27,202,152,0.35)`,
              borderRadius: 14,
              padding: '12px 22px',
              textAlign: 'center',
              cursor: 'default',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 500,
              fontSize: 14.5,
              color: '#6B7280',
              opacity: hovBtn2 ? 0.85 : 0.7,
              transform: pressBtn2 ? 'scale(0.99)' : 'scale(1)',
              transition: 'transform 0.16s ease, opacity 0.16s ease',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            Ya tengo cuenta
          </div>
        </div>


      </div>
    </>
  );
}
