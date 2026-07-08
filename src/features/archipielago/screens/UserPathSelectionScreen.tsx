import { B } from "../data/brand";

type Props = {
  showParentPath: boolean;
  onChooseLearner: () => void;
  onChooseParent: () => void;
};

export function UserPathSelectionScreen({ showParentPath, onChooseLearner, onChooseParent }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 8 }}>
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(24px, 6.2vw, 30px)",
            fontWeight: 800,
            color: B.dark,
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          ¿Qué viaje quieres iniciar?
        </h1>
        <p style={{ marginTop: 10, color: "#6f6f6d", fontSize: 14.5, lineHeight: 1.5 }}>
          Elige cómo quieres vivir el Archipiélago.
        </p>
      </div>

      <PathCard
        emoji="🌊"
        title="Quiero aprender ukelele"
        description="Para personas que quieren comenzar o retomar su propio viaje musical."
        ctaLabel="Continuar mi viaje"
        onClick={onChooseLearner}
        accent={B.green}
      />

      {showParentPath && (
        <PathCard
          emoji="🌱"
          title="Quiero acompañar el aprendizaje de mi hijo/a"
          description="Ruta piloto para apoderados que acompañan el aprendizaje musical de un niño o niña."
          ctaLabel="Entrar al viaje de Lucía"
          onClick={onChooseParent}
          accent={B.pink}
          tag="Piloto privado"
        />
      )}

      <p style={{ textAlign: "center", fontSize: 12, color: "#bcbcba", margin: "8px 0 0", fontStyle: "italic" }}>
        Cada viaje se adapta a quien lo camina.
      </p>
    </div>
  );
}

function PathCard({
  emoji,
  title,
  description,
  ctaLabel,
  onClick,
  accent,
  tag,
}: {
  emoji: string;
  title: string;
  description: string;
  ctaLabel: string;
  onClick: () => void;
  accent: string;
  tag?: string;
}) {
  return (
    <div
      style={{
        background: B.white,
        border: `1px solid ${B.grayBorder}`,
        borderRadius: 20,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 3px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 28 }}>{emoji}</div>
        {tag && (
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              color: B.pink,
              background: B.pinkLight,
              padding: "4px 9px",
              borderRadius: 999,
            }}
          >
            {tag}
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800,
          fontSize: 18,
          color: B.dark,
          lineHeight: 1.25,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, color: "#6f6f6d", lineHeight: 1.5 }}>{description}</div>
      <button
        type="button"
        onClick={onClick}
        style={{
          marginTop: 4,
          border: "none",
          background: accent,
          color: B.dark,
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800,
          fontSize: 15,
          borderRadius: 12,
          padding: "12px 18px",
          cursor: "pointer",
          boxShadow: `0 5px 14px ${accent}55`,
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
