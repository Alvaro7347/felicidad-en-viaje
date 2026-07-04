import { B } from "../data/brand";
import type { MusicalFuel } from "../data/musicalFuel";

type Variant = "compact" | "celebration" | "return";

export function MusicalFuelReminder({
  variant,
  fuel,
  contextText,
}: {
  variant: Variant;
  fuel: MusicalFuel;
  contextText?: string;
}) {
  if (!fuel.fuelPhrase) return null;

  const copy = {
    compact: {
      title: "Tu combustible musical",
      hint: contextText ?? "Recuerda por qué empezaste este viaje.",
      phrasePrefix: "",
    },
    celebration: {
      title: "Una victoria conectada con tu motivo",
      hint: contextText ?? "Cada acorde también construye esa emoción que elegiste para tu viaje.",
      phrasePrefix: "Hoy avanzaste un paso más hacia esto:",
    },
    return: {
      title: "Tu motivo sigue aquí",
      hint: contextText ?? "No importa si pasaron algunos días. Puedes volver desde donde estás.",
      phrasePrefix: "",
    },
  }[variant];

  const isCompact = variant === "compact";

  return (
    <aside
      style={{
        background: isCompact ? B.white : B.pinkLight,
        border: `1px solid ${isCompact ? B.grayBorder : "transparent"}`,
        borderLeft: `3px solid ${B.green}`,
        borderRadius: 14,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
      aria-label="Combustible musical"
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "1.1px",
          textTransform: "uppercase",
          color: B.pink,
        }}
      >
        {copy.title}
      </div>

      {copy.phrasePrefix && (
        <div style={{ fontSize: 12, color: B.grayText, lineHeight: 1.5 }}>{copy.phrasePrefix}</div>
      )}

      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.5,
          color: B.dark,
          fontWeight: 600,
        }}
      >
        {fuel.fuelPhrase}
      </p>

      {fuel.emotions.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
          {fuel.emotions.map((em) => (
            <span
              key={em}
              style={{
                background: B.greenLight,
                color: B.greenDark,
                fontSize: 10,
                fontWeight: 800,
                borderRadius: 999,
                padding: "2px 8px",
                letterSpacing: "0.3px",
              }}
            >
              {em}
            </span>
          ))}
        </div>
      )}

      <div style={{ fontSize: 11, color: B.grayText, lineHeight: 1.5, marginTop: 2 }}>{copy.hint}</div>
    </aside>
  );
}
