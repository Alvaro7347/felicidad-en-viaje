import { useState } from "react";
import { B } from "../data/brand";
import type { Screen } from "../types";
import { DEV_SCREENS } from "../data/screens";

export function DevNav({ current, onGo }: { current: Screen; onGo: (s: Screen) => void }) {
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
