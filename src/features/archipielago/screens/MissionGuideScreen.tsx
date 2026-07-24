import { useState } from "react";
import { B } from "../data/brand";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";
import { LessonCompletionBox } from "../components/LessonCompletionBox";
import { LessonDiscussionSection } from "@/features/discussions/components/LessonDiscussionSection";
import alvaroAsset from "../../../assets/alvaro-campos.jpeg.asset.json";

const WHATSAPP_PHONE = '56935927518';
const WHATSAPP_MESSAGE = `Hola,

Acabo de comenzar mi viaje en Soundkeleles.

Estoy en la primera clase de Puerto de Inicio y quería presentarme.

Mi nombre es:

Muchas gracias.`;


export function MissionGuideScreen({ onBack, userName, learnerName }: { onBack: () => void; userName?: string; learnerName?: string }) {
  // El contenido de la lección se dirige al ESTUDIANTE. En accompanied_learning,
  // learnerName ya viene resuelto por getJourneyLearnerName en el contenedor.
  const safeName = (learnerName ?? userName)?.trim();
  const firstName = safeName ? safeName.split(' ')[0] : 'Navegante';
  const [showVideoModal, setShowVideoModal] = useState(false);
  const guidePhoto = alvaroAsset.url;

  function openVideoModal() {
    setShowVideoModal(true);
  }

  function closeVideoModal() {
    setShowVideoModal(false);
  }

  const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
  const isMobile = typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const whatsappUrl = isMobile
    ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`
    : `https://web.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedMessage}`;






  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Conoce a tu guía"
        subtitle="Antes de tocar tu primer acorde, queremos que sepas quién caminará contigo."
      />

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 280, background: '#111' }}>
          <img
            src={guidePhoto}
            alt="Álvaro Campos, fundador y profesor guía de SoundKeleles"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)' }} />
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, color: B.white }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Video de bienvenida · 2 min</div>
              <div style={{ fontSize: 12, opacity: 0.92, marginTop: 2, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                Álvaro te cuenta cómo será este viaje.
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Reproducir video de bienvenida"
            onClick={openVideoModal}
            style={{
              position: 'absolute',
              left: '50%',
              top: '58%',
              transform: 'translate(-50%, -50%)',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              opacity: 0.55,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)'; e.currentTarget.style.opacity = '0.8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; e.currentTarget.style.opacity = '0.55'; }}
          >
            <svg width="88" height="62" viewBox="0 0 68 48" aria-hidden="true" style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.35))' }}>
              <rect x="0" y="0" width="68" height="48" rx="14" fill="rgba(230,232,236,0.28)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <path d="M27 15 L47 24 L27 33 Z" fill="#FFFFFF" />
            </svg>
          </button>
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
          <div><strong style={{ color: B.dark }}>Nombre:</strong> Álvaro Campos</div>
          <div><strong style={{ color: B.dark }}>Rol:</strong> Fundador y profesor guía de SoundKeleles</div>
          <div><strong style={{ color: B.dark }}>Experiencia:</strong> Acompaña a personas que están comenzando desde cero, ayudándolas a tocar sus primeros acordes con confianza, calma y pequeñas victorias musicales.</div>
          <div><strong style={{ color: B.dark }}>Estilo de enseñanza:</strong> Paso a paso, simple, cercano y sin presión. La idea es que sientas que sí puedes aprender, aunque nunca hayas tocado un instrumento.</div>
          <div><strong style={{ color: B.dark }}>Frase del guía:</strong> “No estás aquí para demostrar talento. Estás aquí para descubrir tu sonido.”</div>
        </div>
      </Card>
      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video de bienvenida"
          onClick={closeVideoModal}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 12, zIndex: 1000,
            maxHeight: '100dvh', overflowY: 'auto',
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
                <div style={{ fontWeight: 800, fontSize: 14, color: B.dark, lineHeight: 1.2 }}>Video de bienvenida</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Álvaro te cuenta cómo será este viaje.
                </div>
              </div>
              <button
                type="button"
                onClick={closeVideoModal}
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
              <div style={{
                position: 'relative', width: '100%', maxWidth: '100%', maxHeight: '100%',
                aspectRatio: '16 / 9',
              }}>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/ADOZ58fM9nA?rel=0&modestbranding=1&playsinline=1&autoplay=1"
                  title="Video de bienvenida de Álvaro Campos"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <Card style={{
        padding: '18px 20px',
        background: 'linear-gradient(135deg, #F2FBF7 0%, #E8F7F1 100%)',
        border: `1.5px solid ${B.green}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span aria-hidden="true" style={{ fontSize: 22 }}>💬</span>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
            fontSize: 16, color: B.dark, lineHeight: 1.3,
          }}>
            ¿Tienes alguna duda? Escríbele a tu profe
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: '#4a5a54', lineHeight: 1.6, margin: '0 0 8px' }}>
          Durante todo este viaje no estarás solo. Si tienes alguna duda, si necesitas ayuda para afinar tu ukelele, si algo no te resulta o simplemente quieres saludarnos, puedes escribirnos directamente por WhatsApp.
        </p>
        <p style={{ fontSize: 13, color: '#4a5a54', lineHeight: 1.6, margin: '0 0 14px', fontStyle: 'italic' }}>
          Nos encanta acompañar a nuestros alumnos desde el primer día ❤️
        </p>
        <button
          type="button"
          onClick={openWhatsApp}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#25D366', color: '#FFFFFF', border: 'none', cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 14,
            padding: '12px 16px', borderRadius: 12, width: '100%',
            boxShadow: '0 4px 14px rgba(37,211,102,0.28)',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 16 }}>💚</span>
          Escribir a mi profe por WhatsApp
        </button>
      </Card>
      <LessonCompletionBox lessonId="n1" islandId="start-port" onCompleted={onBack} />
      <LessonDiscussionSection lessonId="n1" />
    </div>
  );
}

