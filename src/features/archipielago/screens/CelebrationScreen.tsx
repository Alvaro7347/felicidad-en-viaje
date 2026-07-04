import { B, PHOTOS } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { Tag } from "../components/Tag";
import { MusicalFuelReminder } from "../components/MusicalFuelReminder";
import { getMusicalFuel } from "../data/musicalFuel";

export function CelebrationScreen({ onHome }: { onHome: () => void }) {
  const fuel = getMusicalFuel();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Achievement header – solid green, not gradient */}
      <div style={{ background: B.green, borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🌊</div>
        <h2 style={{
          fontFamily: 'Space Grotesk, Arial Black, sans-serif',
          fontSize: 'clamp(22px, 4vw, 30px)',
          fontWeight: 800, color: B.dark, margin: '0 0 8px 0', lineHeight: 1.2,
        }}>
          ¡Abriste tu primera puerta musical!
        </h2>
        <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.55 }}>
          Hoy tocaste DO. No es solo un acorde: es evidencia de que puedes comenzar.
        </p>
      </div>

      {/* Badge unlock */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: '#FFF5E0',
          border: '2px solid #F5B800', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 32, flexShrink: 0,
        }}>🏅</div>
        <div>
          <Tag color="green">Sello desbloqueado</Tag>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: B.dark, margin: '6px 0 3px 0' }}>
            Guardián del Silencio
          </div>
          <div style={{ fontSize: 13, color: B.grayText }}>Completaste la Isla del Silencio</div>
        </div>
      </Card>

      {/* Phrase */}
      <Card style={{ background: B.pinkLight, border: `1px solid ${B.pink}`, textAlign: 'center', padding: '18px 20px' }}>
        <p style={{ margin: 0, fontSize: 15, color: B.dark, lineHeight: 1.65, fontStyle: 'italic' }}>
          "Cada acorde es una pequeña victoria."
        </p>
        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 800, color: B.pink, letterSpacing: '0.5px' }}>
          — SoundKeleles
        </div>
      </Card>
      {fuel.fuelPhrase && <MusicalFuelReminder variant="celebration" fuel={fuel} />}


      {/* Next island preview */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.7 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
          <img src={PHOTOS.workshop} alt="Isla del Pulso" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: B.grayText, letterSpacing: '1px', textTransform: 'uppercase' }}>Próxima isla</div>
          <div style={{ fontWeight: 800, fontSize: 15, color: B.dark }}>Isla del Pulso</div>
          <div style={{ fontSize: 12, color: B.grayText }}>Desbloqueada al completar este sello</div>
        </div>
        <span style={{ fontSize: 18 }}>🔒</span>
      </Card>

      <Btn onClick={onHome} fullWidth>Volver al Archipiélago 🗺</Btn>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

// ─── Dev-only screen jump panel ───────────────────────────────────────────────
