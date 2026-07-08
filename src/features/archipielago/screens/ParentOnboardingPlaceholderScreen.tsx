import { B } from "../data/brand";

type Props = { onBack: () => void };

export function ParentOnboardingPlaceholderScreen({ onBack }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 8, textAlign: "center" }}>
      <div style={{ fontSize: 44 }}>🛠️</div>
      <h1
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 24,
          fontWeight: 800,
          color: B.dark,
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        Preparando el viaje de Lucía
      </h1>
      <p style={{ margin: 0, color: "#6f6f6d", fontSize: 14.5, lineHeight: 1.55 }}>
        Próximamente aquí Carolina podrá completar el perfil inicial de Lucía y sus expectativas como apoderada.
      </p>
      <button
        type="button"
        onClick={onBack}
        style={{
          width: "100%",
          border: `1px solid ${B.grayBorder}`,
          background: B.white,
          color: B.dark,
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 700,
          fontSize: 15,
          borderRadius: 12,
          padding: "12px 18px",
          cursor: "pointer",
          marginTop: 6,
        }}
      >
        Volver
      </button>
    </div>
  );
}
