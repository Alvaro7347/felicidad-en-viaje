import { useState } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";

const VIDEO_ID = "uUY8OXDAQUo";
const VIDEO_THUMB = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;

export function MissionSevenScreen({ onBack }: { onBack: () => void }) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Toma tu ukelele sin tensión"
        subtitle="Antes de tocar, tu cuerpo también necesita sentirse cómodo."
      />

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 220, background: '#111' }}>
          <img
            src={VIDEO_THUMB}
            alt="Abraza tu ukelele"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)' }} />
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, color: B.white }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(46,230,174,0.95)',
              color: B.dark,
              fontWeight: 800, fontSize: 11,
              padding: '4px 10px', borderRadius: 999,
              letterSpacing: '0.6px', textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Video · 4 min
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Abraza tu ukelele
            </div>
            <div style={{ fontSize: 12, opacity: 0.92, marginTop: 2, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Aprende a sostenerlo sin tensión.
            </div>
          </div>
          <button
            type="button"
            aria-label="Reproducir video: Abraza tu ukelele"
            onClick={() => setShowVideoModal(true)}
            style={{
              position: 'absolute', left: '50%', top: '46%',
              transform: 'translate(-50%, -50%)',
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0.9, transition: 'transform 0.2s ease, opacity 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.06)'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; e.currentTarget.style.opacity = '0.9'; }}
          >
            <svg width="76" height="54" viewBox="0 0 68 48" aria-hidden="true" style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.4))' }}>
              <rect x="0" y="0" width="68" height="48" rx="14" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M27 15 L47 24 L27 33 Z" fill="#FFFFFF" />
            </svg>
          </button>
        </div>
      </Card>

      <Card>
        <p style={{ margin: 0, color: '#666', lineHeight: 1.7, fontSize: 13 }}>
          En esta clase aprenderás cómo sostener tu ukelele de forma cómoda, evitando tensión innecesaria en el cuerpo antes de tocar tus primeros sonidos.
        </p>
      </Card>

      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.greenDark, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>
          Qué aprenderás
        </div>
        <div style={{ display: 'grid', gap: 10, fontSize: 13, lineHeight: 1.6, color: '#666' }}>
          <div>🤲 Cómo apoyar el ukelele con comodidad.</div>
          <div>💆 Cómo evitar tensión en hombros, brazos y manos.</div>
          <div>🌬️ Cómo preparar tu cuerpo antes de tocar.</div>
          <div>🌿 Por qué una buena postura te ayuda a disfrutar más el viaje.</div>
        </div>
      </Card>

      <Card style={{ background: B.greenLight }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.greenDark, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          Recuerda
        </div>
        <p style={{ margin: 0, color: B.dark, lineHeight: 1.7, fontSize: 13 }}>
          No necesitas apretar fuerte ni hacerlo perfecto. Busca una posición cómoda, respira y deja que el ukelele se sienta cercano a ti.
        </p>
      </Card>

      <Card>
        <p style={{ margin: 0, color: '#666', lineHeight: 1.7, fontSize: 13, fontStyle: 'italic' }}>
          Antes de tocar una nota, ya estás aprendiendo algo importante: cómo relacionarte con tu instrumento sin presión.
        </p>
      </Card>

      <Btn onClick={onBack} fullWidth>Volver al Puerto de Inicio</Btn>

      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video: Abraza tu ukelele"
          onClick={() => setShowVideoModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 12, zIndex: 1000, maxHeight: '100dvh', overflowY: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 900, background: B.white,
              borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column',
              maxHeight: 'calc(100dvh - 24px)',
            }}
          >
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: B.dark, lineHeight: 1.2 }}>Abraza tu ukelele</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Cómo sostenerlo sin tensión.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                aria-label="Cerrar video"
                style={{
                  background: 'transparent', border: '1px solid #ddd', borderRadius: 999,
                  padding: '6px 12px', fontSize: 12, fontWeight: 700, color: B.dark, cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                Cerrar
              </button>
            </div>
            <div style={{
              flex: '1 1 auto', minHeight: 0, background: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '100%', maxHeight: '100%', aspectRatio: '16 / 9' }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
                  title="Abraza tu ukelele"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
