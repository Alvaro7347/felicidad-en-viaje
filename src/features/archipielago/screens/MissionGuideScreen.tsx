import { useState } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { Tag } from "../components/Tag";
import { BackBtn } from "../components/BackBtn";
import alvaroAsset from "../../../assets/alvaro-campos.jpeg.asset.json";

export function MissionGuideScreen({ onBack }: { onBack: () => void }) {
  const userName = 'Navegante';
  const firstName = userName.split(' ')[0];
  const [showContactNotice, setShowContactNotice] = useState(false);
  const guidePhoto = alvaroAsset.url;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <Card style={{ background: B.green, padding: '18px 22px' }}>
        <Tag color="pink">Misión completada · Nodo 1 de 8</Tag>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(20px,4vw,26px)', margin: '10px 0 6px 0', color: B.dark }}>
          Conoce a tu guía
        </h2>
        <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.55 }}>
          Antes de tocar tu primer acorde, queremos que sepas quién caminará contigo.
        </p>
      </Card>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 280, background: '#111' }}>
          <img
            src={guidePhoto}
            alt="Álvaro Campos, fundador y profesor guía de SoundKeleles"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)' }} />
          <button
            type="button"
            aria-label="Reproducir video de bienvenida"
            style={{
              position: 'absolute',
              left: '50%',
              top: '68%',
              transform: 'translate(-50%, -50%)',
              width: 56,
              height: 56,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.28)',
              backdropFilter: 'blur(14px) saturate(140%)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'transform 0.18s ease, background 0.18s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.38)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.28)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true" style={{ marginLeft: 2, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, color: B.white }}>
            <div style={{ fontWeight: 800, fontSize: 14, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Video de bienvenida · 2 min</div>
            <div style={{ fontSize: 12, opacity: 0.92, marginTop: 2, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Álvaro te cuenta cómo será este viaje.
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight: 800, color: B.dark, marginBottom: 10, lineHeight: 1.5, overflowWrap: 'anywhere' }}>
          {firstName}, no estarás solo/a en este viaje.
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          Tu guía SoundKeleles
        </div>
        <div style={{ display: 'grid', gap: 10, fontSize: 13, lineHeight: 1.6, color: '#666' }}>
          <div><strong style={{ color: B.dark }}>Nombre:</strong> Álvaro Campos</div>
          <div><strong style={{ color: B.dark }}>Rol:</strong> Fundador y profesor guía de SoundKeleles</div>
          <div><strong style={{ color: B.dark }}>Experiencia:</strong> Acompaña a personas que están comenzando desde cero, ayudándolas a tocar sus primeros acordes con confianza, calma y pequeñas victorias musicales.</div>
          <div><strong style={{ color: B.dark }}>Estilo de enseñanza:</strong> Paso a paso, simple, cercano y sin presión. La idea es que sientas que sí puedes aprender, aunque nunca hayas tocado un instrumento.</div>
          <div><strong style={{ color: B.dark }}>Frase del guía:</strong> “No estás aquí para demostrar talento. Estás aquí para descubrir tu sonido.”</div>
        </div>
      </Card>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.grayText, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          ¿Necesitas apoyo?
        </div>
        <p style={{ margin: '0 0 12px', color: '#666', lineHeight: 1.7, fontSize: 13 }}>
          Si tienes una duda o necesitas acompañamiento, puedes escribirle a tu profesor guía.
        </p>
        <Btn variant="ghost" onClick={() => setShowContactNotice(true)} fullWidth>
          Escríbele aquí
        </Btn>
        {showContactNotice && (
          <div
            role="status"
            style={{
              marginTop: 12,
              padding: '10px 12px',
              borderRadius: 12,
              background: B.pinkLight,
              border: `1px solid ${B.pink}`,
              color: B.dark,
              fontSize: 12.5,
              lineHeight: 1.5,
            }}
          >
            Pronto podrás escribirle a tu guía desde aquí.
          </div>
        )}
      </Card>
      <Btn onClick={onBack} fullWidth>Volver a la ruta</Btn>
    </div>
  );
}

// ─── Screen: Celebration ──────────────────────────────────────────────────────
