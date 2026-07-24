import { useState } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";
import { LessonCompletionBox } from "../components/LessonCompletionBox";
import { LessonDiscussionSection } from "@/features/discussions/components/LessonDiscussionSection";

const MILESTONES = [
  { icon: "🧭", text: "Conocer a tu guía y entender cómo será el viaje." },
  { icon: "🌺", text: "Descubrir la historia y el sentido del ukelele." },
  { icon: "🎸", text: "Reconocer las partes principales del ukelele." },
  { icon: "🤲", text: "Sostener tu ukelele sin tensión." },
  { icon: "🎵", text: "Afinar tu ukelele antes de tocar." },
];

type ChecklistKey =
  | "knowsParts"
  | "knowsTuning"
  | "holdsWithoutTension"
  | "understandsStepByStep";

const CHECKLIST: { key: ChecklistKey; label: string }[] = [
  { key: "knowsParts", label: "Reconozco las partes principales del ukelele." },
  { key: "knowsTuning", label: "Sé que debo afinar mi ukelele antes de tocar." },
  { key: "holdsWithoutTension", label: "Sé cómo sostenerlo sin tensión." },
  { key: "understandsStepByStep", label: "Entiendo que puedo avanzar paso a paso." },
];

const READINESS = [
  { value: 1, label: "Aún inseguro" },
  { value: 2, label: "Con dudas" },
  { value: 3, label: "Más o menos listo" },
  { value: 4, label: "Bastante listo" },
  { value: 5, label: "Muy listo" },
];

const EMOTIONS = ["Tranquilidad", "Curiosidad", "Alegría", "Nervios", "Orgullo"];

const FRICTIONS = [
  "Recordar las partes",
  "Afinar el ukelele",
  "Tomarlo con comodidad",
  "Creer que puedo lograrlo",
  "Nada por ahora",
];

const STORAGE_KEY = "archipielago_start_port_closure";

