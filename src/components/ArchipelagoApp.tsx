import { useState, useMemo, useEffect } from "react";


// ─── Brand ────────────────────────────────────────────────────────────────────

const B = {
  green: '#2EE6AE',
  greenDark: '#1CC48E',
  greenLight: '#E9FFF7',
  pink: '#EF57A1',
  pinkLight: '#FFF0F7',
  dark: '#3C3C3B',
  gray: '#F5F5F3',
  grayBorder: '#E8E8E6',
  grayText: '#9A9A98',
  white: '#FFFFFF',
};

const PHOTOS = {
  hero: '/photos/hero.jpg',
  workshop: '/photos/workshop.jpg',
  family: '/photos/family.jpg',
  class: '/photos/class.jpg',
  teacher: '/photos/teacher.jpg',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROUTES = [
  {
    id: 'quise',
    emoji: '🌱',
    title: 'Siempre quise aprender, pero creí que no podía',
    subtitle: 'Una ruta para volver a creer que la música también es para ti.',
  },
  {
    id: 'familia',
    emoji: '🏡',
    title: 'Quiero tocar para compartir con mi familia',
    subtitle: 'Canciones simples para crear momentos lindos con quienes amas.',
  },
  {
    id: 'regalo',
    emoji: '✨',
    title: 'Quiero regalarme un momento de felicidad',
    subtitle: 'Tocar para ti. Sin presión. Solo por el placer de sonar.',
  },
];

type NodeStatus = 'done' | 'current' | 'locked' | 'achievement';

interface RouteNode {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  status: NodeStatus;
  time?: string;
  type?: string;
}

const SILENCE_NODES: RouteNode[] = [
  { id: 'n1', title: 'Conoce a tu guía', subtitle: 'Una bienvenida de SoundKeleles', icon: '👋', status: 'done', type: 'Video', time: '2 min' },
  { id: 'n2', title: 'Conoce el Archipiélago', subtitle: 'Descubre cómo funciona este viaje musical.', icon: '📝', status: 'done', type: 'Historia interactiva', time: '3 min' },
  { id: 'n3', title: 'Toma tu ukelele sin tensión', subtitle: 'Postura, agarre y respiración', icon: '🎸', status: 'done', type: 'Microclase', time: '4 min' },
  { id: 'n4', title: 'Afina tu primer sonido', subtitle: 'Aprende a usar el afinador', icon: '🎵', status: 'done', type: 'Práctica', time: '5 min' },
  { id: 'n5', title: 'Toca tu primer DO', subtitle: 'Hoy abrís tu primera puerta musical', icon: '🎶', status: 'current', type: 'Misión', time: '3 min' },
  { id: 'n6', title: 'Sube tu evidencia', subtitle: 'Un audio o video de tu acorde', icon: '📤', status: 'locked', type: 'Logro', time: '2 min' },
  { id: 'n7', title: '¿Cómo te sentiste?', subtitle: 'Registra tu emoción del día', icon: '💬', status: 'locked', type: 'Check-in', time: '1 min' },
  { id: 'n8', title: 'Sello desbloqueado', subtitle: 'Guardián del Silencio', icon: '🏅', status: 'achievement', time: '' },
];

const ISLANDS = [
  {
    id: 'silencio',
    title: 'Isla del Silencio',
    subtitle: 'Tu punto de partida',
    status: 'active' as const,
    progress: 50,
    photo: PHOTOS.class,
    nextVictory: 'Toca tu primer DO',
    emotion: '🔥 Motivado/a',
    skill: 'Prepararte, conocer tu ukelele y tocar tu primer acorde.',
  },
  {
    id: 'pulso',
    title: 'Isla del Pulso',
    subtitle: 'Acordes en movimiento',
    status: 'locked' as const,
    progress: 0,
    photo: PHOTOS.workshop,
    nextVictory: '',
    emotion: '',
    skill: 'Cambiar acordes y mantener un pulso simple.',
  },
  {
    id: 'ritmo',
    title: 'Isla del Ritmo',
    subtitle: 'Coordinación y rasgueo',
    status: 'locked' as const,
    progress: 0,
    photo: PHOTOS.family,
    nextVictory: '',
    emotion: '',
    skill: 'Coordinar ambas manos y tocar tu primer rasgueo.',
  },
];

const EMOTIONS = [
  { id: 'feliz', label: '😊 Feliz' },
  { id: 'tranquilo', label: '😌 Tranquilo/a' },
  { id: 'motivado', label: '🔥 Motivado/a' },
  { id: 'frustrado', label: '😤 Frustrado/a' },
  { id: 'cansado', label: '😴 Cansado/a' },
];

type Screen = 'welcome' | 'onboarding' | 'diagnosis' | 'diagnosis-result' | 'entry-moment' | 'route' | 'mission' | 'mission-guide' | 'mission-two' | 'mission-three' | 'mission-four' | 'celebration';

// ─── Diagnosis Data ────────────────────────────────────────────────────────────

interface DiagQuestion {
  id: number;
  question: string;
  subtitle?: string;
  options: string[];
  multi?: boolean;
}

const DIAG_QUESTIONS: DiagQuestion[] = [
  {
    id: 1,
    question: '¿Qué frase se parece más a tu historia con la música?',
    options: [
      'Siempre quise aprender, pero me frustré antes',
      'Nunca he tocado un instrumento',
      'Intenté guitarra, pero sentí que no pude',
      'Me da vergüenza equivocarme',
    ],
  },
  {
    id: 2,
    question: '¿Por qué quieres aprender a tocar ukelele?',
    subtitle: 'Tu motivo importa más de lo que crees.',
    options: [
      'Porque siempre soñé con tocar música',
      'Porque quiero demostrarme que sí puedo',
      'Porque quiero un momento de felicidad para mí',
      'Porque quiero compartir música con alguien',
      'Porque necesito reconectar conmigo',
    ],
  },
  {
    id: 3,
    question: '¿Qué emoción aparece cuando piensas en aprender música?',
    options: ['Ilusión ✨', 'Frustración 😤', 'Vergüenza 😳', 'Curiosidad 🔍', 'Miedo 😨', 'Felicidad 😊'],
  },
  {
    id: 4,
    question: '¿En cuánto tiempo te gustaría tocar tu primera canción?',
    subtitle: 'No hay respuesta incorrecta — solo tu ritmo.',
    options: [
      'Esta semana',
      'En dos semanas',
      'En un mes',
      'A mi propio ritmo',
      'No quiero apurarme',
    ],
  },
  {
    id: 5,
    question: '¿Qué necesitarías de esta app para no abandonar?',
    subtitle: 'Puedes elegir más de una.',
    options: [
      'Explicaciones simples',
      'Que me anime cuando me frustre',
      'Avanzar paso a paso',
      'Sentir que alguien me acompaña',
      'Practicar pocos minutos al día',
    ],
    multi: true,
  },
  {
    id: 6,
    question: '¿Cuánto tiempo real puedes practicar al día?',
    options: ['5 minutos', '10 minutos', '15 minutos', '20 minutos o más', 'No lo sé todavía'],
  },
];

type DiagAnswers = Record<number, string | string[]>;

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Btn({
  children,
  variant = 'primary',
  onClick,
  fullWidth = false,
  size = 'md',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'pink' | 'ghost' | 'dark';
  onClick?: () => void;
  fullWidth?: boolean;
  size?: 'sm' | 'md';
}) {
  const pad = size === 'sm' ? '9px 18px' : '13px 28px';
  const fs = size === 'sm' ? 14 : 16;
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'Quicksand, sans-serif', fontWeight: 800, fontSize: fs,
    borderRadius: 999, padding: pad, cursor: 'pointer', border: 'none',
    transition: 'transform 0.12s, opacity 0.12s',
    width: fullWidth ? '100%' : 'auto',
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: B.green, color: B.dark, boxShadow: '0 4px 14px rgba(46,230,174,0.35)' },
    pink: { background: B.pink, color: B.white, boxShadow: '0 4px 14px rgba(239,87,161,0.3)' },
    ghost: { background: 'transparent', color: B.pink, border: `2px solid ${B.pink}` },
    dark: { background: B.dark, color: B.white },
  };
  return (
    <button
      style={{ ...base, ...variants[variant] }}
      onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {children}
    </button>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: B.white, borderRadius: 24, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: `1px solid ${B.grayBorder}`, ...style }}>
      {children}
    </div>
  );
}

