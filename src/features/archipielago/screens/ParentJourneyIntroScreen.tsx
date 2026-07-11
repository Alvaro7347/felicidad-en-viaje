import { useEffect, useState } from "react";
import { B } from "../data/brand";

type Props = {
  onCreate: () => void;
  onBack: () => void;
  onOpenDashboard?: () => void;
};

type SavedJourney = {
  answers?: {
    parent?: { name?: string; relationship?: string };
    student?: { name?: string; experience?: string };
    practice?: { planName?: string };
  };
};

function readSaved(): SavedJourney | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("archipielago_parent_journey_lucia");
    if (!raw) return null;
    return JSON.parse(raw) as SavedJourney;
  } catch {
    return null;
  }
}

export function ParentJourneyIntroScreen({ onCreate, onBack }: Props) {
  const [saved, setSaved] = useState<SavedJourney | null>(null);

  useEffect(() => {
    setSaved(readSaved());
  }, []);

  const student = saved?.answers?.student;
  const parent = saved?.answers?.parent;
  const practice = saved?.answers?.practice;
  const hasSaved = !!(student?.name && student.name.trim());

  const studentName = student?.name?.trim() || "";
  const parentName = parent?.name?.trim() || "";
  const relationship = parent?.relationship?.trim() || "";
  const planName = practice?.planName?.trim() || "Plan Semanal Presencial";
  const experience = student?.experience?.trim() || "Desde cero";

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
          {hasSaved ? (
            <>
              Viaje musical de <span style={{ color: B.green }}>{studentName}</span>
            </>
          ) : (
            <>Crea el viaje musical de tu hijo/a</>
          )}
        </h1>
        <p style={{ marginTop: 10, color: "#6f6f6d", fontSize: 14.5, lineHeight: 1.55 }}>
          {hasSaved
            ? `${parentName || "Aquí"}, aquí podrás acompañar el aprendizaje musical paso a paso.`
            : "En pocos pasos prepararemos una experiencia para acompañar su aprendizaje musical."}
        </p>
      </div>

      {hasSaved ? (
        <InfoCard title="Datos del viaje">
          <Row label="Alumno/a" value={studentName} />
          {parentName && <Row label="Apoderado/a" value={parentName} />}
          {relationship && <Row label="Relación" value={relationship} />}
          <Row label="Profesor guía" value="Álvaro" />
          <Row label="Plan" value={planName} />
          <Row label="Nivel inicial" value={experience} />
          <Row label="Estado" value="Preparando primera clase" />
        </InfoCard>
      ) : (
        <InfoCard title="Cómo funciona">
          <p style={{ margin: 0, fontSize: 13.5, color: "#6f6f6d", lineHeight: 1.55 }}>
            Este espacio permitirá que el apoderado pueda revisar avances, tareas, observaciones y acompañar el proceso sin sentirse saturado.
          </p>
        </InfoCard>
      )}

      <InfoCard title="Cómo funciona este viaje">
        <Block emoji="🎶" title="Aprende" text="Vive las clases, practica y desbloquea pequeñas victorias musicales." />
        <Block emoji="🌱" title="Acompañas" text="Puedes revisar tareas, observar avances y compartir comentarios desde casa." />
        <Block emoji="🧭" title="El profesor guía" text="Registra lo visto en clase, define tareas y ajusta el camino según el avance real." />
      </InfoCard>

      {!hasSaved && (
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
          Crear viaje musical
        </button>
      )}

      {hasSaved && (
        <button
          type="button"
          onClick={() => {
            try {
              window.localStorage.removeItem("archipielago_parent_journey_lucia");
              window.localStorage.setItem("archipielago_selected_profile", "maria_jose");
            } catch {}
            setSaved(null);
            onCreate();
          }}
          style={{
            alignSelf: "center",
            border: "none",
            background: "transparent",
            color: B.grayText,
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            padding: "6px 10px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Recrear viaje musical
        </button>
      )}

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
