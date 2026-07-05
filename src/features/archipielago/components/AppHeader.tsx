import { useEffect, useRef, useState } from "react";
import { B } from "../data/brand";
import type { Screen } from "../types";
import { ONBOARDING_SCREENS } from "../data/screens";
import { ROUTE_STAGES } from "../data/islands";

type InfoModal = null | "settings" | "help" | "policies";

const INFO_CONTENT: Record<Exclude<InfoModal, null>, { title: string; body: string }> = {
  settings: {
    title: "Configuración",
    body: "Muy pronto podrás ajustar tus preferencias del viaje.",
  },
  help: {
    title: "Ayuda",
    body: 'Si te pierdes, vuelve a tu ruta o revisa "Tu guía". Pronto agregaremos más opciones de soporte.',
  },
  policies: {
    title: "Políticas",
    body: "Las políticas y términos estarán disponibles próximamente.",
  },
};

function UserMenu({
  userName,
  onHome,
  onOpenGuide,
}: {
  userName?: string;
  onHome?: () => void;
  onOpenGuide?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<InfoModal>(null);
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

  useEffect(() => {
    if (!infoModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInfoModal(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [infoModal]);

  const items: Array<{ key: string; label: string; icon: string; onClick: () => void; disabled?: boolean }> = [
    { key: "trip", label: "Mi viaje", icon: "👤", onClick: () => { setOpen(false); onHome?.(); }, disabled: !onHome },
    { key: "guide", label: "Tu guía", icon: "📖", onClick: () => { setOpen(false); onOpenGuide?.(); }, disabled: !onOpenGuide },
    { key: "settings", label: "Configuración", icon: "⚙️", onClick: () => { setOpen(false); setInfoModal("settings"); } },
    { key: "help", label: "Ayuda", icon: "❔", onClick: () => { setOpen(false); setInfoModal("help"); } },
    { key: "policies", label: "Políticas", icon: "🛡️", onClick: () => { setOpen(false); setInfoModal("policies"); } },
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
            width: 232,
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

      {infoModal && (
        <div
          onClick={() => setInfoModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(60,60,59,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              padding: 24,
              maxWidth: 360,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 18, color: B.dark, marginBottom: 10 }}>
              {INFO_CONTENT[infoModal].title}
            </div>
            <div style={{ fontSize: 14, color: B.grayText, lineHeight: 1.5, marginBottom: 20 }}>
              {INFO_CONTENT[infoModal].body}
            </div>
            <button
              onClick={() => setInfoModal(null)}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 999,
                border: "none",
                background: B.green,
                color: B.dark,
                fontFamily: "Quicksand, sans-serif",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppHeader({
  screen,
  onHome,
  onOpenGuide,
  userName,
}: {
  screen: Screen;
  onHome?: () => void;
  onOpenGuide?: () => void;
  userName?: string;
}) {
  const isOnboarding = ONBOARDING_SCREENS.includes(screen);
  if (screen === 'onboarding' || screen === 'welcome' || screen === 'diagnosis' || screen === 'diagnosis-result') return null;

  const modernHeaderScreens: Screen[] = ['route', 'mission', 'mission-guide', 'mission-two', 'mission-three', 'mission-four', 'celebration', 'first-melodies-island', 'first-melodies-lesson', 'pulse-island', 'pulse-lesson', 'rhythm-island', 'rhythm-lesson', 'music-island', 'music-lesson', 'joy-island', 'joy-lesson', 'chords-island', 'strumming-island', 'songs-island'];
  if (modernHeaderScreens.includes(screen)) {
    const isFirstMelodies = screen === 'first-melodies-island' || screen === 'first-melodies-lesson';
    const isPulse = screen === 'pulse-island' || screen === 'pulse-lesson';
    const isRhythm = screen === 'rhythm-island' || screen === 'rhythm-lesson';
    const isMusic = screen === 'music-island' || screen === 'music-lesson';
    const isJoy = screen === 'joy-island' || screen === 'joy-lesson';
    const isChords = screen === 'chords-island';
    const isStrumming = screen === 'strumming-island';
    const isSongs = screen === 'songs-island';
    const isIslandOverride = isFirstMelodies || isPulse || isRhythm || isMusic || isJoy || isChords || isStrumming || isSongs;
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
      : isJoy
      ? 'Isla de la Alegría'
      : isChords
      ? 'Isla de los Acordes'
      : isStrumming
      ? 'Isla del Rasgueo'
      : isSongs
      ? 'Isla de las Canciones'
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
            Tu viaje musical
          </div>
          <div style={{ fontSize: 11.5, color: B.grayText, marginTop: 2, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title} · <span style={{ color: B.greenDark, fontWeight: 700 }}>{pct}% {completionText}</span>
          </div>
          <div style={{ marginTop: 6, height: 3, background: '#EAF6F0', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: B.green, borderRadius: 999, transition: 'width 0.4s ease' }} />
          </div>
        </div>
        <UserMenu userName={userName} onHome={onHome} onOpenGuide={onOpenGuide} />
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
