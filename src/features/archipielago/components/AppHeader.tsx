import { B } from "../data/brand";
import type { Screen } from "../types";
import { ONBOARDING_SCREENS } from "../data/screens";

export function AppHeader({ screen, onHome }: { screen: Screen; onHome?: () => void }) {
  const isOnboarding = ONBOARDING_SCREENS.includes(screen);
  if (screen === 'onboarding' || screen === 'welcome' || screen === 'diagnosis' || screen === 'diagnosis-result') return null;
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

