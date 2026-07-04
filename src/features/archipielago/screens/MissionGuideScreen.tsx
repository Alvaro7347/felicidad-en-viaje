import { B, PHOTOS } from "../data/brand";
import type { Screen } from "../types";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { Tag } from "../components/Tag";
import { BackBtn } from "../components/BackBtn";

export function MissionGuideScreen({ onBack }: { onBack: () => void }) {
  const userName = 'Navegante';
  const firstName = userName.split(' ')[0];
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
        <div style={{ position: 'relative', height: 210 }}>
          <img src={PHOTOS.class} alt="Video de bienvenida" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(60,60,59,0.42)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(255,255,255,0.93)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, paddingLeft: 3, boxShadow: '0 4px 18px rgba(0,0,0,0.2)' }}>▶</div>
            <span style={{ color: B.white, fontWeight: 800, fontSize: 14, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>Video de bienvenida · 2 min</span>
            <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: 12, lineHeight: 1.5, maxWidth: 400 }}>
              Tu guía te cuenta cómo será este viaje y por qué no necesitas tocar perfecto para comenzar.
            </span>
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
          <div><strong style={{ color: B.dark }}>Nombre:</strong> Rocío Martínez</div>
          <div><strong style={{ color: B.dark }}>Rol:</strong> Profesora guía SoundKeleles</div>
          <div><strong style={{ color: B.dark }}>Experiencia:</strong> Acompaña a personas que están comenzando desde cero, con foco en confianza, calma y pequeñas victorias musicales.</div>
          <div><strong style={{ color: B.dark }}>Estilo de enseñanza:</strong> Paso a paso, sin presión y celebrando cada avance.</div>
          <div><strong style={{ color: B.dark }}>Frase del guía:</strong> “No estás aquí para demostrar talento. Estás aquí para descubrir tu sonido.”</div>
        </div>
      </Card>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.grayText, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          ¿Necesitas apoyo?
        </div>
        <p style={{ margin: '0 0 12px', color: '#666', lineHeight: 1.7, fontSize: 13 }}>
          Si tienes una duda o necesitas acompañamiento, puedes escribirle a tu profesora guía.
        </p>
        <Btn variant="ghost" onClick={() => {}} fullWidth>
          Escríbele aquí
        </Btn>
      </Card>
      <Btn onClick={onBack} fullWidth>Volver a la ruta</Btn>
    </div>
  );
}

// ─── Screen: Celebration ──────────────────────────────────────────────────────
