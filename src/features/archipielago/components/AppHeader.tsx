import { useEffect, useRef, useState } from "react";
import { B } from "../data/brand";
import type { Screen } from "../types";
import { ONBOARDING_SCREENS } from "../data/screens";
import { ROUTE_STAGES } from "../data/islands";
import { useExperienceMode } from "../context/ExperienceModeContext";
import { useMvp1ProgressContext } from "../context/Mvp1ProgressContext";
import { getIslandProgress } from "../utils/islandProgress";
import type { IslandId } from "../data/mvp1Progress";

const SCREEN_TO_ISLAND: Partial<Record<Screen, IslandId>> = {
  'route': 'start-port',
  'mission': 'start-port',
  'mission-guide': 'start-port',
  'mission-two': 'start-port',
  'mission-three': 'start-port',
  'mission-four': 'start-port',
  'mission-six': 'start-port',
  'mission-seven': 'start-port',
  'mission-eight': 'start-port',
  'mission-nine': 'start-port',
  'celebration': 'start-port',
  'first-melodies-island': 'first-melodies',
  'first-melodies-lesson': 'first-melodies',
  'pulse-island': 'pulse',
  'pulse-lesson': 'pulse',
  'rhythm-island': 'rhythm',
  'rhythm-lesson': 'rhythm',
  'music-island': 'music',
  'music-lesson': 'music',
  'joy-island': 'joy',
  'joy-lesson': 'joy',
  'chords-island': 'chords',
  'chords-lesson': 'chords',
  'strumming-island': 'strumming',
  'strumming-lesson': 'strumming',
  'songs-island': 'songs',
  'songs-lesson': 'songs',
};

