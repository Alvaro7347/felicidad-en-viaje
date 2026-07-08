import { B } from "@/features/archipielago/data/brand";
import type { ParentOnboardingAnswers } from "./ParentOnboardingScreen";

type Props = {
  answers: ParentOnboardingAnswers;
  savedTo: "supabase" | "local" | null;
  onGoJourney: () => void;
};

export function ParentJourneySummaryScreen({ answers, savedTo, onGoJourney }: Props) {
  const nivel = answers.student.experience || "Desde cero";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 12 }}>
      <div style={{ fontSize: 46, textAlign: "center" }}>🌱</div>
      <h1
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 26,
          fontWeight: 800,
          color: B.dark,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        Viaje musical de <span style={{ color: B.green }}>Lucía</span> creado
      </h1>
      <p style={{ margin: 0, textAlign: "center", color: "#6f6f6d", fontSize: 14.5, lineHeight: 1.55 }}>
        Gracias, Carolina. Con esta información, Álvaro podrá preparar mejor la primera clase de Lucía y acompañar su avance semana a semana.
      </p>

      <div
        style={{
          background: B.white,
          border: `1px solid ${B.grayBorder}`,
          borderRadius: 18,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.035)",
        }}
      >
        <Row label="Alumna" value={answers.student.name || "Lucía"} />
        <Row label="Plan" value="Semanal presencial" />
        <Row label="Nivel inicial" value={nivel} />
        <Row label="Acompañamiento" value={answers.practice.companion || "Según respuestas de Carolina"} />
      </div>

      {savedTo === "local" && (
        <div
          style={{
            background: B.pinkLight,
            color: "#7a2a54",
            borderRadius: 12,
            padding: "10px 12px",
            fontSize: 12.5,
            lineHeight: 1.45,
          }}
        >
          Guardado localmente en este dispositivo (prototipo). La próxima iteración lo persistirá en la nube.
        </div>
      )}

      <button
        type="button"
        onClick={onGoJourney}
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
        Ir al viaje musical de Lucía
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: B.grayText, letterSpacing: "0.4px", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 14.5, color: B.dark, fontWeight: 600, textAlign: "right" }}>{value}</div>
    </div>
  );
}
