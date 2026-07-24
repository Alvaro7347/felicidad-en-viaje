import { useEffect, useMemo, useState } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";
import { useMvp1ProgressContext } from "../context/Mvp1ProgressContext";


const LS = {
  motivation: "archipielago_user_motivation",
  emotions: "archipielago_user_emotions",
  phrase: "archipielago_user_fuel_phrase",
};

const MOTIVATION_EXAMPLES = [
  "me hace feliz.",
  "quiero cantar con mi familia.",
  "necesito un momento para mí.",
  "quiero acompañar mis canciones favoritas.",
  "quiero demostrarme que puedo aprender algo nuevo.",
  "quiero volver a conectar con la música.",
];

const EMOTIONS = [
  "Felicidad",
  "Alegría",
  "Paz",
  "Calma",
  "Ilusión",
  "Confianza",
  "Gratitud",
  "Esperanza",
  "Entusiasmo",
  "Amor",
  "Serenidad",
  "Orgullo",
  "Otra",
];

function readLS(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeLS(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

function joinEmotions(list: string[]): string {
  const items = list.map((e) => e.toLowerCase());
  if (items.length === 0) return "";
  if (items.length === 1) return capitalize(items[0]) + ".";
  const head = items.slice(0, -1).map(capitalize).join(", ");
  const last = items[items.length - 1];
  const conjunction = last.startsWith("i") || last.startsWith("hi") ? "e" : "y";
  return `${head} ${conjunction} ${last}.`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function MissionTwoScreen({
  userName,
  learnerName,
  onBack,
  onNext,
}: {
  userName: string;
  learnerName?: string;
  onBack: () => void;
  onNext: () => void;
}) {
  // "Hola, soy X y quiero aprender ukelele" es la voz del ESTUDIANTE.
  const firstName = useMemo(() => {
    const source = (learnerName ?? userName ?? "").trim();
    const n = source.split(/\s+/)[0];
    return n || "Navegante";
  }, [learnerName, userName]);

  const initialMotivation = readLS(LS.motivation);
  const initialEmotionsRaw = readLS(LS.emotions);
  const initialEmotions: string[] = (() => {
    if (!initialEmotionsRaw) return [];
    try {
      const parsed = JSON.parse(initialEmotionsRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const presetSelected = initialEmotions.filter((e) => EMOTIONS.includes(e) && e !== "Otra");
  const customInitial = initialEmotions.find((e) => !EMOTIONS.includes(e)) ?? "";
  const initialSelected = customInitial ? [...presetSelected, "Otra"] : presetSelected;

  const [motivation, setMotivation] = useState(initialMotivation);
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [otherEmotion, setOtherEmotion] = useState(customInitial);
  const [errors, setErrors] = useState<{ motivation?: string; emotion?: string; other?: string }>({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { completeLesson, isLessonCompleted } = useMvp1ProgressContext();
  const saved = isLessonCompleted("n2") && !editing;

  function toggleEmotion(em: string) {
    setSelected((prev) => (prev.includes(em) ? prev.filter((x) => x !== em) : [...prev, em]));
  }

  const finalEmotions = useMemo(() => {
    const base = selected.filter((e) => e !== "Otra");
    if (selected.includes("Otra") && otherEmotion.trim()) base.push(otherEmotion.trim());
    return base;
  }, [selected, otherEmotion]);

  const fuelPhrase = useMemo(
    () => `Hola, soy ${firstName} y quiero aprender ukelele porque ${motivation.trim()}`.replace(/\.?$/, ".") ,
    [firstName, motivation]
  );

  async function handleSave() {
    const e: typeof errors = {};
    if (!motivation.trim()) e.motivation = "Cuéntanos por qué quieres aprender ukelele.";
    if (selected.length === 0) e.emotion = "Elige al menos una emoción para acompañar tu viaje.";
    if (selected.includes("Otra") && !otherEmotion.trim()) e.other = "Escribe la emoción que quieres guardar.";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSaving(true);
    setSaveError(null);
    writeLS(LS.motivation, motivation.trim());
    writeLS(LS.emotions, JSON.stringify(finalEmotions));
    writeLS(LS.phrase, fuelPhrase);
    const res = await completeLesson("n2", { islandId: "start-port" });
    setSaving(false);
    if (!res.ok) {
      setSaveError(res.error ?? "No pudimos guardar tu avance. Intenta nuevamente.");
      return;
    }
    setEditing(false);
  }

  useEffect(() => {
    if (saved && typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [saved]);

  if (saved) {
    const savedMotivation = readLS(LS.motivation);
    const savedPhrase = readLS(LS.phrase) || `Hola, soy ${firstName} y quiero aprender ukelele porque ${savedMotivation}.`;
    let savedEmotions: string[] = [];
    try {
      const parsed = JSON.parse(readLS(LS.emotions) || "[]");
      if (Array.isArray(parsed)) savedEmotions = parsed;
    } catch {}

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <BackBtn label="Puerto de Inicio" onClick={onBack} />
        <MissionIntroHeader
          title="Cuéntanos de ti"
          subtitle="Este es el motivo que guiará tu viaje musical."
        />

        <Card>
          <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>
            Mi combustible musical
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.5, color: B.dark, margin: "0 0 16px", fontWeight: 600 }}>
            {savedPhrase}
          </p>
          <div style={{ background: B.pinkLight, borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
              Emociones de viaje
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.dark }}>{joinEmotions(savedEmotions)}</div>
          </div>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: "0 0 18px" }}>
            Guardaremos este motivo para recordártelo cuando avances, completes misiones o necesites volver a conectar con tu sonido.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn variant="ghost" onClick={() => setEditing(true)}>Editar mi motivo</Btn>
            <Btn onClick={onNext}>Continuar mi viaje</Btn>
          </div>
        </Card>
        
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    fontFamily: "Quicksand, sans-serif",
    fontSize: 15,
    padding: "12px 14px",
    border: `1.5px solid ${B.grayBorder}`,
    borderRadius: 12,
    background: B.white,
    color: B.dark,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 800,
    fontSize: 14,
    color: B.dark,
    marginBottom: 8,
  };
  const errStyle: React.CSSProperties = { color: B.pink, fontSize: 12, fontWeight: 700, marginTop: 6 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />

      <MissionIntroHeader
        title="Cuéntanos de ti"
        subtitle="Antes de seguir navegando, queremos saber qué te trae a este viaje musical."
      />


      <Card>
        <div style={{ marginBottom: 18 }}>
          <p style={{ margin: "0 0 10px", fontSize: 16, lineHeight: 1.5, color: B.dark, fontWeight: 700 }}>
            Hola, soy <span style={{ color: B.pink }}>{firstName}</span> y quiero aprender ukelele porque...
          </p>
          <label style={labelStyle}>Completa tu motivo</label>
          <textarea
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="Ej: me hace feliz, quiero cantar con mi familia o necesito regalarme un momento para mí."
            rows={4}
            style={{ ...inputStyle, resize: "vertical", minHeight: 96, fontFamily: "Quicksand, sans-serif" }}
          />
          {errors.motivation && <div style={errStyle}>{errors.motivation}</div>}
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: B.grayText, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>
              Inspiración
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {MOTIVATION_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setMotivation(ex)}
                  style={{
                    background: B.gray,
                    border: `1px solid ${B.grayBorder}`,
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontFamily: "Quicksand, sans-serif",
                    color: B.dark,
                    cursor: "pointer",
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>¿Qué emociones positivas acompañan este motivo?</label>
          <div style={{ fontSize: 12, color: B.grayText, marginBottom: 8 }}>Puedes elegir más de una.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EMOTIONS.map((em) => {
              const isSel = selected.includes(em);
              return (
                <button
                  key={em}
                  type="button"
                  onClick={() => toggleEmotion(em)}
                  style={{
                    background: isSel ? B.pink : B.white,
                    color: isSel ? B.white : B.dark,
                    border: `1.5px solid ${isSel ? B.pink : B.grayBorder}`,
                    borderRadius: 999,
                    padding: "8px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "Quicksand, sans-serif",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {em}
                </button>
              );
            })}
          </div>
          {selected.includes("Otra") && (
            <input
              type="text"
              value={otherEmotion}
              onChange={(e) => setOtherEmotion(e.target.value)}
              placeholder="Escribe otra emoción positiva"
              style={{ ...inputStyle, marginTop: 10 }}
            />
          )}
          {errors.emotion && <div style={errStyle}>{errors.emotion}</div>}
          {errors.other && <div style={errStyle}>{errors.other}</div>}
        </div>

        <Btn onClick={handleSave} fullWidth disabled={saving}>
          {saving ? "Guardando…" : "Guardar mi motivo"}
        </Btn>
        {saveError && <div style={{ ...errStyle, marginTop: 10 }}>{saveError}</div>}
      </Card>

    </div>
  );
}
