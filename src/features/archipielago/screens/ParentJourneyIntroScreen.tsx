import { B } from "../data/brand";

type Props = {
  onCreate: () => void;
  onBack: () => void;
};

export function ParentJourneyIntroScreen({ onCreate, onBack }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 8 }}>
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
        Ruta piloto · Apoderados
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
          Viaje Musical de <span style={{ color: B.green }}>Lucía</span>
        </h1>
        <p style={{ marginTop: 10, color: "#6f6f6d", fontSize: 14.5, lineHeight: 1.55 }}>
          Carolina, aquí podrás acompañar el aprendizaje musical de Lucía paso a paso.
        </p>
      </div>

      <InfoCard title="Datos del viaje">
        <Row label="Alumna" value="Lucía" />
        <Row label="Apoderada" value="Carolina" />
        <Row label="Profesor guía" value="Álvaro" />
        <Row label="Plan" value="Semanal presencial" />
        <Row label="Nivel inicial" value="Desde cero" />
        <Row label="Estado" value="Preparando primera clase" />
      </InfoCard>

      <InfoCard title="Cómo funciona este viaje">
        <Block emoji="🎶" title="Lucía aprende" text="Vive las clases, practica y desbloquea pequeñas victorias musicales." />
        <Block emoji="🌱" title="Carolina acompaña" text="Puede revisar tareas, observar avances y compartir comentarios desde casa." />
        <Block emoji="🧭" title="Álvaro guía" text="Registra lo visto en clase, define tareas y ajusta el camino según el avance real." />
      </InfoCard>

      <button
        type="button"
        onClick={onCreate}
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
        Crear el viaje de Lucía
      </button>

      <button
        type="button"
        onClick={onBack}
        style={{
          width: "100%",
          border: `1px solid ${B.grayBorder}`,
          background: "transparent",
          color: B.grayText,
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 600,
          fontSize: 14,
          borderRadius: 12,
          padding: "11px 16px",
          cursor: "pointer",
        }}
      >
        Volver
      </button>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
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
        {title}
      </div>
      {children}
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

function Block({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</div>
      <div>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 14.5, color: B.dark }}>
          {title}
        </div>
        <div style={{ fontSize: 13.5, color: "#6f6f6d", lineHeight: 1.5 }}>{text}</div>
      </div>
    </div>
  );
}
