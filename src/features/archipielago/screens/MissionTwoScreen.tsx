import { useEffect, useMemo, useState } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { Tag } from "../components/Tag";
import { BackBtn } from "../components/BackBtn";

const LS = {
  name: "archipielago_user_name",
  motivation: "archipielago_user_motivation",
  emotion: "archipielago_user_emotion",
  phrase: "archipielago_user_fuel_phrase",
};

const MOTIVATION_EXAMPLES = [
  "Quiero cantar con mi familia.",
  "Quiero regalarme un momento para mí.",
  "Quiero sentir que puedo aprender algo nuevo.",
  "Quiero acompañar mis canciones favoritas.",
  "Quiero volver a conectar con la música.",
];

const EMOTIONS = [
  "Alegría",
  "Calma",
  "Ilusión",
  "Confianza",
  "Familia",
  "Superación",
  "Libertad",
  "Nostalgia",
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

export function MissionTwoScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const initialName = readLS(LS.name);
  const initialMotivation = readLS(LS.motivation);
  const initialEmotionRaw = readLS(LS.emotion);
  const initialIsPreset = EMOTIONS.includes(initialEmotionRaw) && initialEmotionRaw !== "Otra";

  const [name, setName] = useState(initialName === "Navegante" ? "" : initialName);
  const [motivation, setMotivation] = useState(initialMotivation);
  const [emotion, setEmotion] = useState<string>(
    initialEmotionRaw ? (initialIsPreset ? initialEmotionRaw : "Otra") : ""
  );
  const [otherEmotion, setOtherEmotion] = useState(initialIsPreset ? "" : initialEmotionRaw);

  const hasSaved = Boolean(initialName && initialMotivation && initialEmotionRaw);
  const [saved, setSaved] = useState(hasSaved);
  const [errors, setErrors] = useState<{ name?: string; motivation?: string; emotion?: string; other?: string }>({});

  const finalEmotion = emotion === "Otra" ? otherEmotion.trim() : emotion;
  const fuelPhrase = useMemo(
    () => `Soy ${name.trim()} y quiero aprender ukelele porque ${motivation.trim()}`,
    [name, motivation]
  );

  const savedName = readLS(LS.name);
  const savedMotivation = readLS(LS.motivation);
  const savedEmotion = readLS(LS.emotion);
  const savedPhrase = readLS(LS.phrase) || `Soy ${savedName} y quiero aprender ukelele porque ${savedMotivation}`;

  function handleSave() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Escribe tu nombre para continuar.";
    if (!motivation.trim()) e.motivation = "Cuéntanos por qué quieres aprender ukelele.";
    if (!emotion) e.emotion = "Elige una emoción para acompañar tu viaje.";
    if (emotion === "Otra" && !otherEmotion.trim()) e.other = "Escribe la emoción que quieres guardar.";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    writeLS(LS.name, name.trim());
    writeLS(LS.motivation, motivation.trim());
    writeLS(LS.emotion, finalEmotion);
    writeLS(LS.phrase, fuelPhrase);
    setSaved(true);
  }

  useEffect(() => {
    if (saved) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [saved]);

  if (saved) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <BackBtn label="Puerto de Inicio" onClick={onBack} />
        <Card style={{ background: B.green, padding: "18px 22px" }}>
          <Tag color="pink">Tu combustible · guardado</Tag>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "clamp(20px,4vw,26px)", margin: "10px 0 6px", color: B.dark }}>
            Cuéntanos de ti
          </h2>
          <p style={{ fontSize: 14, color: "#555", margin: 0, lineHeight: 1.55 }}>
            Este es el motivo que guiará tu viaje musical.
          </p>
        </Card>

        <Card>
          <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>
            Mi combustible musical
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.5, color: B.dark, margin: "0 0 16px", fontWeight: 600 }}>
            {savedPhrase}
          </p>
          <div style={{ background: B.pinkLight, borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
              Emoción de viaje
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.dark }}>{savedEmotion}</div>
          </div>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: "0 0 18px" }}>
            Guardaremos este motivo para recordártelo cuando avances, completes misiones o necesites volver a conectar con tu sonido.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn variant="ghost" onClick={() => setSaved(false)}>Editar mi motivo</Btn>
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

      <Card style={{ background: B.green, padding: "18px 22px" }}>
        <Tag color="pink">Reflexión · 3 min</Tag>
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "clamp(20px,4vw,26px)", margin: "10px 0 6px", color: B.dark }}>
          Cuéntanos de ti
        </h2>
        <p style={{ fontSize: 14, color: "#555", margin: 0, lineHeight: 1.55 }}>
          Antes de seguir navegando, queremos saber qué te trae a este viaje musical.
        </p>
      </Card>

      <Card style={{ background: B.pinkLight, borderColor: "transparent" }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: B.dark }}>
          Tu motivo será el <strong>combustible</strong> de este viaje. Lo recordaremos en momentos importantes para ayudarte a volver a conectar con tu sonido.
        </p>
      </Card>

      <Card>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>¿Cómo te llamas?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Juanita Pérez"
            style={inputStyle}
          />
          {errors.name && <div style={errStyle}>{errors.name}</div>}
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>¿Por qué quieres aprender a tocar ukelele?</label>
          <textarea
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="Ej: Quiero aprender porque me hace feliz, porque quiero cantar con mi familia o porque necesito un momento para mí."
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
          <label style={labelStyle}>¿Qué emoción hay detrás de ese motivo?</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EMOTIONS.map((em) => {
              const selected = emotion === em;
              return (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmotion(em)}
                  style={{
                    background: selected ? B.pink : B.white,
                    color: selected ? B.white : B.dark,
                    border: `1.5px solid ${selected ? B.pink : B.grayBorder}`,
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
          {emotion === "Otra" && (
            <input
              type="text"
              value={otherEmotion}
              onChange={(e) => setOtherEmotion(e.target.value)}
              placeholder="Escribe tu emoción"
              style={{ ...inputStyle, marginTop: 10 }}
            />
          )}
          {errors.emotion && <div style={errStyle}>{errors.emotion}</div>}
          {errors.other && <div style={errStyle}>{errors.other}</div>}
        </div>

        <Btn onClick={handleSave} fullWidth>
          Guardar mi motivo
        </Btn>
      </Card>
    </div>
  );
}