function UserMenu({
  onHome,
  onOpenGuide,
  onOpenProfile,
  onOpenHelp,
  onOpenPrivacy,
  tripLabel,
}: {
  onHome?: () => void;
  onOpenGuide?: () => void;
  onOpenProfile: () => void;
  onOpenHelp: () => void;
  onOpenPrivacy: () => void;
  tripLabel: string;
}) {
  const { signOutAndClear } = useExperienceMode();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items: Array<{ key: string; label: string; icon: string; onClick: () => void; disabled?: boolean }> = [
    { key: "trip", label: tripLabel, icon: "🧭", onClick: () => { setOpen(false); onHome?.(); }, disabled: !onHome },
    { key: "profile", label: "Mi perfil", icon: "👤", onClick: () => { setOpen(false); onOpenProfile(); } },
    { key: "guide", label: "Tu guía", icon: "📖", onClick: () => { setOpen(false); onOpenGuide?.(); }, disabled: !onOpenGuide },
    { key: "help", label: "Centro de ayuda", icon: "💬", onClick: () => { setOpen(false); onOpenHelp(); } },
    { key: "privacy", label: "Privacidad y seguridad", icon: "🔒", onClick: () => { setOpen(false); onOpenPrivacy(); } },
    { key: "signout", label: "Cerrar sesión", icon: "🚪", onClick: async () => { setOpen(false); await signOutAndClear(); } },
  ];

  return (
    <div ref={wrapRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Abrir menú"
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          border: `1px solid rgba(46,230,174,0.35)`,
          background: "#F5FBF8",
          color: B.greenDark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 248,
            background: "#FFFFFF",
            border: `1px solid ${B.grayBorder}`,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
            padding: 6,
            zIndex: 60,
          }}
        >
          {items.map(it => (
            <button
              key={it.key}
              role="menuitem"
              onClick={it.onClick}
              disabled={it.disabled}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                height: 44,
                padding: "0 12px",
                borderRadius: 10,
                border: "none",
                background: "transparent",
                color: B.dark,
                fontFamily: "Quicksand, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                textAlign: "left",
                cursor: it.disabled ? "not-allowed" : "pointer",
                opacity: it.disabled ? 0.4 : 1,
              }}
              onMouseEnter={e => { if (!it.disabled) e.currentTarget.style.background = "#F5FBF8"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }} aria-hidden="true">{it.icon}</span>
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppHeader({
  screen,
  onHome,
  onOpenGuide,
  onOpenProfile,
  onOpenHelp,
  onOpenPrivacy,
  studentName,
}: {
  screen: Screen;
  onHome?: () => void;
  onOpenGuide?: () => void;
  onOpenProfile: () => void;
  onOpenHelp: () => void;
  onOpenPrivacy: () => void;
  userName?: string;
  studentName?: string;
}) {
  const { mode } = useExperienceMode();
  const progress = useMvp1ProgressContext();
  const isAccompanied = mode === "accompanied_learning";
  const trimmedStudent = studentName?.trim();
  const tripLabel = isAccompanied && trimmedStudent ? `Viaje de ${trimmedStudent}` : "Mi viaje";
  const headerTripTitle = isAccompanied && trimmedStudent
    ? `Viaje de ${trimmedStudent}`
    : "Tu viaje musical";

  const isOnboarding = ONBOARDING_SCREENS.includes(screen);
  if (screen === 'onboarding' || screen === 'welcome' || screen === 'diagnosis' || screen === 'diagnosis-result') return null;

  const modernHeaderScreens: Screen[] = ['route', 'mission', 'mission-guide', 'mission-two', 'mission-three', 'mission-four', 'mission-six', 'mission-seven', 'mission-eight', 'mission-nine', 'celebration', 'first-melodies-island', 'first-melodies-lesson', 'pulse-island', 'pulse-lesson', 'rhythm-island', 'rhythm-lesson', 'music-island', 'music-lesson', 'joy-island', 'joy-lesson', 'chords-island', 'chords-lesson', 'strumming-island', 'strumming-lesson', 'songs-island', 'songs-lesson', 'my-profile', 'help-center', 'privacy'];
  if (modernHeaderScreens.includes(screen)) {
    const isMenuScreen = screen === 'my-profile' || screen === 'help-center' || screen === 'privacy';
    const islandId = SCREEN_TO_ISLAND[screen];
    const islandTitles: Record<IslandId, string> = {
      'start-port': 'Puerto de Inicio',
      'first-melodies': 'Isla de Primeras Melodías',
      'pulse': 'Isla del Pulso',
      'rhythm': 'Isla del Ritmo',
      'music': 'Isla Musical',
      'joy': 'Isla de la Alegría',
      'chords': 'Isla de los Acordes',
      'strumming': 'Isla del Rasgueo',
      'songs': 'Isla de las Canciones',
    };
    const pct = !isMenuScreen && islandId ? getIslandProgress(progress, islandId).pct : 0;
    const title = isMenuScreen
      ? (screen === 'my-profile' ? 'Mi perfil' : screen === 'help-center' ? 'Centro de ayuda' : 'Privacidad y seguridad')
      : islandId
      ? islandTitles[islandId]
      : '';
    const completionText = islandId === 'start-port' ? 'completado' : 'completada';
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
        position: 'relative',
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
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {headerTripTitle}
          </div>
          <div style={{ fontSize: 11.5, color: B.grayText, marginTop: 2, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
            {!isMenuScreen && !isIslandOverride && (
              <> · <span style={{ color: B.greenDark, fontWeight: 700 }}>{pct}% {completionText}</span></>
            )}
          </div>
          {!isMenuScreen && (
            <div style={{ marginTop: 6, height: 3, background: '#EAF6F0', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: B.green, borderRadius: 999, transition: 'width 0.4s ease' }} />
            </div>
          )}
        </div>
        <UserMenu
          onHome={onHome}
          onOpenGuide={onOpenGuide}
          onOpenProfile={onOpenProfile}
          onOpenHelp={onOpenHelp}
          onOpenPrivacy={onOpenPrivacy}
          tripLabel={tripLabel}
        />
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
