import { B, PHOTOS } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { Tag } from "../components/Tag";
import { BackBtn } from "../components/BackBtn";

export function MissionFourScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Ruta Isla del Silencio" onClick={onBack} />
      <Card style={{ background: B.green, padding: '18px 22px' }}>
        <Tag color="pink">Misión completada · Nodo 4 de 8</Tag>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(20px,4vw,26px)', margin: '10px 0 6px 0', color: B.dark }}>
          Afina tu primer sonido
        </h2>
        <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.55 }}>
          Antes de tocar música, tu ukelele también necesita encontrar su voz.
        </p>
      </Card>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 210 }}>
          <img src={PHOTOS.class} alt="Video de afinación" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(60,60,59,0.42)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(255,255,255,0.93)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, paddingLeft: 3, boxShadow: '0 4px 18px rgba(0,0,0,0.2)' }}>▶</div>
            <span style={{ color: B.white, fontWeight: 800, fontSize: 14, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>Práctica · 5 min</span>
            <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: 12, lineHeight: 1.5, maxWidth: 400 }}>
              Cómo afinar tu ukelele paso a paso
            </span>
          </div>
        </div>
      </Card>
      <Card>
        <p style={{ margin: 0, color: '#666', lineHeight: 1.7, fontSize: 13 }}>
          En este video aprenderás cómo afinar tu ukelele aunque nunca hayas afinado un instrumento antes.
        </p>
      </Card>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          Qué aprenderás
        </div>
        <div style={{ display: 'grid', gap: 10, fontSize: 13, lineHeight: 1.6, color: '#666' }}>
          <div>• Qué significa afinar.</div>
          <div>• Cómo reconocer si una cuerda está muy alta o muy baja.</div>
          <div>• Cómo usar un afinador digital.</div>
          <div>• Cómo preparar tu ukelele para sonar bien.</div>
        </div>
      </Card>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.grayText, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          Afinador recomendado
        </div>
        <p style={{ margin: '0 0 12px', color: '#666', lineHeight: 1.7, fontSize: 13 }}>
          Para esta misión te recomendamos descargar la aplicación GuitarTuna. Es simple, amigable para principiantes y te ayudará a afinar tu ukelele fácilmente.
        </p>
        <Card style={{ background: B.pinkLight, margin: '0 0 12px', padding: '14px 16px', border: `1px solid ${B.pink}` }}>
          <div style={{ fontWeight: 800, color: B.dark, marginBottom: 4 }}>GuitarTuna</div>
          <div style={{ fontSize: 13, color: '#666' }}>Afinador recomendado para principiantes</div>
        </Card>
        <Btn variant="ghost" onClick={() => {}} fullWidth>
          Descargar App
        </Btn>
      </Card>
      <Card style={{ background: B.pinkLight }}>
        <p style={{ margin: 0, color: B.dark, lineHeight: 1.7, fontSize: 13 }}>
          Afinar también es aprender a escuchar. No te preocupes si al principio parece difícil: tu oído también irá despertando.
        </p>
      </Card>
      <Btn onClick={onBack} fullWidth>Volver a la ruta</Btn>
    </div>
  );
}