export function MissionNineScreen({ onBack }: { onBack: () => void }) {
  const [checklist, setChecklist] = useState<Record<ChecklistKey, boolean>>({
    knowsParts: false,
    knowsTuning: false,
    holdsWithoutTension: false,
    understandsStepByStep: false,
  });
  const [readinessScore, setReadinessScore] = useState<number | null>(null);
  const [emotionBeforeNextIsland, setEmotion] = useState<string | null>(null);
  const [mainFriction, setMainFriction] = useState<string | null>(null);
  const [closed, setClosed] = useState(false);
  const [showEncounterMilestone, setShowEncounterMilestone] = useState(false);

  const canClose =
    readinessScore !== null && emotionBeforeNextIsland !== null && mainFriction !== null;

  const handleClose = () => {
    if (!canClose) return;
    const payload = {
      completedAt: new Date().toISOString(),
      unit: "Puerto de Inicio",
      readinessScore,
      emotionBeforeNextIsland,
      mainFriction,
      checklist,
      badge: "Navegante del Puerto",
      readyForNextIsland: true,
    };
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch {
      // silencioso: no bloquear la ceremonia de cierre
    }
    setClosed(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─────────── Estado final: premio ───────────
  if (closed) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <BackBtn label="Puerto de Inicio" onClick={onBack} />
        <MissionIntroHeader
          title="Puerto de Inicio completado"
          subtitle="Una pausa breve antes de tu primera melodía."
        />

        <Card style={{ background: B.greenLight, borderColor: B.green }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
            <div style={{ fontSize: 56, lineHeight: 1 }} aria-hidden="true">⛵</div>
            <div style={{
              display: "inline-block",
              background: B.dark, color: B.green,
              fontWeight: 800, fontSize: 11,
              padding: "5px 12px", borderRadius: 999,
              letterSpacing: "1.2px", textTransform: "uppercase",
            }}>
              Insignia desbloqueada
            </div>
            <h2 style={{
              margin: 0,
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 24, color: B.dark, letterSpacing: "-0.01em",
            }}>
              Navegante del Puerto
            </h2>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: B.dark, maxWidth: 440 }}>
              Completaste tu preparación inicial. Ya conoces tu instrumento, sabes cómo sostenerlo
              y sabes cómo prepararlo para sonar mejor.
            </p>
          </div>
        </Card>

        <Card>
          <p style={{
            margin: 0, fontSize: 15, lineHeight: 1.6, color: B.dark,
            fontStyle: "italic", textAlign: "center",
          }}>
            “No necesitas dominarlo todo para avanzar. Solo necesitas estar listo
            para dar el siguiente paso.”
          </p>
        </Card>

        <Card style={{ background: B.pinkLight, borderColor: B.pink }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 22 }} aria-hidden="true">✨</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: B.dark, fontWeight: 600 }}>
              Microvictoria desbloqueada: estás listo para zarpar hacia tus primeras melodías.
            </p>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
          <Btn variant="primary" fullWidth onClick={onBack}>
            Volver al Puerto de Inicio
          </Btn>
          <Btn variant="ghost" fullWidth onClick={() => setClosed(false)}>
            Revisar mi preparación
          </Btn>
        </div>
      </div>
    );
  }

  // ─────────── Hito narrativo: descubrimiento de la promesa del encuentro ───────────
  if (showEncounterMilestone) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <BackBtn label="Puerto de Inicio" onClick={onBack} />
        <MissionIntroHeader
          title="Listo para zarpar"
          subtitle="Antes de entrar a tu primera melodía, revisemos lo que ya lograste."
        />
        <Card style={{ background: B.greenLight, border: `1.5px solid ${B.green}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }} aria-hidden="true">🎁</span>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 16, color: B.dark, lineHeight: 1.25 }}>
              Hay algo que quiero contarte...
            </div>
          </div>
          <div style={{ fontSize: 13.5, color: B.dark, lineHeight: 1.6, marginBottom: 14 }}>
            Cuando completes la Isla del Pulso tendremos nuestro primer encuentro en vivo.
            <br /><br />
            Ese día podremos conocernos, responder tus dudas y celebrar todo lo que ya habrás conseguido.
            <br /><br />
            Pero por ahora... disfruta el viaje.
          </div>
          <Btn fullWidth onClick={onBack}>
            Continuar
          </Btn>
        </Card>
      </div>
    );
  }

  // ─────────── Estado principal ───────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Listo para zarpar"
        subtitle="Antes de entrar a tu primera melodía, revisemos lo que ya lograste."
      />

      <Card>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: B.dark }}>
          Has recorrido el Puerto de Inicio. No necesitas dominarlo todo:
          solo reconocer que ya tienes lo esencial para comenzar tu primera
          melodía con más confianza.
        </p>
      </Card>

      {/* Resumen de la unidad */}
      <Card>
        <h3 style={{
          margin: "0 0 14px",
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 17, color: B.dark, letterSpacing: "-0.01em",
        }}>
          En el Puerto de Inicio aprendiste a:
        </h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {MILESTONES.map((m, i) => (
            <li key={i} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              background: B.gray, borderRadius: 14, padding: "10px 12px",
            }}>
              <div style={{ fontSize: 20, lineHeight: 1.2 }} aria-hidden="true">{m.icon}</div>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: B.dark }}>{m.text}</div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Checklist autoafirmación */}
      <Card>
        <h3 style={{
          margin: "0 0 4px",
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 17, color: B.dark, letterSpacing: "-0.01em",
        }}>
          Antes de avanzar, confirma:
        </h3>
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: B.grayText }}>
          Opcional. Marca lo que sientas verdadero para ti.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CHECKLIST.map((item) => {
            const active = checklist[item.key];
            return (
              <button
                key={item.key}
                onClick={() => setChecklist((c) => ({ ...c, [item.key]: !c[item.key] }))}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  textAlign: "left", cursor: "pointer",
                  background: active ? B.greenLight : B.white,
                  border: `1.5px solid ${active ? B.green : B.grayBorder}`,
                  borderRadius: 14, padding: "10px 12px",
                  fontFamily: "Quicksand, sans-serif",
                  transition: "background 0.15s, border-color 0.15s",
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: 7,
                  background: active ? B.green : B.white,
                  border: `1.5px solid ${active ? B.green : B.grayBorder}`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: B.dark, fontWeight: 900, fontSize: 13, flexShrink: 0,
                }} aria-hidden="true">
                  {active ? "✓" : ""}
                </span>
                <span style={{ fontSize: 14, color: B.dark, lineHeight: 1.4 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Medición */}
      <Card>
        <h3 style={{
          margin: "0 0 4px",
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 17, color: B.dark, letterSpacing: "-0.01em",
        }}>
          ¿Cómo llegas a la próxima isla?
        </h3>
        <p style={{ margin: "0 0 18px", fontSize: 12.5, color: B.grayText }}>
          3 preguntas breves antes de cerrar el puerto.
        </p>

        {/* Readiness */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.dark, marginBottom: 10 }}>
            ¿Qué tan listo te sientes para comenzar tu primera melodía?
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {READINESS.map((r) => {
              const active = readinessScore === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => setReadinessScore(r.value)}
                  style={{
                    flex: "1 1 auto", minWidth: 52,
                    padding: "10px 6px",
                    borderRadius: 12,
                    border: `1.5px solid ${active ? B.pink : B.grayBorder}`,
                    background: active ? B.pink : B.white,
                    color: active ? B.white : B.dark,
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: 800, fontSize: 15,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  title={r.label}
                >
                  {r.value}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: B.grayText, textAlign: "center" }}>
            {readinessScore ? READINESS.find(r => r.value === readinessScore)?.label : "Elige una opción del 1 al 5"}
          </div>
        </div>

        {/* Emoción */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.dark, marginBottom: 10 }}>
            ¿Qué emoción tienes ahora?
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EMOTIONS.map((e) => {
              const active = emotionBeforeNextIsland === e;
              return (
                <button
                  key={e}
                  onClick={() => setEmotion(e)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1.5px solid ${active ? B.green : B.grayBorder}`,
                    background: active ? B.green : B.white,
                    color: B.dark,
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: 700, fontSize: 13.5,
                    cursor: "pointer",
                  }}
                >
                  {e}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fricción */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.dark, marginBottom: 10 }}>
            ¿Qué sientes que todavía te cuesta más?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FRICTIONS.map((f) => {
              const active = mainFriction === f;
              return (
                <button
                  key={f}
                  onClick={() => setMainFriction(f)}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: `1.5px solid ${active ? B.pink : B.grayBorder}`,
                    background: active ? B.pinkLight : B.white,
                    color: B.dark,
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: 600, fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Btn variant="primary" fullWidth disabled={!canClose} onClick={handleClose}>
        {canClose ? "Cerrar Puerto de Inicio" : "Responde estas 3 preguntas para cerrar el puerto"}
      </Btn>
      <LessonCompletionBox lessonId="n9" islandId="start-port" onCompleted={() => setShowEncounterMilestone(true)} />
      <LessonDiscussionSection lessonId="n9" />
    </div>
  );
}