function Tag({ children, color = 'green' }: { children: React.ReactNode; color?: 'green' | 'pink' | 'gray' }) {
  const map = {
    green: { bg: B.greenLight, text: B.greenDark },
    pink: { bg: B.pinkLight, text: B.pink },
    gray: { bg: B.gray, text: B.grayText },
  };
  return (
    <span style={{
      display: 'inline-block', background: map[color].bg, color: map[color].text,
      fontWeight: 800, fontSize: 11, borderRadius: 999, padding: '4px 11px', letterSpacing: '0.5px',
    }}>
      {children}
    </span>
  );
}

function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      border: 'none', background: 'transparent', color: B.pink, fontWeight: 800,
      cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontSize: 14,
      padding: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: 5,
    }}>
      ← {label}
    </button>
  );
}

// ─── App Header (solid calypso bar) ──────────────────────────────────────────

const ONBOARDING_SCREENS: Screen[] = ['welcome', 'onboarding', 'diagnosis', 'diagnosis-result', 'entry-moment'];

function AppHeader({ screen, onHome }: { screen: Screen; onHome?: () => void }) {
  const isOnboarding = ONBOARDING_SCREENS.includes(screen);
  if (screen === 'onboarding' || screen === 'welcome') return null;
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
        <div style={{
          fontSize: 12,
          fontWeight: screen === 'entry-moment' ? 500 : 700,
          color: B.dark,
          opacity: screen === 'entry-moment' ? 0.55 : 0.7,
          letterSpacing: screen === 'entry-moment' ? '0.01em' : 'normal',
        }}>
          {screen === 'entry-moment' ? 'Tu viaje musical' : 'Diagnóstico musical inicial'}
        </div>
      )}
    </header>
  );
}

// ─── Screen: Welcome ──────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [hovBtn1, setHovBtn1] = useState(false);
  const [pressBtn1, setPressBtn1] = useState(false);
  const [hovBtn2, setHovBtn2] = useState(false);
  const [pressBtn2, setPressBtn2] = useState(false);

  return (
    <>
      <style>{`
        @keyframes sk-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes sk-welcome-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        background: B.white,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'sk-welcome-in 0.5s ease forwards',
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        overflowY: 'auto',
        padding: '0 28px',
        boxSizing: 'border-box',
      }}>

        {/* ── Logo + copy — ocupa todo el espacio disponible, centrado ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          paddingTop: 48,
          paddingBottom: 16,
          width: '100%',
        }}>
          <img
            src="/logo-calipso.png"
            alt="SoundKeleles"
            style={{
              width: 'min(220px, 58vw)',
              display: 'block',
              animation: 'sk-float 3.6s ease-in-out infinite',
            }}
          />

          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(28px, 7vw, 40px)',
              fontWeight: 800,
              color: B.dark,
              margin: '0 0 12px 0',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}>
              Toca la felicidad
            </h1>
            <p style={{
              fontSize: 15,
              color: B.grayText,
              margin: 0,
              lineHeight: 1.65,
              maxWidth: 280,
            }}>
              Aprender música puede sentirse simple,<br />humano y emocionante.
            </p>
          </div>
        </div>

        {/* ── Botones — anclados al fondo, siempre visibles ── */}
        <div style={{
          width: '100%',
          maxWidth: 380,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          paddingBottom: 52,
          flexShrink: 0,
        }}>

          {/* Botón principal */}
          <div
            onMouseEnter={() => setHovBtn1(true)}
            onMouseLeave={() => { setHovBtn1(false); setPressBtn1(false); }}
            onMouseDown={() => setPressBtn1(true)}
            onMouseUp={() => setPressBtn1(false)}
            onTouchStart={() => setPressBtn1(true)}
            onTouchEnd={() => { setPressBtn1(false); onStart(); }}
            onTouchCancel={() => setPressBtn1(false)}
            onClick={onStart}
            style={{
              background: B.green,
              borderRadius: 18,
              padding: '17px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 17,
              color: B.dark,
              boxShadow: pressBtn1
                ? '0 2px 8px rgba(46,230,174,0.2)'
                : hovBtn1
                ? '0 8px 28px rgba(46,230,174,0.45)'
                : '0 4px 18px rgba(46,230,174,0.32)',
              transform: pressBtn1 ? 'scale(0.98)' : hovBtn1 ? 'scale(1.02)' : 'scale(1)',
              transition: 'transform 0.16s ease, box-shadow 0.16s ease',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            No tengo cuenta
          </div>

          {/* Botón secundario — visible, deshabilitado elegantemente */}
          <div
            onMouseEnter={() => setHovBtn2(true)}
            onMouseLeave={() => { setHovBtn2(false); setPressBtn2(false); }}
            onMouseDown={() => setPressBtn2(true)}
            onMouseUp={() => setPressBtn2(false)}
            onTouchStart={() => setPressBtn2(true)}
            onTouchEnd={() => setPressBtn2(false)}
            onTouchCancel={() => setPressBtn2(false)}
            style={{
              background: B.white,
              border: `1.5px solid ${B.green}`,
              borderRadius: 18,
              padding: '16px 24px',
              textAlign: 'center',
              cursor: 'default',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: B.greenDark,
              opacity: 0.55,
              transform: pressBtn2 ? 'scale(0.99)' : 'scale(1)',
              transition: 'transform 0.16s ease',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            Ya tengo cuenta
          </div>
        </div>

      </div>
    </>
  );
}

// ─── Screen: Splash ───────────────────────────────────────────────────────────

function SplashScreen({ fading }: { fading: boolean }) {
  return (
    <>
      <style>{`
        @keyframes sk-breathe {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 4px rgba(255,255,255,0.1));
          }
          50% {
            transform: scale(1.08);
            filter: drop-shadow(0 0 36px rgba(255,255,255,0.55));
          }
        }
        @keyframes sk-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#2EE6AE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'sk-fadein 0.35s ease forwards',
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.5s ease' : 'none',
        pointerEvents: 'none',
      }}>
        <img
          src="/logo-soundkeleles-nobg.png"
          alt="SoundKeleles"
          style={{
            width: 'min(240px, 60vw)',
            display: 'block',
            animation: 'sk-breathe 2.8s ease-in-out infinite',
          }}
        />
      </div>
    </>
  );
}

