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

        {/* ── Logo + claim — centrado, con aire intencional ── */}
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
            src="/logo-calipso.png"
            alt="SoundKeleles"
            style={{
              width: 'min(200px, 52vw)',
              display: 'block',
              animation: 'sk-float 3.6s ease-in-out infinite',
            }}
          />

          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(17px, 4.2vw, 22px)',
            fontWeight: 500,
            color: B.dark,
            margin: '4px 0 0 0',
            lineHeight: 1.2,
            letterSpacing: '0.01em',
          }}>
            Toca la felicidad
          </p>
        </div>

        {/* ── Botones — anclados al fondo, siempre visibles ── */}
        <div style={{
          width: '100%',
          maxWidth: 380,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          paddingBottom: 52,
          flexShrink: 0,
        }}>

          {/* Botón principal */}
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
              borderRadius: 18,
              padding: '18px 28px',
              textAlign: 'center',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 17,
              color: B.dark,
              boxShadow: pressBtn1
                ? '0 2px 8px rgba(27,202,152,0.22)'
                : hovBtn1
                ? '0 8px 28px rgba(27,202,152,0.40)'
                : '0 4px 18px rgba(27,202,152,0.28)',
              transform: pressBtn1 ? 'scale(0.98)' : hovBtn1 ? 'scale(1.02)' : 'scale(1)',
              transition: 'transform 0.16s ease, box-shadow 0.16s ease',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            No tengo cuenta
          </div>

          {/* Botón secundario — visible, deshabilitado elegantemente */}
          <div
            onMouseEnter={() => setHovBtn2(true)}
            onMouseLeave={() => { setHovBtn2(false); setPressBtn2(false); }}
            onMouseDown={() => setPressBtn2(true)}
            onMouseUp={() => setPressBtn2(false)}
            onTouchStart={() => setPressBtn2(true)}
            onTouchEnd={() => setPressBtn2(false)}
            onTouchCancel={() => setPressBtn2(false)}
            style={{
              background: B.white,
              border: `1.5px solid ${B.greenDark}`,
              borderRadius: 18,
              padding: '16px 24px',
              textAlign: 'center',
              cursor: 'default',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: B.greenDark,
              opacity: 0.45,
              transform: pressBtn2 ? 'scale(0.99)' : 'scale(1)',
              transition: 'transform 0.16s ease',
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
