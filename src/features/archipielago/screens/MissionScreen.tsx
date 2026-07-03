import { B, PHOTOS } from "../data/brand";
import { EMOTIONS } from "../data/emotions";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { Tag } from "../components/Tag";
import { BackBtn } from "../components/BackBtn";

export function MissionScreen({ onBack, onComplete, emotion, setEmotion, userName }: {
  onBack: () => void;
  onComplete: () => void;
  emotion: string | null;
  setEmotion: (id: string) => void;
  userName: string;
}) {
  const firstName = userName.split(' ')[0];
  const canComplete = emotion !== null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Ruta Isla del Silencio" onClick={onBack} />

      {/* Mission title – solid green bar, no gradient */}
      <div style={{ background: B.green, borderRadius: 20, padding: '18px 22px' }}>
        <Tag color="pink">Misión activa · Nodo 5 de 8</Tag>
        <div style={{ marginTop: 10, marginBottom: 6, fontSize: 13, fontWeight: 700, color: B.dark, overflowWrap: 'anywhere' }}>
          {firstName}, hoy abriste tu primera puerta musical.
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(20px,4vw,26px)', margin: '10px 0 6px 0', color: B.dark }}>
          Toca tu primer DO
        </h2>
        <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.55 }}>
          Hoy no buscamos perfección. Buscamos abrir tu primera puerta musical.
        </p>
      </div>

      {/* Video placeholder */}
      <div style={{ position: 'relative', height: 210, borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
        <img src={PHOTOS.class} alt="Microclase DO" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(60,60,59,0.42)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(255,255,255,0.93)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, paddingLeft: 3, boxShadow: '0 4px 18px rgba(0,0,0,0.2)' }}>▶</div>
          <span style={{ color: B.white, fontWeight: 800, fontSize: 14, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>Microclase 3: DO desde cero</span>
        </div>
      </div>

      {/* Practice + message cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card style={{ background: B.greenLight, boxShadow: 'none', border: `1px solid ${B.green}`, padding: '16px' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>🎸</div>
          <strong style={{ display: 'block', marginBottom: 6, color: B.dark, fontSize: 14 }}>Práctica guiada</strong>
          <p style={{ margin: 0, lineHeight: 1.55, color: '#666', fontSize: 13 }}>
            Repite 5 veces. Respira. Coloca dedo 3. Haz sonar.
          </p>
        </Card>
        <Card style={{ background: B.pinkLight, boxShadow: 'none', border: `1px solid ${B.pink}`, padding: '16px' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>💬</div>
          <strong style={{ display: 'block', marginBottom: 6, color: B.dark, fontSize: 14 }}>Mensaje SoundKeleles</strong>
          <p style={{ margin: 0, lineHeight: 1.55, color: '#666', fontSize: 13 }}>
            No estás atrasado/a. Estás entrenando tu primer sonido.
          </p>
        </Card>
      </div>

      {/* Emotion check */}
      <Card>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16, color: B.dark, marginBottom: 14 }}>
          ¿Cómo te sentiste tocando hoy?
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EMOTIONS.map((e) => (
            <button
              key={e.id}
              onClick={() => setEmotion(e.id)}
              style={{
                border: `2px solid ${emotion === e.id ? B.pink : B.grayBorder}`,
                borderRadius: 999, padding: '8px 16px',
                background: emotion === e.id ? B.pinkLight : B.white,
                cursor: 'pointer', fontFamily: 'Quicksand, sans-serif',
                fontWeight: emotion === e.id ? 800 : 600, fontSize: 13, color: B.dark,
                transition: 'all 0.12s',
              }}
            >
              {e.label}
            </button>
          ))}
        </div>
      </Card>

      <Btn variant="pink" onClick={onComplete} fullWidth>¡Lo logré! Completar misión 🎵</Btn>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#bbb', margin: '-6px 0 0', fontStyle: 'italic' }}>
        Cada acorde es una pequeña victoria.
      </p>
    </div>
  );
}
