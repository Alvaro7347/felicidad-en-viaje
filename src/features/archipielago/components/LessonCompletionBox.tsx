import { useMemo, useState } from "react";
import { B } from "../data/brand";
import { Card } from "./Card";
import { Btn } from "./Btn";
import { useMvp1Progress } from "../hooks/useMvp1Progress";
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
  } = useMvp1Progress();

  const effectiveCheckin = useMemo(() => {
    if (checkin) return checkin;
    if (isChordCheckinLesson(lessonId)) return CHORD_CHANGE_CHECKIN;
    return null;
  }, [checkin, lessonId]);

  const alreadyDone = isLessonCompleted(lessonId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

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
        // No bloqueamos el avance por fallo de check-in, pero avisamos.
        logEvent("auth_login_error", { reason: "checkin_save_failed", lessonId });
      }
    }
    const res = await completeLesson(lessonId, { islandId });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "No pudimos guardar tu avance. Intenta nuevamente.");
      return;
    }
    onCompleted?.();
  };

  const showRepeatMessage = !!(answer && NEEDS_REPEAT_ANSWERS.has(answer));

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
        ¿Terminaste esta clase?
      </div>
      <div style={{ fontSize: 13, color: B.dark, lineHeight: 1.6, marginBottom: 14 }}>
        Marca esta clase como completada solo si viste la lección, la practicaste con tu ukelele
        y sientes que entiendes lo suficiente para seguir avanzando.
        <br />
        <br />
        No tiene que salir perfecto. Si tienes dudas, puedes volver a ver la clase o preguntarle a tu profesor.
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
