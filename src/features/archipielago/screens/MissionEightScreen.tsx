import { useState } from "react";
import { B } from "../data/brand";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";
import { LessonCompletionBox } from "../components/LessonCompletionBox";
import { LessonDiscussionSection } from "@/features/discussions/components/LessonDiscussionSection";

const VIDEO_ID = "QiqLfHRHmYw";
const VIDEO_THUMB = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;

export function MissionEightScreen({ onBack }: { onBack: () => void }) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Afina tu primer sonido"
        subtitle="Antes de tocar música, tu ukelele también necesita encontrar su voz."
      />

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 220, background: '#111' }}>
          <img
            src={VIDEO_THUMB}
            alt="Cómo afinar tu ukelele"
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
              Video · 5 min
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Cómo afinar tu ukelele
            </div>
            <div style={{ fontSize: 12, opacity: 0.92, marginTop: 2, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Aprende a preparar tu sonido paso a paso.
            </div>
          </div>
          <button
            type="button"
            aria-label="Reproducir video de afinación"
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
          En esta clase aprenderás cómo afinar tu ukelele aunque nunca hayas afinado un instrumento antes. La idea no es hacerlo perfecto de inmediato, sino comenzar a escuchar con calma.
        </p>
      </Card>

      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.greenDark, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>
          Qué aprenderás
        </div>
        <div style={{ display: 'grid', gap: 10, fontSize: 13, lineHeight: 1.6, color: '#666' }}>
          <div>• Qué significa afinar.</div>
          <div>• Cómo reconocer si una cuerda está muy alta o muy baja.</div>
          <div>• Cómo usar un afinador digital.</div>
          <div>• Cómo preparar tu ukelele para sonar mejor.</div>
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.grayText, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          Afinador recomendado
        </div>
        <p style={{ margin: '0 0 12px', color: '#666', lineHeight: 1.7, fontSize: 13 }}>
          Para esta misión te recomendamos la aplicación <strong>GuitarTuna</strong>. Es simple, amigable para principiantes y te ayudará a afinar tu ukelele fácilmente.
        </p>
        <style>{`
          .store-link {
            flex: 1 1 calc(50% - 6px);
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 10px;
            background: ${B.gray};
            border: 1px solid ${B.grayBorder};
            border-radius: 14px;
            padding: 12px 14px;
            text-decoration: none;
            color: inherit;
            transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
            outline: none;
          }
          .store-link:hover,
          .store-link:focus-visible {
            transform: translateY(-1px);
            border-color: ${B.green};
            box-shadow: 0 4px 12px rgba(46, 230, 174, 0.18);
          }
          .store-link:focus-visible {
            outline: 2px solid ${B.green};
            outline-offset: 2px;
          }
          @media (max-width: 480px) {
            .store-link {
              flex: 1 1 100%;
            }
          }
        `}</style>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <a
            href="https://play.google.com/store/apps/details?id=com.ovelin.guitartuna&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Descargar GuitarTuna para Android"
            className="store-link"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={B.green} aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M17.523 15.3414C17.2217 15.3414 16.9771 15.0968 16.9771 14.7955V9.20346C16.9771 8.90215 17.2217 8.65753 17.523 8.65753C17.8243 8.65753 18.0689 8.90215 18.0689 9.20346V14.7955C18.0689 15.0968 17.8243 15.3414 17.523 15.3414ZM6.47699 15.3414C6.17568 15.3414 5.93106 15.0968 5.93106 14.7955V9.20346C5.93106 8.90215 6.17568 8.65753 6.47699 8.65753C6.7783 8.65753 7.02292 8.90215 7.02292 9.20346V14.7955C7.02292 15.0968 6.7783 15.3414 6.47699 15.3414ZM19.6168 7.56566H4.3832C3.4782 7.56566 2.74353 8.30033 2.74353 9.20533V14.7936C2.74353 15.6986 3.4782 16.4333 4.3832 16.4333H5.47706V18.6206C5.47706 19.2233 5.96606 19.7123 6.56876 19.7123C7.17146 19.7123 7.66046 19.2233 7.66046 18.6206V16.4333H16.3395V18.6206C16.3395 19.2233 16.8285 19.7123 17.4312 19.7123C18.0339 19.7123 18.5229 19.2233 18.5229 18.6206V16.4333H19.6168C20.5218 16.4333 21.2565 15.6986 21.2565 14.7936V9.20533C21.2565 8.30033 20.5218 7.56566 19.6168 7.56566ZM16.0684 4.93037L17.1623 3.83649C17.3757 3.62309 17.3757 3.27542 17.1623 3.06202C16.9489 2.84862 16.6012 2.84862 16.3878 3.06202L15.1278 4.32202C14.1509 3.80272 13.0203 3.50033 11.8267 3.50033H12.1733C10.9797 3.50033 9.84906 3.80272 8.87218 4.32202L7.61218 3.06202C7.39878 2.84862 7.05111 2.84862 6.83771 3.06202C6.62431 3.27542 6.62431 3.62309 6.83771 3.83649L7.93159 4.93037C6.30506 6.05292 5.2312 7.89453 5.2312 9.97803H18.7688C18.7688 7.89453 17.6949 6.05292 16.0684 4.93037ZM9.10926 7.01903C8.80795 7.01903 8.56333 6.7744 8.56333 6.47309C8.56333 6.17178 8.80795 5.92716 9.10926 5.92716C9.41057 5.92716 9.65519 6.17178 9.65519 6.47309C9.65519 6.7744 9.41057 7.01903 9.10926 7.01903ZM14.8907 7.01903C14.5894 7.01903 14.3448 6.7744 14.3448 6.47309C14.3448 6.17178 14.5894 5.92716 14.8907 5.92716C15.192 5.92716 15.4367 6.17178 15.4367 6.47309C15.4367 6.7744 15.192 7.01903 14.8907 7.01903Z" />
            </svg>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: B.dark, fontSize: 14, lineHeight: 1.3 }}>Descargar para Android</div>
              <div style={{ fontSize: 12, color: B.grayText, lineHeight: 1.3 }}>Google Play</div>
            </div>
          </a>
          <a
            href="https://apps.apple.com/es/app/guitartuna-afinador-acordes/id527588389"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Descargar GuitarTuna para iPhone desde App Store"
            className="store-link"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={B.green} aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.69 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.66 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.68 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
            </svg>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: B.dark, fontSize: 14, lineHeight: 1.3 }}>Descargar para iPhone</div>
              <div style={{ fontSize: 12, color: B.grayText, lineHeight: 1.3 }}>App Store</div>
            </div>
          </a>
        </div>
      </Card>

      <Card style={{ background: B.greenLight }}>
        <p style={{ margin: 0, color: B.dark, lineHeight: 1.7, fontSize: 13 }}>
          Afinar también es aprender a escuchar. No te preocupes si al principio parece difícil: tu oído también irá despertando.
        </p>
      </Card>

      

      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video: Cómo afinar tu ukelele"
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
                <div style={{ fontWeight: 800, fontSize: 14, color: B.dark, lineHeight: 1.2 }}>Cómo afinar tu ukelele</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Aprende a preparar tu sonido paso a paso.
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
                  title="Cómo afinar tu ukelele"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <LessonCompletionBox lessonId="n8" islandId="start-port" onCompleted={onBack} />
      <LessonDiscussionSection lessonId="n8" />
    </div>
  );
}