// ─── Screen: Onboarding ───────────────────────────────────────────────────────

function OnboardingScreen({ onStart }: { onStart: () => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pressedId, setPressedId] = useState<string | null>(null);

  const routeCards = [
    {
      id: 'quise',
      icon: '🌱',
      shortTitle: 'Quiero empezar',
      desc: 'Nunca he podido aprender, pero esta vez es diferente.',
      tag: 'Una ruta para ti, paso a paso.',
      active: true,
    },
    {
      id: 'familia',
      icon: '🏡',
      shortTitle: 'Quiero acompañar',
      desc: 'Para ayudar a mi familia a descubrir su música.',
      tag: null,
      active: false,
    },
    {
      id: 'regalo',
      icon: '🎸',
      shortTitle: 'Ya tengo experiencia',
      desc: 'Quiero seguir creciendo y tocar más.',
      tag: null,
      active: false,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 8 }}>

      {/* ── Hero: island + title ── */}
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 999,
          background: B.greenLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, margin: '0 auto 20px',
          boxShadow: `0 0 0 8px rgba(46,230,174,0.1)`,
        }}>
          🏝
        </div>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(22px, 5vw, 28px)',
          fontWeight: 800, color: B.dark,
          margin: '0 0 10px 0', lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          ¿Cómo quieres comenzar<br />
          tu <span style={{ color: B.green }}>viaje musical</span>?
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 18, color: B.green, letterSpacing: 4 }}>〰</span>
        </div>
        <p style={{ fontSize: 13, color: '#999', margin: 0, lineHeight: 1.6 }}>
          Cada ruta está diseñada<br />para acompañarte en tu momento actual.
        </p>
      </div>

      {/* ── Route cards — 3-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {routeCards.map((r) => {
          const isHovered = hoveredId === r.id;
          const isPressed = pressedId === r.id;

          const scale = isPressed
            ? (r.active ? 'scale(0.97)' : 'scale(0.98)')
            : isHovered
            ? (r.active ? 'scale(1.03)' : 'scale(1.015)')
            : 'scale(1)';

          const shadow = isPressed
            ? (r.active ? '0 2px 8px rgba(46,230,174,0.12)' : '0 1px 4px rgba(0,0,0,0.04)')
            : isHovered
            ? (r.active ? '0 8px 28px rgba(46,230,174,0.28)' : '0 4px 14px rgba(0,0,0,0.09)')
            : (r.active ? '0 4px 20px rgba(46,230,174,0.18)' : '0 2px 8px rgba(0,0,0,0.04)');

          return (
            <div
              key={r.id}
              onMouseEnter={() => setHoveredId(r.id)}
              onMouseLeave={() => { setHoveredId(null); setPressedId(null); }}
              onMouseDown={() => setPressedId(r.id)}
              onMouseUp={() => setPressedId(null)}
              onTouchStart={() => setPressedId(r.id)}
              onTouchEnd={() => setPressedId(null)}
              onTouchCancel={() => setPressedId(null)}
              style={{
                background: B.white,
                border: r.active ? `2px solid ${B.green}` : `1.5px solid #ebebeb`,
                borderRadius: 20,
                padding: '14px 10px 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: shadow,
                transform: scale,
                transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease',
                opacity: r.active ? 1 : 0.72,
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              {/* Top-right badge */}
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                {r.active
                  ? <div style={{
                      width: 20, height: 20, borderRadius: 999,
                      background: B.green, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: B.dark, fontWeight: 900,
                      transition: 'transform 0.18s ease',
                      transform: isPressed ? 'scale(0.9)' : isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}>✓</div>
                  : <div style={{
                      width: 18, height: 18, borderRadius: 999,
                      background: '#eee', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#aaa',
                    }}>🔒</div>
                }
              </div>

              {/* Icon circle */}
              <div style={{
                width: 56, height: 56, borderRadius: 999,
                background: r.active ? B.greenLight : '#f4f4f4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, marginBottom: 10,
                boxShadow: r.active
                  ? (isHovered ? `0 0 0 7px rgba(46,230,174,0.18)` : `0 0 0 5px rgba(46,230,174,0.12)`)
                  : 'none',
                filter: r.active ? 'none' : 'grayscale(0.3)',
                transition: 'box-shadow 0.2s ease',
              }}>
                {r.icon}
              </div>

              {/* Title */}
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 800, fontSize: 12,
                color: r.active ? B.dark : '#888',
                textAlign: 'center', lineHeight: 1.25,
                marginBottom: 6,
              }}>
                {r.shortTitle}
              </div>

              {/* Description */}
              <div style={{
                fontSize: 10, color: r.active ? '#777' : '#bbb',
                textAlign: 'center', lineHeight: 1.45,
                marginBottom: r.active ? 10 : 8,
              }}>
                {r.desc}
              </div>

              {/* Tag or pill */}
              {r.active && r.tag && (
                <div style={{
                  fontSize: 10, color: B.greenDark,
                  fontWeight: 800, textAlign: 'center',
                  lineHeight: 1.4,
                }}>
                  🌿 {r.tag}
                </div>
              )}
              {!r.active && (
                <div style={{
                  fontSize: 10, color: '#bbb', fontWeight: 700,
                  background: '#f2f2f2', borderRadius: 999,
                  padding: '3px 10px', whiteSpace: 'nowrap',
                }}>
                  Próximamente
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── CTA ── */}
      <div>
        <Btn onClick={onStart} fullWidth>Comenzar mi viaje 🚀</Btn>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#ccc', margin: '10px 0 0 0', fontStyle: 'italic' }}>
          Cada acorde es una pequeña victoria.
        </p>
      </div>

    </div>
  );
}

// ─── Screen: Diagnóstico musical inicial ─────────────────────────────────────

