import { B } from "../data/brand";
import type { Screen } from "../types";
import { ONBOARDING_SCREENS } from "../data/screens";
import { ROUTE_STAGES } from "../data/islands";

export function AppHeader({ screen, onHome }: { screen: Screen; onHome?: () => void }) {
  const isOnboarding = ONBOARDING_SCREENS.includes(screen);
  if (screen === 'onboarding' || screen === 'welcome' || screen === 'diagnosis' || screen === 'diagnosis-result') return null;

  const modernHeaderScreens: Screen[] = ['route', 'mission', 'mission-guide', 'mission-two', 'mission-three', 'mission-four', 'celebration', 'first-melodies-island', 'first-melodies-lesson', 'pulse-island', 'pulse-lesson', 'rhythm-island', 'rhythm-lesson', 'music-island', 'music-lesson'];
  if (modernHeaderScreens.includes(screen)) {
    const isFirstMelodies = screen === 'first-melodies-island' || screen === 'first-melodies-lesson';
    const isPulse = screen === 'pulse-island' || screen === 'pulse-lesson';
    const isRhythm = screen === 'rhythm-island' || screen === 'rhythm-lesson';
    const isMusic = screen === 'music-island' || screen === 'music-lesson';
    const isIslandOverride = isFirstMelodies || isPulse || isRhythm || isMusic;
    const active = ROUTE_STAGES.find(s => s.status === 'active') ?? ROUTE_STAGES[0];
    const pct = isIslandOverride ? 0 : active.progress;
    const title = isFirstMelodies
      ? 'Isla de Primeras Melodías'
      : isPulse
      ? 'Isla del Pulso'
      : isRhythm
      ? 'Isla del Ritmo'
      : isMusic
      ? 'Isla Musical'
      : active.title;
    const completionText = isIslandOverride ? 'completado' : active.completionText;
    return (
      <header style={{
        background: '#FFFFFF',
        border: `1px solid ${B.grayBorder}`,
        borderRadius: 18,
        padding: '9px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
        boxShadow: '0 2px 10px rgba(46,230,174,0.06)',
      }}>
        <button
          onClick={onHome}
          aria-label="Inicio"
          style={{
            border: '1px solid rgba(46,230,174,0.18)',
            background: '#F5FBF8',
            cursor: onHome ? 'pointer' : 'default',
            padding: 0,
            width: 50,
            height: 50,
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <img src="/isologo-soundkeleles.jpg" alt="SoundKeleles" style={{ width: 42, height: 42, borderRadius: 999, objectFit: 'contain', display: 'block' }} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 800,
            fontSize: 16,
            color: B.dark,
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
          }}>
            Tu viaje musical
          </div>
          <div style={{ fontSize: 11.5, color: B.grayText, marginTop: 2, lineHeight: 1.3 }}>
            {title} · <span style={{ color: B.greenDark, fontWeight: 700 }}>{pct}% {completionText}</span>
          </div>
          <div style={{ marginTop: 6, height: 3, background: '#EAF6F0', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: B.green, borderRadius: 999, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header style={{
      background: B.green,
      borderRadius: 18,
      padding: '4px 18px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    }}>
      <button onClick={onHome} style={{ border: 'none', background: 'transparent', cursor: onHome ? 'pointer' : 'default', padding: 0 }}>
        <img src="/logo-soundkeleles-nobg.png" alt="SoundKeleles" style={{ height: 72, width: 'auto', display: 'block' }} />
      </button>
      {isOnboarding && (
        <div style={{ fontSize: 12, fontWeight: 700, color: B.dark, opacity: 0.7 }}>
          Diagnóstico musical inicial
        </div>
      )}
    </header>
  );
}
