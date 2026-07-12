import { useState } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";
import { LessonCompletionBox } from "../components/LessonCompletionBox";
import { LessonDiscussionSection } from "@/features/discussions/components/LessonDiscussionSection";
import alvaroAsset from "../../../assets/alvaro-campos.jpeg.asset.json";
import { supabase } from "@/integrations/supabase/client";

const GUIDE_CONTACT_CONTEXT = {
  guideName: 'Álvaro Campos',
  guideRole: 'Fundador y profesor guía de SoundKeleles',
  // TODO: definir email real del guía cuando se active el envío por Supabase Edge Function.
  stageId: 'puerto-inicio',
  stageTitle: 'Puerto de Inicio',
  missionId: 'n1',
  missionTitle: 'Conoce a tu guía',
  source: 'mission-guide',
} as const;

type GuideMessagePayload = {
  studentName: string;
  studentEmail: string;
  guideName: string;
  guideRole: string;
  stageId: string;
  stageTitle: string;
  missionId: string;
  missionTitle: string;
  source: string;
  message: string;
  createdAt: string;
};

function buildGuideMessagePayload(params: {
  studentName: string;
  studentEmail: string;
  message: string;
}): GuideMessagePayload {
  return {
    studentName: params.studentName,
    studentEmail: params.studentEmail,
    guideName: GUIDE_CONTACT_CONTEXT.guideName,
    guideRole: GUIDE_CONTACT_CONTEXT.guideRole,
    stageId: GUIDE_CONTACT_CONTEXT.stageId,
    stageTitle: GUIDE_CONTACT_CONTEXT.stageTitle,
    missionId: GUIDE_CONTACT_CONTEXT.missionId,
    missionTitle: GUIDE_CONTACT_CONTEXT.missionTitle,
    source: GUIDE_CONTACT_CONTEXT.source,
    message: params.message,
    createdAt: new Date().toISOString(),
  };
}

async function saveGuideMessage(payload: GuideMessagePayload) {
  const { error } = await supabase.from('support_messages').insert({
    student_name: payload.studentName,
    student_email: payload.studentEmail,
    guide_name: payload.guideName,
    guide_role: payload.guideRole,
    stage_id: payload.stageId,
    stage_title: payload.stageTitle,
    mission_id: payload.missionId,
    mission_title: payload.missionTitle,
    source: payload.source,
    message: payload.message,
    status: 'pending',
  });
  if (error) throw error;
}

