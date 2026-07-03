import { B } from "../data/brand";

export function Btn({
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
