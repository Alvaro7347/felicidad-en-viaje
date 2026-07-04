import { B, PHOTOS } from "../data/brand";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";

export function MissionSevenScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Toma tu ukelele sin tensión"
        subtitle="Antes de tocar, tu cuerpo también necesita sentirse cómodo."
      />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 210 }}>
          <img src={PHOTOS.class} alt="Video de la misión" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(60,60,59,0.42)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(255,255,255,0.93)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, paddingLeft: 3, boxShadow: '0 4px 18px rgba(0,0,0,0.2)' }}>▶</div>
            <span style={{ color: B.white, fontWeight: 800, fontSize: 14, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>Microclase · 4 min</span>
            <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: 12, lineHeight: 1.5, maxWidth: 400 }}>
              Cómo tomar tu ukelele sin tensión
            </span>
          </div>
        </div>
      </Card>
      <Card>
        <p style={{ margin: 0, color: '#666', lineHeight: 1.7, fontSize: 13 }}>
          En este video aprenderás cómo sostener el ukelele, cómo relajar tus hombros y cómo preparar tus manos para tocar sin incomodidad.
        </p>
      </Card>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          Qué aprenderás
        </div>
        <div style={{ display: 'grid', gap: 10, fontSize: 13, lineHeight: 1.6, color: '#666' }}>
          <div>• Cómo apoyar el ukelele de forma cómoda.</div>
          <div>• Cómo evitar tensión en hombros y brazos.</div>
          <div>• Cómo prepararte para tocar tu primer sonido.</div>
        </div>
      </Card>
      <Card style={{ background: B.pinkLight }}>
        <p style={{ margin: 0, color: B.dark, lineHeight: 1.7, fontSize: 13 }}>
          No necesitas apretar fuerte. Tu cuerpo también está aprendiendo a hacer música.
        </p>
      </Card>
    </div>
  );
}
