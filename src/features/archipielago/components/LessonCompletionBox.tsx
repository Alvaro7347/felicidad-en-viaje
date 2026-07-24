import { useMemo, useState, type ReactNode } from "react";
import { B } from "../data/brand";
import { Card } from "./Card";
import { Btn } from "./Btn";
import { useMvp1ProgressContext } from "../context/Mvp1ProgressContext";
import { useExperienceMode } from "../context/ExperienceModeContext";
import {
  CHORD_CHANGE_CHECKIN,
  isChordCheckinLesson,
  type IslandId,
} from "../data/mvp1Progress";

interface Props {
  lessonId: string;
  islandId: IslandId;
  onCompleted?: () => void;
  /** Override manual del check-in. Si no se pasa y la clase es crítica,
   *  se usa el check-in de cambio de acorde. */
  checkin?: { question: string; options: readonly string[] };
}

const NEEDS_REPEAT_ANSWERS = new Set([
  "Más o menos, quiero repetir",
  "Todavía no",
]);

// Mensajes narrativos que preparan al alumno para el encuentro en vivo.
// Se muestran UNA sola vez, justo después de completar la clase indicada.
// Si la clase ya estaba completada, no se muestran (ver `alreadyDone` abajo).
interface Milestone {
  emoji: string;
  title: string;
  body: ReactNode;
  cta: string;
}
const MILESTONES: Record<string, Milestone> = {
  // Hito 2 — final de Primeras Melodías: recordatorio antes del territorio que desbloquea el encuentro
  m10: {
    emoji: "🏝",
    title: "Tu próxima isla guarda algo especial.",
    body: (
      <>
        Ahora comienza la Isla del Pulso.
        <br /><br />
        Cuando la completes, desbloquearás nuestro primer encuentro en vivo.
      </>
    ),
    cta: "Comenzar la Isla del Pulso",
  },
  // Hito 3 — final de Isla del Pulso: celebración y desbloqueo final
  p11: {
    emoji: "🎉",
    title: "¡Lo lograste!",
    body: (
      <>
        Completaste la Isla del Pulso.
        <br /><br />
        Estoy muy feliz por todo lo que avanzaste. Ahora llegó el momento de conocernos.
        <br /><br />
        Ya puedes agendar tu encuentro en vivo conmigo.
      </>
    ),
    cta: "Agendar mi encuentro",
  },
};


export function LessonCompletionBox({
  lessonId,
  islandId,
  onCompleted,
  checkin,
}: Props) {
  const {
    isLessonCompleted,
    completeLesson,
    submitCheckin,
    logEvent,
  } = useMvp1ProgressContext();
  const { mode } = useExperienceMode();
  const isAccompanied = mode === "accompanied_learning";

  const effectiveCheckin = useMemo(() => {
    if (checkin) return checkin;
    if (isChordCheckinLesson(lessonId)) {
      if (isAccompanied) {
        return {
          question: "¿Cómo viste a Lucía realizando el cambio de acorde?",
          options: CHORD_CHANGE_CHECKIN.options,
        };
      }
      return CHORD_CHANGE_CHECKIN;
    }
    return null;
  }, [checkin, lessonId, isAccompanied]);

  const alreadyDone = isLessonCompleted(lessonId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<Milestone | null>(null);

  const handleComplete = async () => {
    setError(null);
    if (effectiveCheckin && !answer) {
      setError("Selecciona una opción antes de continuar.");
      return;
    }
    setSaving(true);
    if (effectiveCheckin && answer) {
      const cr = await submitCheckin({
        lessonId,
        islandId,
        question: effectiveCheckin.question,
        answer,
      });
      if (!cr.ok) {
        logEvent("checkin_save_error", {
          lesson_id: lessonId,
          island_id: islandId,
          reason: cr.error ?? "unknown",
        });
      }
    }
    const res = await completeLesson(lessonId, { islandId });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "No pudimos guardar tu avance. Intenta nuevamente.");
      return;
    }
    // Si esta clase tiene un mensaje narrativo, se muestra una única vez aquí
    // (esta rama sólo se ejecuta cuando la clase NO estaba completada antes,
    // porque el early-return de `alreadyDone` cubre las re-visitas).
    const m = MILESTONES[lessonId];
    if (m) {
      setMilestone(m);
      return;
    }
    onCompleted?.();
  };

  const showRepeatMessage = !!(answer && NEEDS_REPEAT_ANSWERS.has(answer));

  if (milestone) {
    return (
      <Card style={{ background: B.greenLight, border: `1.5px solid ${B.green}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>{milestone.emoji}</span>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 16, color: B.dark, lineHeight: 1.25 }}>
            {milestone.title}
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: B.dark, lineHeight: 1.6, marginBottom: 14 }}>
          {milestone.body}
        </div>
        <Btn fullWidth onClick={() => { setMilestone(null); onCompleted?.(); }}>
          {milestone.cta}
        </Btn>
      </Card>
    );
  }

  if (alreadyDone) {

    return (
      <Card style={{ background: B.greenLight, border: `1.5px solid ${B.green}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 15, color: B.dark }}>
            Clase completada
          </div>
        </div>
        <div style={{ fontSize: 13, color: B.dark, lineHeight: 1.5 }}>
          Ya marcaste esta clase como completada. Puedes volver a verla cuando quieras.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 15, color: B.dark, marginBottom: 8 }}>
        {isAccompanied ? "¿Completaron esta clase?" : "¿Terminaste esta clase?"}
      </div>
      <div style={{ fontSize: 13, color: B.dark, lineHeight: 1.6, marginBottom: 14 }}>
        {isAccompanied ? (
          <>
            Marca esta clase como completada cuando hayan visto la lección y Lucía haya realizado
            la práctica propuesta con su ukelele.
            <br />
            <br />
            No tiene que salir perfecto. Si quedan dudas, pueden volver a ver la clase o preguntar a su profesor.
          </>
        ) : (
          <>
            Marca esta clase como completada solo si viste la lección, la practicaste con tu ukelele
            y sientes que entiendes lo suficiente para seguir avanzando.
            <br />
            <br />
            No tiene que salir perfecto. Si tienes dudas, puedes volver a ver la clase o preguntarle a tu profesor.
          </>
        )}
      </div>

      {effectiveCheckin && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: B.dark, marginBottom: 8 }}>
            {effectiveCheckin.question}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {effectiveCheckin.options.map((opt) => {
              const selected = answer === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { setAnswer(opt); setError(null); }}
                  disabled={saving}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: `1.5px solid ${selected ? B.pink : B.grayBorder}`,
                    background: selected ? B.pinkLight : B.white,
                    color: B.dark,
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {showRepeatMessage && (
            <div style={{ marginTop: 10, padding: 12, background: B.gray, borderRadius: 12, fontSize: 12, color: B.dark, lineHeight: 1.5 }}>
              Te recomendamos repetir esta clase antes de seguir. No necesitas hacerlo perfecto,
              pero sí entender el movimiento.
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ color: B.pink, fontSize: 13, marginBottom: 10 }}>{error}</div>
      )}

      <Btn fullWidth onClick={handleComplete} disabled={saving}>
        {saving ? "Guardando avance…" : "Marcar clase como completada"}
      </Btn>
    </Card>
  );
}