export function MissionGuideScreen({ onBack, userName, learnerName }: { onBack: () => void; userName?: string; learnerName?: string }) {
  // El contenido de la lección se dirige al ESTUDIANTE. En accompanied_learning,
  // learnerName ya viene resuelto por getJourneyLearnerName en el contenedor.
  const safeName = (learnerName ?? userName)?.trim();
  const firstName = safeName ? safeName.split(' ')[0] : 'Navegante';
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [isSendingContactMessage, setIsSendingContactMessage] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const guidePhoto = alvaroAsset.url;

  function openVideoModal() {
    setShowVideoModal(true);
  }

  function closeVideoModal() {
    setShowVideoModal(false);
  }

  function openContactModal() {
    setContactError(null);
    setContactSent(false);
    setShowContactModal(true);
  }

  function closeContactModal() {
    if (isSendingContactMessage) return;
    setShowContactModal(false);
    setContactError(null);
    setContactSent(false);
    setContactEmail('');
    setContactMessage('');
  }

  async function handleSendGuideMessage() {
    if (isSendingContactMessage) return;
    const email = contactEmail.trim();
    const message = contactMessage.trim();
    if (!message) {
      setContactError('Escribe un mensaje antes de enviarlo.');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setContactError('Ingresa un correo válido para que podamos responderte.');
      return;
    }
    const payload = buildGuideMessagePayload({
      studentName: safeName || 'Navegante',
      studentEmail: email,
      message,
    });
    setContactError(null);
    setIsSendingContactMessage(true);
    try {
      await saveGuideMessage(payload);
      setContactSent(true);
    } catch (err) {
      console.error('[MissionGuideScreen] Error guardando mensaje al guía:', err);
      setContactError('No pudimos enviar tu mensaje. Intenta nuevamente.');
    } finally {
      setIsSendingContactMessage(false);
    }
  }



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
      <Card style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: B.dark, marginBottom: 4 }}>
          ¿Necesitas apoyo?
        </div>
        <div style={{ fontSize: 13, color: B.grayText, lineHeight: 1.55, marginBottom: 14 }}>
          Puedes escribirle a tu profesor guía si tienes una duda o necesitas acompañamiento.
        </div>
        <Btn variant="ghost" onClick={openContactModal} fullWidth>
          Escríbele al profe
        </Btn>
      </Card>

      {showContactModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          onClick={closeContactModal}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,25,35,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: B.white, borderRadius: 20, width: '100%', maxWidth: 440,
              padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              maxHeight: '90vh', overflowY: 'auto',
              fontFamily: 'Quicksand, sans-serif',
            }}
          >
            {!contactSent ? (
              <>
                <h3 id="contact-modal-title" style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
                  fontSize: 20, margin: '0 0 6px', color: B.dark,
                }}>
                  Escríbele a tu guía
                </h3>
                <p style={{ fontSize: 13.5, color: '#666', margin: '0 0 14px', lineHeight: 1.55 }}>
                  Cuéntale a Álvaro tu duda o qué necesitas para seguir avanzando.
                </p>
                <div style={{
                  background: '#F5FBF8', border: `1px solid ${B.grayBorder}`,
                  borderRadius: 12, padding: '10px 12px', marginBottom: 14,
                  fontSize: 12.5, color: '#555', lineHeight: 1.7,
                }}>
                  <div><strong style={{ color: B.dark }}>Para:</strong> Álvaro Campos</div>
                  <div><strong style={{ color: B.dark }}>Etapa:</strong> Puerto de Inicio</div>
                  <div><strong style={{ color: B.dark }}>Misión:</strong> Conoce a tu guía</div>
                </div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: B.dark, marginBottom: 6 }}>
                  Tu correo
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  maxLength={255}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    border: `2px solid ${B.grayBorder}`, borderRadius: 12,
                    padding: '11px 14px', fontFamily: 'Quicksand, sans-serif',
                    fontSize: 14, color: B.dark, outline: 'none', marginBottom: 12,
                  }}
                />
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: B.dark, marginBottom: 6 }}>
                  Tu mensaje
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Escribe aquí tu duda, comentario o lo que necesitas para seguir avanzando."
                  maxLength={1000}
                  rows={4}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    border: `2px solid ${B.grayBorder}`, borderRadius: 12,
                    padding: '11px 14px', fontFamily: 'Quicksand, sans-serif',
                    fontSize: 14, color: B.dark, outline: 'none', resize: 'vertical',
                    minHeight: 100,
                  }}
                />
                {contactError && (
                  <div role="alert" style={{
                    marginTop: 10, padding: '9px 12px', borderRadius: 10,
                    background: B.pinkLight, border: `1px solid ${B.pink}`,
                    color: B.dark, fontSize: 12.5, lineHeight: 1.5,
                  }}>
                    {contactError}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <Btn variant="ghost" onClick={closeContactModal} fullWidth disabled={isSendingContactMessage}>
                    Cancelar
                  </Btn>
                  <Btn onClick={handleSendGuideMessage} fullWidth disabled={isSendingContactMessage}>
                    {isSendingContactMessage ? 'Enviando...' : 'Enviar mensaje'}
                  </Btn>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>💌</div>
                <h3 style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
                  fontSize: 20, margin: '0 0 8px', color: B.dark, textAlign: 'center',
                }}>
                  Mensaje enviado
                </h3>
                <p style={{ fontSize: 13.5, color: '#666', margin: '0 0 18px', lineHeight: 1.6, textAlign: 'center' }}>
                  Tu mensaje quedó registrado. Tu guía podrá revisarlo y responderte por correo cuando activemos la respuesta desde la app.
                </p>
                <Btn onClick={closeContactModal} fullWidth>
                  Entendido
                </Btn>
              </>
            )}
          </div>
        </div>
      )}
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
      <LessonCompletionBox lessonId="n1" islandId="start-port" onCompleted={onBack} />
    </div>
  );
}

