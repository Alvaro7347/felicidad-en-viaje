import { B } from "../data/brand";

type Props = {
  onCreate: () => void;
};


// Nota: esta pantalla se muestra únicamente cuando Supabase confirma que la
// cuenta no tiene un viaje acompañado registrado (parent_journeys sin fila).
// La fuente de verdad es Supabase; no leemos localStorage aquí.
export function ParentJourneyIntroScreen({ onCreate }: Props) {
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
          Crea el viaje musical de tu hijo/a
        </h1>
        <p style={{ marginTop: 10, color: "#6f6f6d", fontSize: 14.5, lineHeight: 1.55 }}>
          En pocos pasos prepararemos una experiencia para acompañar su aprendizaje musical.
        </p>
      </div>

      <InfoCard title="Cómo funciona">
        <p style={{ margin: 0, fontSize: 13.5, color: "#6f6f6d", lineHeight: 1.55 }}>
          Este espacio permitirá que el apoderado pueda revisar avances, tareas, observaciones y acompañar el proceso sin sentirse saturado.
        </p>
      </InfoCard>

      <InfoCard title="Cómo funciona este viaje">
        <Block emoji="🎶" title="Aprende" text="Vive las clases, practica y desbloquea pequeñas victorias musicales." />
        <Block emoji="🌱" title="Acompañas" text="Puedes revisar tareas, observar avances y compartir comentarios desde casa." />
        <Block emoji="🧭" title="El profesor guía" text="Registra lo visto en clase, define tareas y ajusta el camino según el avance real." />
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
        Comenzar configuración
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
