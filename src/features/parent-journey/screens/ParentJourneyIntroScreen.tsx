import { B } from "@/features/archipielago/data/brand";

type Props = {
  onStart: () => void;
  variant?: "intro" | "dashboard-placeholder";
};

export function ParentJourneyIntroScreen({ onStart, variant = "intro" }: Props) {
  const isDashboard = variant === "dashboard-placeholder";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 12 }}>
      <div
        style={{
          alignSelf: "flex-start",
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          color: B.pink,
          background: B.pinkLight,
          padding: "5px 10px",
          borderRadius: 999,
        }}
      >
        Ruta piloto · Viaje Musical de Lucía
      </div>

      <div style={{ textAlign: "left" }}>
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(24px, 6.4vw, 30px)",
            fontWeight: 800,
            color: B.dark,
            margin: 0,
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
          }}
        >
          {isDashboard ? (
            <>El viaje musical de <span style={{ color: B.green }}>Lucía</span></>
          ) : (
            <>Acompañemos a <span style={{ color: B.green }}>Lucía</span> en su viaje musical</>
          )}
        </h1>
        <p style={{ marginTop: 12, color: "#6f6f6d", fontSize: 14.5, lineHeight: 1.55 }}>
          {isDashboard
            ? "Pronto verás aquí el avance semana a semana: tareas, hitos y notas de Álvaro. Este espacio está en construcción."
            : "Carolina, este es un espacio hecho para ti como apoderada. En pocos pasos vamos a preparar el primer viaje musical de Lucía con Álvaro."}
        </p>
      </div>

      <div
        style={{
          background: B.white,
          border: `1px solid ${B.grayBorder}`,
          borderRadius: 18,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.035)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: B.grayText, letterSpacing: "0.4px", textTransform: "uppercase" }}>
          Plan actual
        </div>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, color: B.dark }}>
          Plan Semanal Presencial
        </div>
        <div style={{ fontSize: 13.5, color: "#6f6f6d" }}>1 clase por semana</div>
        <div style={{ fontSize: 13.5, color: "#6f6f6d" }}>Profesor guía: Álvaro</div>
        <div style={{ fontSize: 13.5, color: "#6f6f6d" }}>Nivel inicial: desde cero</div>
      </div>

      <button
        type="button"
        onClick={onStart}
        style={{
          width: "100%",
          border: "none",
          background: B.green,
          color: B.dark,
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800,
          fontSize: 16,
          borderRadius: 14,
          padding: "15px 20px",
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(46,230,174,0.32)",
        }}
      >
        {isDashboard ? "Editar respuestas del viaje" : "Crear el viaje de Lucía"}
      </button>

      <p style={{ textAlign: "center", fontSize: 12, color: "#bcbcba", margin: 0, fontStyle: "italic" }}>
        Un viaje musical hecho a la medida de Lucía.
      </p>
    </div>
  );
}
