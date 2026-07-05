import { useState } from "react";
import { B } from "../data/brand";
import { Card } from "./Card";

export function LessonVideoCard({
  videoId, title, subtitle, badge,
}: {
  videoId: string; title: string; subtitle?: string; badge?: string;
}) {
  const [open, setOpen] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 220, background: '#111' }}>
          <img src={thumb} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)' }} />
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, color: B.white }}>
            {badge && (
              <div style={{
                display: 'inline-block', background: 'rgba(46,230,174,0.95)', color: B.dark,
                fontWeight: 800, fontSize: 11, padding: '4px 10px', borderRadius: 999,
                letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8,
              }}>
                {badge}
              </div>
            )}
            <div style={{ fontWeight: 800, fontSize: 15, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{title}</div>
            {subtitle && (
              <div style={{ fontSize: 12, opacity: 0.92, marginTop: 2, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {subtitle}
              </div>
            )}
          </div>
          <button
            type="button" aria-label={`Reproducir: ${title}`} onClick={() => setOpen(true)}
            style={{
              position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%, -50%)',
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', opacity: 0.9,
            }}
          >
            <svg width="76" height="54" viewBox="0 0 68 48" aria-hidden="true" style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.4))' }}>
              <rect x="0" y="0" width="68" height="48" rx="14" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M27 15 L47 24 L27 33 Z" fill="#FFFFFF" />
            </svg>
          </button>
        </div>
      </Card>

      {open && (
        <div
          role="dialog" aria-modal="true" aria-label={`Video: ${title}`}
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 12, zIndex: 1000, maxHeight: '100dvh', overflowY: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 900, background: B.white, borderRadius: 16,
              overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', maxHeight: 'calc(100dvh - 24px)',
            }}
          >
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: B.dark, lineHeight: 1.2 }}>{title}</div>
                {subtitle && (
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {subtitle}
                  </div>
                )}
              </div>
              <button
                type="button" onClick={() => setOpen(false)} aria-label="Cerrar video"
                style={{
                  background: 'transparent', border: '1px solid #ddd', borderRadius: 999,
                  padding: '6px 12px', fontSize: 12, fontWeight: 700, color: B.dark, cursor: 'pointer', flexShrink: 0,
                }}
              >
                Cerrar
              </button>
            </div>
            <div style={{ flex: '1 1 auto', minHeight: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '100%', maxHeight: '100%', aspectRatio: '16 / 9' }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PurposeRow({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 800, color, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: B.dark }}>{text}</div>
    </div>
  );
}