function DiagnosisScreen({ onComplete }: { onComplete: (answers: DiagAnswers, name: string) => void }) {
  // step -1 = name input; steps 0..N-1 = questions
  const [step, setStep] = useState(-1);
  const [nameInput, setNameInput] = useState('');
  const [answers, setAnswers] = useState<DiagAnswers>({});
  const [multiSel, setMultiSel] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  const totalSteps = DIAG_QUESTIONS.length;
  // step -1 = 0%, step 0 = first question, etc.
  const progressPct = step < 0 ? 0 : Math.round(((step + 1) / totalSteps) * 100);

  const progressLabel =
    step < 0 ? 'Cuéntanos quién eres…'
    : progressPct < 100 ? `Perfil musical: ${progressPct}%`
    : 'Perfil musical completo ✓';

  const q = step >= 0 ? DIAG_QUESTIONS[step] : null;
  const isMulti = q?.multi ?? false;
  const chosen = q ? answers[q.id] : undefined;

  function advance(newAnswers: DiagAnswers) {
    setAnimating(true);
    setTimeout(() => {
      setMultiSel([]);
      if (step < totalSteps - 1) {
        setStep(step + 1);
      } else {
        onComplete(newAnswers, nameInput.trim() || 'Navegante');
      }
      setAnimating(false);
    }, 280);
  }

  function handleSingleSelect(opt: string) {
    const newAnswers = { ...answers, [q!.id]: opt };
    setAnswers(newAnswers);
    advance(newAnswers);
  }

  function toggleMulti(opt: string) {
    setMultiSel(prev =>
      prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]
    );
  }

  function confirmMulti() {
    if (multiSel.length === 0) return;
    const newAnswers = { ...answers, [q!.id]: multiSel };
    setAnswers(newAnswers);
    advance(newAnswers);
  }

  function handleNameContinue() {
    if (!nameInput.trim()) return;
    setAnimating(true);
    setTimeout(() => { setStep(0); setAnimating(false); }, 260);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, opacity: animating ? 0 : 1, transition: 'opacity 0.28s ease' }}>

      {/* ── Progress header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Big percentage badge + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999, flexShrink: 0,
            background: progressPct === 100 ? B.green : B.dark,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
            transition: 'background 0.4s',
          }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 14, color: progressPct === 100 ? B.dark : B.green, lineHeight: 1 }}>
              {progressPct}%
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: B.dark, marginBottom: 4 }}>{progressLabel}</div>
            <div style={{ height: 10, background: B.grayBorder, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                width: `${progressPct}%`, height: '100%',
                background: `linear-gradient(to right, ${B.greenDark}, ${B.green})`,
                borderRadius: 999,
                transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: progressPct > 0 ? `0 0 8px rgba(46,230,174,0.45)` : 'none',
              }} />
            </div>
          </div>
        </div>

        {/* Step pills */}
        {step >= 0 && (
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            {DIAG_QUESTIONS.map((_, i) => (
              <div key={i} style={{
                height: 6, borderRadius: 999,
                width: i === step ? 24 : 8,
                background: i < step ? B.greenDark : i === step ? B.green : B.grayBorder,
                transition: 'all 0.35s ease',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Step –1: Name input ── */}
      {step < 0 && (
        <Card>
          <div style={{ fontSize: 22, marginBottom: 14, textAlign: 'center' }}>👋</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: B.pink, marginBottom: 8, letterSpacing: '0.5px', textAlign: 'center' }}>
            Diagnóstico musical inicial
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
            fontSize: 'clamp(18px, 3.5vw, 22px)', color: B.dark,
            margin: '0 0 6px 0', lineHeight: 1.3, textAlign: 'center',
          }}>
            Antes de enseñarte,<br />queremos conocerte.
          </h2>
          <p style={{ fontSize: 14, color: '#888', textAlign: 'center', margin: '0 0 22px 0', lineHeight: 1.6 }}>
            ¿Cómo te llamás?
          </p>
          <input
            type="text"
            placeholder="Tu nombre…"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleNameContinue()}
            autoFocus
            style={{
              width: '100%', boxSizing: 'border-box',
              border: `2px solid ${nameInput.trim() ? B.green : B.grayBorder}`,
              borderRadius: 14, padding: '14px 18px',
              fontFamily: 'Quicksand, sans-serif', fontSize: 16, fontWeight: 700,
              color: B.dark, outline: 'none', marginBottom: 16,
              transition: 'border-color 0.2s',
              background: nameInput.trim() ? B.greenLight : B.white,
            }}
          />
          <Btn
            onClick={handleNameContinue}
            fullWidth
            variant={nameInput.trim() ? 'primary' : 'ghost'}
          >
            Comenzar mi diagnóstico →
          </Btn>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#ccc', margin: '12px 0 0', fontStyle: 'italic' }}>
            Esta app te escucha antes de enseñarte.
          </p>
        </Card>
      )}

      {/* ── Steps 0..N: Questions ── */}
      {step >= 0 && q && (
        <Card>
          <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, marginBottom: 8, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Pregunta {step + 1} de {totalSteps}
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
            fontSize: 'clamp(17px, 3.5vw, 21px)', color: B.dark,
            margin: '0 0 4px 0', lineHeight: 1.3,
          }}>
            {q.question}
          </h2>
          {q.subtitle && (
            <p style={{ fontSize: 13, color: '#999', margin: '0 0 18px 0', fontStyle: 'italic' }}>
              {q.subtitle}
            </p>
          )}
          {!q.subtitle && <div style={{ marginBottom: 18 }} />}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {q.options.map((opt) => {
              const isChosen = isMulti
                ? multiSel.includes(opt)
                : chosen === opt;
              return (
                <button
                  key={opt}
                  onClick={() => isMulti ? toggleMulti(opt) : handleSingleSelect(opt)}
                  style={{
                    textAlign: 'left',
                    border: `2px solid ${isChosen ? B.green : B.grayBorder}`,
                    background: isChosen ? B.greenLight : B.white,
                    borderRadius: 13, padding: '12px 15px', cursor: 'pointer',
                    fontFamily: 'Quicksand, sans-serif', fontWeight: isChosen ? 800 : 600,
                    fontSize: 14, color: isChosen ? B.dark : '#555',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <span style={{
                    width: 22, height: 22,
                    borderRadius: isMulti ? 6 : 999,
                    flexShrink: 0,
                    border: `2px solid ${isChosen ? B.green : B.grayBorder}`,
                    background: isChosen ? B.green : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: B.dark, fontWeight: 900,
                    transition: 'all 0.15s',
                  }}>
                    {isChosen ? '✓' : ''}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {isMulti && (
            <div style={{ marginTop: 16 }}>
              <Btn
                onClick={confirmMulti}
                fullWidth
                variant={multiSel.length > 0 ? 'primary' : 'ghost'}
              >
                {multiSel.length > 0 ? `Continuar con ${multiSel.length} selección${multiSel.length > 1 ? 'es' : ''} →` : 'Elige al menos una opción'}
              </Btn>
            </div>
          )}
        </Card>
      )}

      {/* Back + motivational */}
      {step > 0 && (
        <button onClick={() => setStep(step - 1)} style={{
          border: 'none', background: 'transparent', color: B.grayText,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Quicksand, sans-serif', padding: 0, textAlign: 'center',
        }}>
          ← Volver a la pregunta anterior
        </button>
      )}
      {step === 0 && (
        <button onClick={() => setStep(-1)} style={{
          border: 'none', background: 'transparent', color: B.grayText,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Quicksand, sans-serif', padding: 0, textAlign: 'center',
        }}>
          ← Volver al inicio
        </button>
      )}
    </div>
  );
}

// ─── Screen: Diagnosis Result ─────────────────────────────────────────────────

function DiagnosisResultScreen({ answers, userName, onEnter }: {
  answers: DiagAnswers;
  userName: string;
  onEnter: () => void;
}) {
  const firstName = userName.split(' ')[0];

  const needsVal = answers[5];
  const needsText = Array.isArray(needsVal)
    ? needsVal.join(' · ')
    : (needsVal ?? '—');

  const summary = [
    { label: 'Tu punto de partida', icon: '🌱', value: answers[1] as string ?? '—' },
    { label: 'Tu motivo de fondo', icon: '💛', value: answers[2] as string ?? '—' },
    { label: 'Tu emoción principal', icon: '💫', value: answers[3] as string ?? '—' },
    { label: 'Tu horizonte de tiempo', icon: '🗓', value: answers[4] as string ?? '—' },
    { label: 'Lo que necesitás de nosotros', icon: '🤝', value: needsText },
    { label: 'Tu ritmo de práctica', icon: '⏱', value: answers[6] ? `${answers[6]} al día` : '—' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Completed progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999, flexShrink: 0,
          background: B.green,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 11, color: B.dark }}>100%</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: B.greenDark, marginBottom: 4 }}>Perfil musical completo ✓</div>
          <div style={{ height: 10, background: B.grayBorder, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: `linear-gradient(to right, ${B.greenDark}, ${B.green})`, borderRadius: 999, boxShadow: '0 0 8px rgba(46,230,174,0.45)' }} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
        {DIAG_QUESTIONS.map((_, i) => (
          <div key={i} style={{ width: 8, height: 6, borderRadius: 999, background: B.greenDark }} />
        ))}
      </div>

      {/* Header — personalized */}
      <div style={{ background: B.green, borderRadius: 22, padding: '24px 26px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🧭</div>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
          fontSize: 'clamp(20px, 4vw, 26px)', color: B.dark,
          margin: '0 0 12px 0', lineHeight: 1.2,
        }}>
          {firstName}, tu viaje ya tiene brújula.
        </h2>
        <p style={{ fontSize: 14, color: '#4a4a49', margin: '0 0 12px 0', lineHeight: 1.7 }}>
          Tu viaje hacia la felicidad musical ya comenzó. Desde ahora,
          el Archipiélago usará todo lo que nos contaste para acompañarte
          con pequeñas victorias, sin presión y a tu propio ritmo.
        </p>
        <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['🎵 Música', '🏝 Viaje', '✨ Felicidad', '🌱 Victorias'].map(t => (
            <span key={t} style={{
              background: 'rgba(60,60,59,0.12)', borderRadius: 999,
              padding: '4px 12px', fontSize: 12, fontWeight: 800, color: B.dark,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Profile summary */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.grayText, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 14 }}>
          Tu perfil musical
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {summary.map((item) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '11px 13px', background: B.gray, borderRadius: 13,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: B.grayText, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.dark, lineHeight: 1.45 }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Btn onClick={onEnter} variant="pink" fullWidth>Entrar al Archipiélago 🏝</Btn>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#bbb', margin: '-6px 0 0', fontStyle: 'italic' }}>
        "No vienes a demostrar talento. Vienes a descubrir que sí puedes hacer música."
      </p>
    </div>
  );
}

// ─── Screen: Entry Moment (micro-transition) ──────────────────────────────────

function EntryMomentScreen({ userName, onContinue }: { userName: string; onContinue: () => void }) {
  const firstName = userName.split(' ')[0];
  const [visible, setVisible] = useState(false);

  useState(() => { setTimeout(() => setVisible(true), 60); });

  const islands = [
    { name: 'Isla del\nSilencio', skill: 'Escucha', emoji: '🏝', active: true },
    { name: 'Isla del\nPulso', skill: 'Ritmo', emoji: '🏝', active: false },
    { name: 'Isla del\nRitmo', skill: 'Melodía', emoji: '🏝', active: false },
  ];

  const glossary = [
    { icon: '🏝', term: 'Isla', def: 'una habilidad musical' },
    { icon: '🎯', term: 'Misión', def: 'un pequeño desafío' },
    { icon: '✨', term: 'Microvictoria', def: 'un avance real' },
    { icon: '📖', term: 'Bitácora', def: 'tu progreso' },
  ];

  return (
    <div style={{
      minHeight: '65vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.55s ease, transform 0.55s ease',
    }}>
      <Card style={{ width: '100%', padding: '32px 24px', textAlign: 'center', overflow: 'hidden' }}>

        {/* ── 1. Mapa del Archipiélago ── */}
        <div style={{
          background: B.dark,
          borderRadius: 18,
          padding: '20px 16px 16px',
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            Tu Archipiélago de la Felicidad
          </div>

          {/* Islands row */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 0, marginBottom: 8 }}>
            {islands.map((island, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ textAlign: 'center', opacity: island.active ? 1 : 0.38, position: 'relative' }}>
                  {island.active && (
                    <div style={{
                      fontSize: 9, fontWeight: 800, color: B.green,
                      letterSpacing: '0.05em', marginBottom: 3,
                    }}>
                      EMPEZÁS AQUÍ
                    </div>
                  )}
                  <div style={{ fontSize: island.active ? 36 : 26 }}>🏝</div>
                  <div style={{
                    fontSize: 10, marginTop: 4,
                    color: island.active ? B.green : 'rgba(255,255,255,0.45)',
                    fontWeight: island.active ? 800 : 500,
                    whiteSpace: 'pre-line', lineHeight: 1.3,
                  }}>
                    {island.name}
                  </div>
                  <div style={{
                    fontSize: 9, marginTop: 2,
                    color: island.active ? 'rgba(46,230,174,0.7)' : 'rgba(255,255,255,0.25)',
                    fontStyle: 'italic',
                  }}>
                    {island.skill}
                  </div>
                </div>
                {/* Connector */}
                {i < islands.length - 1 && (
                  <div style={{
                    width: 28, height: 2, marginBottom: 22,
                    background: 'rgba(46,230,174,0.2)',
                    borderRadius: 999, flexShrink: 0,
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Water line */}
          <div style={{ height: 2, background: 'rgba(46,230,174,0.18)', borderRadius: 999, margin: '8px -4px 0' }} />
        </div>

        {/* ── 2. Explicación del sistema ── */}
        <div style={{
          background: '#f7fdfb',
          border: `1.5px solid ${B.greenLight}`,
          borderRadius: 14,
          padding: '16px 18px',
          marginBottom: 18,
          textAlign: 'left',
        }}>
          <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: B.dark, lineHeight: 1.5 }}>
            El Archipiélago es tu viaje musical.
          </p>
          <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.7, fontWeight: 500 }}>
            Cada isla representa una habilidad.<br />
            Cada misión es un pequeño avance.<br />
            No necesitás hacerlo perfecto.<br />
            Solo seguir navegando.
          </p>
        </div>

        {/* ── 3. Mini guía visual ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8, marginBottom: 20,
        }}>
          {glossary.map(({ icon, term, def }, i) => (
            <div key={i} style={{
              background: '#fafafa',
              border: '1.5px solid #eee',
              borderRadius: 10,
              padding: '10px 12px',
              textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              <div style={{ fontSize: 16 }}>{icon}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: B.dark }}>{term}</div>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 500, lineHeight: 1.4 }}>{def}</div>
            </div>
          ))}
        </div>

        {/* ── 4. Mensaje emocional ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, justifyContent: 'center' }}>
          <div style={{ flex: 1, height: 1.5, background: B.greenLight, borderRadius: 999, maxWidth: 48 }} />
          <span style={{ fontSize: 16 }}>🎵</span>
          <div style={{ flex: 1, height: 1.5, background: B.greenLight, borderRadius: 999, maxWidth: 48 }} />
        </div>

        <p style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
          fontSize: 'clamp(17px, 3.5vw, 22px)', color: B.dark,
          margin: '0 0 20px', lineHeight: 1.3,
        }}>
          Navegante, ya cruzaste la puerta.
        </p>

        {/* ── 5. CTA ── */}
        <Btn onClick={onContinue} fullWidth>
          Empezar mi primera misión →
        </Btn>
      </Card>
    </div>
  );
}

// ─── Screen: Ruta Isla del Silencio (visual node path) ────────────────────────

function RouteScreen({ onBack, onStartMission, onReviewMission }: { onBack: () => void; onStartMission: () => void; onReviewMission: (id: string) => void }) {
  const [exploringNode, setExploringNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pressedNode, setPressedNode] = useState<string | null>(null);
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);
  const [pressedIsland, setPressedIsland] = useState<string | null>(null);
  const userName = 'Navegante';
  const firstName = userName.split(' ')[0];
  const nodeColors: Record<NodeStatus, { bg: string; border: string; icon: string; text: string }> = {
    done: { bg: B.green, border: B.greenDark, icon: B.dark, text: B.dark },
    current: { bg: B.green, border: B.pink, icon: B.dark, text: B.dark },
    locked: { bg: B.grayBorder, border: B.grayBorder, icon: B.grayText, text: B.grayText },
    achievement: { bg: '#FFF5E0', border: '#F5B800', icon: '#F5B800', text: B.dark },
  };

  return (
    <div>
      <BackBtn label="Inicio" onClick={onBack} />

      {/* ── Island journey strip ── */}
      <div style={{
        background: 'linear-gradient(135deg, #252b29 0%, #1c2220 100%)',
        borderRadius: 18,
        padding: '12px 0',
        marginBottom: 20,
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          padding: '2px 16px 2px',
          scrollbarWidth: 'none',
          gap: 0,
        }}>
          {ISLANDS.map((isl, i) => {
            const isActive = isl.status === 'active';
            const isIslHov = hoveredIsland === isl.id;
            const isIslPress = pressedIsland === isl.id;

            const islScale = isIslPress ? 'scale(0.97)' : isIslHov ? 'scale(1.03)' : 'scale(1)';
            const islShadow = isIslPress
              ? 'none'
              : isIslHov
              ? isActive
                ? '0 6px 20px rgba(46,230,174,0.22)'
                : '0 4px 12px rgba(0,0,0,0.18)'
              : 'none';
            const islBorder = isIslHov && !isIslPress
              ? isActive
                ? '1px solid rgba(46,230,174,0.55)'
                : '1px solid rgba(255,255,255,0.18)'
              : isActive
              ? '1px solid rgba(46,230,174,0.28)'
              : '1px solid rgba(255,255,255,0.07)';
            const islBg = isIslHov && isActive && !isIslPress
              ? 'rgba(46,230,174,0.14)'
              : isActive
              ? 'rgba(46,230,174,0.09)'
              : 'transparent';

            return (
              <div key={isl.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {/* Island chip */}
                <div
                  onMouseEnter={() => setHoveredIsland(isl.id)}
                  onMouseLeave={() => { setHoveredIsland(null); setPressedIsland(null); }}
                  onMouseDown={() => setPressedIsland(isl.id)}
                  onMouseUp={() => setPressedIsland(null)}
                  onTouchStart={() => setPressedIsland(isl.id)}
                  onTouchEnd={() => setPressedIsland(null)}
                  onTouchCancel={() => setPressedIsland(null)}
                  style={{
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                  background: islBg,
                  border: islBorder,
                  borderRadius: 13,
                  padding: isActive ? '9px 13px' : '7px 11px',
                  transform: islScale,
                  boxShadow: islShadow,
                  transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease, border-color 0.15s ease, background 0.15s ease',
                  cursor: 'pointer',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: isActive ? 20 : 15,
                      opacity: isActive ? 1 : 0.55,
                      filter: isActive ? 'none' : 'grayscale(0.4)',
                    }}>🏝</span>
                    <div>
                      <div style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 800,
                        fontSize: isActive ? 13 : 11,
                        color: isActive ? B.white : 'rgba(255,255,255,0.38)',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                      }}>
                        {isl.title}
                      </div>
                      {!isActive && (
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', marginTop: 2, letterSpacing: '0.02em' }}>
                          próximamente
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress strip — active only */}
                  {isActive && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', width: 120 }}>
                        <div style={{ width: `${isl.progress}%`, height: '100%', background: B.green, borderRadius: 999 }} />
                      </div>
                      <div style={{ fontSize: 9, fontWeight: 800, color: B.green, marginTop: 3, opacity: 0.85 }}>
                        {isl.progress}% completada
                      </div>
                    </div>
                  )}
                </div>

                {/* Connector */}
                {i < ISLANDS.length - 1 && (
                  <div style={{ flexShrink: 0, width: 22, textAlign: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.12)', letterSpacing: '-1px' }}>··›</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Horizon hint */}
          <div style={{ flexShrink: 0, paddingLeft: 6, display: 'flex', alignItems: 'center', gap: 3, opacity: 0.22 }}>
            <span style={{ fontSize: 9, color: B.white, letterSpacing: '-0.5px' }}>···</span>
            <span style={{ fontSize: 13 }}>🌊</span>
          </div>
        </div>
      </div>

      {exploringNode && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(60,60,59,0.45)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <Card style={{ width: '100%', maxWidth: 460, border: `1.5px solid ${B.pink}` }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 6 }}>
              Modo exploración
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: B.dark, marginBottom: 14 }}>
              Esta misión aún no está desbloqueada en tu viaje, pero puedes explorarla para conocer cómo será la experiencia.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn onClick={() => setExploringNode(null)} fullWidth>
                Explorar misión
              </Btn>
              <Btn variant="ghost" onClick={() => setExploringNode(null)} fullWidth>
                Volver a la ruta
              </Btn>
            </div>
          </Card>
        </div>
      )}

      {/* ── Section title ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 15 }}>✨</span>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15, color: B.dark, letterSpacing: '-0.01em' }}>
          Misiones de hoy
        </span>
      </div>

      {/* ── Node path ── */}
      <div style={{ position: 'relative', paddingLeft: 30 }}>
        {/* Vertical connector line — thinner, subtler */}
        <div style={{
          position: 'absolute', left: 13, top: 20, bottom: 20, width: 1.5,
          background: `repeating-linear-gradient(to bottom, ${B.green} 0, ${B.green} 5px, transparent 5px, transparent 10px)`,
          opacity: 0.5,
          zIndex: 0,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SILENCE_NODES.map((node) => {
            const s = node.status;
            const c = nodeColors[s];
            const isCurrent = s === 'current';
            const isLocked = s === 'locked';
            const isAchievement = s === 'achievement';
            const isInteractive = isCurrent || isLocked || s === 'done';
            const isHov = hoveredNode === node.id;
            const isPress = pressedNode === node.id;

            const cardScale = isPress
              ? 'scale(0.98)'
              : isHov && isInteractive ? 'scale(1.02)' : 'scale(1)';

            const cardShadow = isPress
              ? 'none'
              : isHov && isInteractive
              ? isCurrent
                ? `0 6px 20px rgba(46,230,174,0.28)`
                : s === 'done'
                ? `0 4px 14px rgba(46,230,174,0.16)`
                : `0 4px 12px rgba(0,0,0,0.08)`
              : isCurrent
              ? `0 2px 10px rgba(46,230,174,0.15)`
              : 'none';

            const cardBorder = isHov && isInteractive && !isPress
              ? isCurrent ? `1.5px solid ${B.pink}` : s === 'done' ? `1.5px solid ${B.green}` : `1.5px solid ${B.grayText}`
              : `1.5px solid ${isCurrent ? B.pink : isAchievement ? '#F5B800' : B.grayBorder}`;

            return (
              <div key={node.id} style={{ position: 'relative', zIndex: 1 }}>
                {/* Node dot — smaller */}
                <div style={{
                  position: 'absolute',
                  left: -30,
                  top: 12,
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: c.bg,
                  border: `2px solid ${c.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  boxShadow: isCurrent ? `0 0 0 3px ${B.pinkLight}` : 'none',
                  zIndex: 2,
                  transition: 'transform 0.18s ease',
                  transform: isPress ? 'scale(0.9)' : isHov && isCurrent ? 'scale(1.1)' : 'scale(1)',
                }}>
                  {s === 'done'
                    ? <span style={{ color: B.dark, fontWeight: 900, fontSize: 11 }}>✓</span>
                    : s === 'locked'
                    ? <span style={{ fontSize: 10 }}>🔒</span>
                    : <span style={{ fontSize: 11 }}>{node.icon}</span>}
                </div>

                {/* Node card */}
                <div
                  onClick={() => {
                    if (isCurrent) onStartMission();
                    else if (isLocked) setExploringNode(node.id);
                    else if (s === 'done') onReviewMission(node.id);
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => { setHoveredNode(null); setPressedNode(null); }}
                  onMouseDown={() => isInteractive && setPressedNode(node.id)}
                  onMouseUp={() => setPressedNode(null)}
                  onTouchStart={() => isInteractive && setPressedNode(node.id)}
                  onTouchEnd={() => setPressedNode(null)}
                  onTouchCancel={() => setPressedNode(null)}
                  style={{
                    background: isCurrent ? B.green : isAchievement ? '#FFF9EC' : isLocked ? B.gray : B.white,
                    border: cardBorder,
                    borderRadius: 14,
                    padding: '10px 14px',
                    cursor: isInteractive ? 'pointer' : 'default',
                    transform: cardScale,
                    boxShadow: cardShadow,
                    transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease, border-color 0.15s ease',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                >
                  {/* Title row */}
                  <div style={{
                    fontWeight: 800,
                    fontSize: 13,
                    color: isLocked ? B.grayText : B.dark,
                    marginBottom: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexWrap: 'wrap',
                  }}>
                    {node.title}
                    {isCurrent && <span style={{ background: B.pink, color: B.white, fontSize: 9, fontWeight: 800, borderRadius: 999, padding: '1px 7px' }}>AHORA</span>}
                    {isAchievement && <span style={{ background: '#F5B800', color: B.white, fontSize: 9, fontWeight: 800, borderRadius: 999, padding: '1px 7px' }}>LOGRO</span>}
                  </div>

                  {/* Subtitle */}
                  <div style={{ fontSize: 11, lineHeight: 1.4, color: isLocked ? '#ccc' : '#999', marginBottom: 6 }}>
                    {node.subtitle}
                  </div>

                  {/* Meta row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    {node.time && (
                      <div style={{ fontSize: 10, color: isCurrent ? B.dark : B.grayText, fontWeight: 700, background: isCurrent ? 'rgba(60,60,59,0.1)' : B.gray, borderRadius: 999, padding: '2px 9px', whiteSpace: 'nowrap' }}>
                        {node.type} · {node.time}
                      </div>
                    )}
                    {isCurrent && (
                      <div style={{ width: 24, height: 24, borderRadius: 999, background: B.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: B.white, paddingLeft: 1 }}>▶</div>
                    )}
                    {s === 'done' && (
                      <div style={{ color: B.greenDark, fontSize: 10, fontWeight: 800 }}>
                        Revisar →
                      </div>
                    )}
                    {isLocked && (
                      <div style={{ color: B.pink, fontSize: 10, fontWeight: 800 }}>
                        Explorar →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Mission ──────────────────────────────────────────────────────────

function MissionScreen({ onBack, onComplete, emotion, setEmotion }: {
  onBack: () => void;
  onComplete: () => void;
  emotion: string | null;
  setEmotion: (id: string) => void;
}) {
  const userName = 'Navegante';
  const firstName = userName.split(' ')[0];
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

function MissionTwoScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      title: 'Bienvenido al Archipiélago de la Felicidad',
      text: 'No estás entrando a un curso tradicional. Estás entrando a un viaje musical diseñado para ayudarte a descubrir que sí puedes aprender.',
      visual: '🌊🏝️🎸',
    },
    {
      title: 'Cada isla representa una pequeña victoria',
      text: 'En este viaje no avanzas por perfección. Avanzas cada vez que logras una nueva experiencia musical.',
      visual: 'Isla del Silencio · Isla del Pulso · Isla del Ritmo · Isla de las Canciones',
    },
    {
      title: 'Cada logro tiene significado',
      text: 'No coleccionas puntos vacíos. Cada sello representa algo que venciste y un crecimiento emocional y musical.',
      visual: 'Guardián del Silencio · Primer Sonido · Ritmo Despierto',
    },
    {
      title: 'No viajarás solo/a',
      text: 'Tendrás un profesor guía y herramientas IA acompañándote durante el viaje, con comunidad y apoyo humano.',
      visual: '👩‍🏫 💬 🤍',
    },
    {
      title: 'Aquí no buscamos perfección',
      text: 'Queremos ayudarte a sentir que la música también puede ser para ti. Pequeñas victorias. Sin presión. Aprender disfrutando.',
      visual: '✨ Pequeñas victorias · sin presión · tocar la felicidad',
    },
    {
      title: 'Tu primera puerta musical te espera',
      text: 'Hoy no necesitas tocar perfecto. Solo necesitas comenzar.',
      visual: '🏁🎵',
    },
  ];
  const current = slides[slide];
  const prev = () => setSlide((s) => Math.max(0, s - 1));
  const next = () => setSlide((s) => Math.min(slides.length - 1, s + 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Ruta Isla del Silencio" onClick={onBack} />
      <Card style={{ background: B.green, padding: '18px 22px' }}>
        <Tag color="pink">Historia interactiva · 3 min</Tag>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(20px,4vw,26px)', margin: '10px 0 6px 0', color: B.dark }}>
          Conoce el Archipiélago
        </h2>
        <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.55 }}>
          Descubre cómo funciona este viaje musical.
        </p>
      </Card>
      <Card style={{ minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 44, marginBottom: 12 }}>{current.visual}</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
            Slide {slide + 1} de {slides.length}
          </div>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(18px,4vw,24px)', margin: '0 0 10px', color: B.dark, lineHeight: 1.2 }}>
            {current.title}
          </h3>
          <p style={{ margin: 0, color: '#666', lineHeight: 1.7, fontSize: 14 }}>{current.text}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <Btn variant="ghost" onClick={prev} fullWidth={false}>
            Anterior
          </Btn>
          {slide < slides.length - 1 ? (
            <Btn onClick={next} fullWidth={false}>
              Siguiente
            </Btn>
          ) : (
            <Btn onClick={onNext} fullWidth={false}>
              Ir a mi próxima misión
            </Btn>
          )}
        </div>
      </Card>
    </div>
  );
}

function MissionThreeScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Ruta Isla del Silencio" onClick={onBack} />
      <Card style={{ background: B.green, padding: '18px 22px' }}>
        <Tag color="pink">Misión completada · Nodo 3 de 8</Tag>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(20px,4vw,26px)', margin: '10px 0 6px 0', color: B.dark }}>
          Toma tu ukelele sin tensión
        </h2>
        <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.55 }}>
          Antes de tocar, tu cuerpo también necesita sentirse cómodo.
        </p>
      </Card>
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
      <Btn onClick={onBack} fullWidth>Volver a la ruta</Btn>
    </div>
  );
}

function MissionFourScreen({ onBack }: { onBack: () => void }) {
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

function MissionGuideScreen({ onBack }: { onBack: () => void }) {
  const userName = 'Navegante';
  const firstName = userName.split(' ')[0];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Ruta Isla del Silencio" onClick={onBack} />
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

function CelebrationScreen({ onHome }: { onHome: () => void }) {
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

const DEV_SCREENS: { label: string; screen: Screen }[] = [
  { label: '① Bienvenida',    screen: 'welcome' },
  { label: '② Onboarding',    screen: 'onboarding' },
  { label: '③ Diagnóstico',   screen: 'diagnosis' },
  { label: '④ Resultado',     screen: 'diagnosis-result' },
  { label: '⑤ Entrada',       screen: 'entry-moment' },
  { label: '⑥ Ruta Isla',     screen: 'route' },
  { label: '⑦ Misión DO',     screen: 'mission' },
  { label: '⑧ Celebración',   screen: 'celebration' },
];

function DevNav({ current, onGo }: { current: Screen; onGo: (s: Screen) => void }) {
  const [open, setOpen] = useState(false);
  if (!import.meta.env.DEV) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 16, zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
    }}>
      {open && (
        <div style={{
          background: B.dark, borderRadius: 18, padding: '14px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          display: 'flex', flexDirection: 'column', gap: 6, minWidth: 210,
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: B.green, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>
            Saltar pantalla · Solo prototipo
          </div>
          {DEV_SCREENS.map(({ label, screen }) => (
            <button
              key={screen}
              onClick={() => { onGo(screen); setOpen(false); }}
              style={{
                background: current === screen ? B.green : 'rgba(255,255,255,0.07)',
                color: current === screen ? B.dark : 'rgba(255,255,255,0.85)',
                border: 'none', borderRadius: 10, padding: '8px 14px',
                fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (current !== screen) e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
              onMouseLeave={e => { if (current !== screen) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        title="Navegación de prototipo"
        style={{
          width: 46, height: 46, borderRadius: 14,
          background: open ? B.green : B.dark,
          color: open ? B.dark : B.green,
          border: `2px solid ${B.green}`,
          fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        {open ? '✕' : '⚡'}
      </button>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export function ArchipelagoApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 1500);
    const hideTimer = setTimeout(() => setShowSplash(false), 2000);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  const [screen, setScreen] = useState<Screen>('welcome');
  const [diagAnswers, setDiagAnswers] = useState<DiagAnswers>({});
  const [userName, setUserName] = useState('Navegante');
  const [completedMission, setCompletedMission] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);

  const route = useMemo(() => ROUTES[0], []);
  const goRoute = () => setScreen('route');

  const onboardingFlow: Screen[] = ['welcome', 'onboarding', 'diagnosis', 'diagnosis-result', 'entry-moment'];
  const showHomeNav = !onboardingFlow.includes(screen);

  function devJump(s: Screen) {
    if (s === 'celebration') setCompletedMission(true);
    setScreen(s);
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: B.gray,
      color: B.dark,
      fontFamily: 'Quicksand, Arial, sans-serif',
      padding: '16px 16px 48px',
    }}>
      {showSplash && <SplashScreen fading={splashFading} />}
      <DevNav current={screen} onGo={devJump} />
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <AppHeader screen={screen} onHome={showHomeNav ? goRoute : undefined} />

        {screen === 'welcome' && (
          <WelcomeScreen onStart={() => setScreen('onboarding')} />
        )}

        {screen === 'onboarding' && (
          <OnboardingScreen onStart={() => setScreen('diagnosis')} />
        )}

        {screen === 'diagnosis' && (
          <DiagnosisScreen
            onComplete={(answers, name) => {
              setDiagAnswers(answers);
              setUserName(name);
              setScreen('diagnosis-result');
            }}
          />
        )}

        {screen === 'diagnosis-result' && (
          <DiagnosisResultScreen
            answers={diagAnswers}
            userName={userName}
            onEnter={() => setScreen('entry-moment')}
          />
        )}

        {screen === 'entry-moment' && (
          <EntryMomentScreen userName={userName} onContinue={goRoute} />
        )}

        {screen === 'route' && (
          <RouteScreen
            onBack={goRoute}
            onStartMission={() => setScreen('mission')}
            onReviewMission={(id) => setScreen(id === 'n1' ? 'mission-guide' : id === 'n3' ? 'mission-three' : id === 'n4' ? 'mission-four' : 'mission-two')}
          />
        )}

        {screen === 'mission' && (
          <MissionScreen
            onBack={() => setScreen('route')}
            onComplete={() => { setCompletedMission(true); setScreen('celebration'); }}
            emotion={emotion}
            setEmotion={setEmotion}
          />
        )}

        {screen === 'mission-two' && (
          <MissionTwoScreen
            onBack={() => setScreen('route')}
            onNext={() => setScreen('mission')}
          />
        )}

        {screen === 'mission-three' && (
          <MissionThreeScreen onBack={() => setScreen('route')} />
        )}

        {screen === 'mission-four' && (
          <MissionFourScreen onBack={() => setScreen('route')} />
        )}

        {screen === 'mission-guide' && (
          <MissionGuideScreen onBack={() => setScreen('route')} />
        )}

        {screen === 'celebration' && completedMission && (
          <CelebrationScreen onHome={goRoute} />
        )}
      </div>
    </main>
  );
}
