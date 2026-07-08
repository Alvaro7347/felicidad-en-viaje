import { B } from "../data/brand";

type Props = {
  onContinue: () => void;
};

export function ParentJourneyCreatedScreen({ onContinue }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 8 }}>
      <div
        style={{
          alignSelf: "flex-start",
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          color: B.green,
          background: B.greenLight,
          padding: "5px 10px",
          borderRadius: 999,
        }}
      >
        Viaje creado
      </div>

      <div>
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(24px, 6.4vw, 30px)",
            fontWeight: 800,
            color: B.dark,
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          Viaje musical de <span style={{ color: B.green }}>Lucía</span> creado
        </h1>
        <p style={{ marginTop: 10, color: "#6f6f6d", fontSize: 14.5, lineHeight: 1.55 }}>
          Gracias, Carolina. Con esta información, Álvaro podrá preparar mejor la primera clase
          de Lucía y acompañar su avance semana a semana.
        </p>
      </div>

      <div
        style={{
          background: B.white,
          border: `1px solid ${B.grayBorder}`,
          borderRadius: 18,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.035)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: B.grayText,
            letterSpacing: "0.6px",
            textTransform: "uppercase",
          }}
        >
          Resumen
        </div>
        <Row label="Alumna" value="Lucía" />
        <Row label="Apoderada" value="Carolina" />
        <Row label="Profesor guía" value="Álvaro" />
        <Row label="Plan" value="Semanal presencial" />
        <Row label="Nivel inicial" value="Desde cero" />
      </div>

      <button
        type="button"
        onClick={onContinue}
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
      <div style={{ fontSize: 13, color: B.grayText }}>{label}</div>
      <div style={{ fontSize: 14, color: B.dark, fontWeight: 600, textAlign: "right" }}>{value}</div>
    </div>
  );
}
