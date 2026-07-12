import { useState } from "react";
import { B } from "../data/brand";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";
import { LessonCompletionBox } from "../components/LessonCompletionBox";

const VIDEO_ID = "_ysGIgRumis";
const VIDEO_THUMB = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;

export function MissionScreen({ onBack }: { onBack: () => void }) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Partes del Ukelele"
        subtitle="Antes de tocar, conocerás las partes de tu compañero musical."
      />

      {/* 3. Card principal de video */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ position: "relative", height: 220, background: "#111" }}>
          <img
            src={VIDEO_THUMB}
            alt="Conoce tu compañero de viaje"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)" }} />
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, color: B.white }}>
            <div style={{
              display: "inline-block",
              background: "rgba(46,230,174,0.95)",
              color: B.dark,
              fontWeight: 800, fontSize: 11,
              padding: "4px 10px", borderRadius: 999,
              letterSpacing: "0.6px", textTransform: "uppercase",
              marginBottom: 8,
            }}>
              Video · 3 min
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              Conoce tu compañero de viaje
            </div>
            <div style={{ fontSize: 12, opacity: 0.92, marginTop: 2, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              Un recorrido breve por las partes del ukelele.
            </div>
          </div>
          <button
            type="button"
            aria-label="Reproducir video de partes del ukelele"
            onClick={() => setShowVideoModal(true)}
            style={{
              position: "absolute", left: "50%", top: "46%",
              transform: "translate(-50%, -50%)",
              background: "transparent", border: "none", padding: 0, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0.9, transition: "transform 0.2s ease, opacity 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.06)"; e.currentTarget.style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)"; e.currentTarget.style.opacity = "0.9"; }}
          >
            <svg width="76" height="54" viewBox="0 0 68 48" aria-hidden="true" style={{ filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.4))" }}>
              <rect x="0" y="0" width="68" height="48" rx="14" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M27 15 L47 24 L27 33 Z" fill="#FFFFFF" />
            </svg>
          </button>
        </div>
      </Card>

      {/* 4. Card explicativa */}
      <Card>
        <p style={{ margin: 0, color: "#666", lineHeight: 1.7, fontSize: 13 }}>
          En esta clase conocerás las partes principales del ukelele y para qué sirve cada una. No necesitas memorizarlo todo ahora: solo empezar a familiarizarte con tu instrumento.
        </p>
      </Card>

      {/* 5. Qué aprenderás */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.greenDark, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>
          Qué aprenderás
        </div>
        <div style={{ display: "grid", gap: 10, fontSize: 13, lineHeight: 1.6, color: "#666" }}>
          <div>🎸 Qué son el cuerpo, el mástil y el clavijero.</div>
          <div>🎼 Para qué sirven las cuerdas, trastes y clavijas.</div>
          <div>🗺️ Cómo ubicar las partes que usarás al tocar.</div>
          <div>💛 Por qué conocer tu ukelele te ayuda a tocar con más confianza.</div>
        </div>
      </Card>

      {/* 6. Partes principales */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.greenDark, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>
          Partes principales
        </div>
        <div style={{ display: "grid", gap: 10, fontSize: 13, lineHeight: 1.6, color: "#666" }}>
          <div><strong style={{ color: B.dark }}>Cuerpo:</strong> donde nace gran parte del sonido.</div>
          <div><strong style={{ color: B.dark }}>Mástil:</strong> donde apoyas los dedos para formar notas y acordes.</div>
          <div><strong style={{ color: B.dark }}>Trastes:</strong> pequeñas divisiones que te ayudan a encontrar sonidos.</div>
          <div><strong style={{ color: B.dark }}>Clavijas:</strong> sirven para afinar las cuerdas.</div>
          <div><strong style={{ color: B.dark }}>Cuerdas:</strong> las que vibran para producir el sonido.</div>
        </div>
      </Card>

      {/* 7. Cierre emocional */}
      <Card style={{ background: B.greenLight }}>
        <p style={{ margin: 0, color: B.dark, lineHeight: 1.7, fontSize: 13 }}>
          Tu ukelele no es solo un objeto: será tu compañero de viaje. Mientras más lo conoces, más confianza tendrás para hacerlo sonar.
        </p>
      </Card>


      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video: Partes del ukelele"
          onClick={() => setShowVideoModal(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 12, zIndex: 1000, maxHeight: "100dvh", overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 900, background: B.white,
              borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              display: "flex", flexDirection: "column",
              maxHeight: "calc(100dvh - 24px)",
            }}
          >
            <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: B.dark, lineHeight: 1.2 }}>Partes del Ukelele</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 2, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Conoce tu compañero de viaje.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                aria-label="Cerrar video"
                style={{
                  background: "transparent", border: "1px solid #ddd", borderRadius: 999,
                  padding: "6px 12px", fontSize: 12, fontWeight: 700, color: B.dark, cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Cerrar
              </button>
            </div>
            <div style={{
              flex: "1 1 auto", minHeight: 0, background: "#000",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "100%", maxHeight: "100%", aspectRatio: "16 / 9" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
                  title="Partes del Ukelele"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <LessonCompletionBox lessonId="n5" islandId="start-port" onCompleted={onBack} />
    </div>
  );
}
