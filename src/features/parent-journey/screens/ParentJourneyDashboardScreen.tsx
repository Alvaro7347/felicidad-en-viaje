import { useMvp1ProgressContext } from "@/features/archipielago/context/Mvp1ProgressContext";
import { B } from "@/features/archipielago/data/brand";
import {
  MVP1_LESSON_SEQUENCE,
  findMvp1Lesson,
  type IslandId,
} from "@/features/archipielago/data/mvp1Progress";

type Props = {
  studentName?: string;
  parentName?: string;
  onBack?: () => void;
};

const ISLAND_LABELS: Record<IslandId, string> = {
  "start-port": "Puerto de Inicio",
  "first-melodies": "Isla de Primeras Melodías",
  "pulse": "Isla del Pulso",
  "rhythm": "Isla del Ritmo",
  "music": "Isla Musical",
  "joy": "Isla de la Alegría",
  "chords": "Isla de los Acordes",
  "strumming": "Isla del Rasgueo",
  "songs": "Isla de las Canciones",
};

function islandLabel(id?: IslandId | null) {
  if (!id) return "—";
  return ISLAND_LABELS[id] ?? "—";
}

export function ParentJourneyDashboardScreen({ studentName, parentName, onBack }: Props) {
  const progress = useMvp1ProgressContext();
  const s = studentName?.trim() || "tu hijo/a";
  const p = parentName?.trim() || "";

  if (progress.loading) {
    return (
      <Shell>
        <StatusText>Preparando el viaje musical…</StatusText>
      </Shell>
    );
  }

  if (progress.loadError) {
    return (
      <Shell>
        <StatusText>No pudimos cargar el avance. Intenta recargar la aplicación.</StatusText>
      </Shell>
    );
  }

  const totalLessons = MVP1_LESSON_SEQUENCE.length;
  const completedLessons = progress.completedLessonIds.size;
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const currentLessonId = progress.getCurrentLessonId();
  const currentEntry = currentLessonId ? findMvp1Lesson(currentLessonId) : null;
  const currentIsland = currentEntry?.islandId ?? null;

  // Última lección completada según orden de MVP1_LESSON_SEQUENCE
  let lastCompletedEntry: (typeof MVP1_LESSON_SEQUENCE)[number] | null = null;
  for (const entry of MVP1_LESSON_SEQUENCE) {
    if (progress.completedLessonIds.has(entry.lessonId)) {
      lastCompletedEntry = entry;
    }
  }

  return (
    <Shell>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 8 }}>
        <Chip>Acompañamiento musical</Chip>

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
            Viaje musical de <span style={{ color: B.green }}>{s}</span>
          </h1>
          <p style={{ marginTop: 10, color: "#6f6f6d", fontSize: 14.5, lineHeight: 1.55 }}>
            {p ? `${p}, acompaña` : "Acompaña"} su avance, revisa lo que está aprendiendo y conoce lo que viene después.
          </p>
        </div>

        {/* Avance general */}
        <Card>
          <CardTitle>Avance general</CardTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ProgressRing percentage={percentage} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, color: B.dark, fontSize: 16 }}>
                {completedLessons} de {totalLessons} clases completadas
              </div>
              <div style={{ fontSize: 13, color: B.grayText }}>
                {completedLessons === 0
                  ? "El viaje acaba de comenzar."
                  : `Isla actual: ${islandLabel(currentIsland)}`}
              </div>
              {currentEntry && (
                <div style={{ fontSize: 13, color: B.grayText }}>
                  Próxima clase: {currentEntry.label}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Próxima clase */}
        <Card>
          <CardTitle>Próxima clase</CardTitle>
          {currentEntry ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: B.dark, fontSize: 15 }}>
                {currentEntry.label}
              </div>
              <div style={{ fontSize: 13, color: B.grayText }}>
                {islandLabel(currentEntry.islandId)}
              </div>
              <PillLabel>Lista para comenzar</PillLabel>
            </div>
          ) : (
            <div style={{ fontSize: 14, color: B.dark }}>Recorrido MVP1 completado</div>
          )}
        </Card>

        {/* Último avance */}
        <Card>
          <CardTitle>Último avance</CardTitle>
          {lastCompletedEntry ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: B.dark, fontSize: 15 }}>
                {lastCompletedEntry.label}
              </div>
              <div style={{ fontSize: 13, color: B.grayText }}>
                {islandLabel(lastCompletedEntry.islandId)}
              </div>
              <PillLabel tone="done">Completada</PillLabel>
            </div>
          ) : (
            <div style={{ fontSize: 14, color: B.grayText }}>
              Aquí aparecerá la última clase completada.
            </div>
          )}
        </Card>

        {/* Esta semana */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SectionTitle>Esta semana</SectionTitle>

          <MiniCard title="Clase trabajada">
            {lastCompletedEntry
              ? `${lastCompletedEntry.label} · ${islandLabel(lastCompletedEntry.islandId)}`
              : "Se actualizará con la última clase completada."}
          </MiniCard>

          <MiniCard title="Actividad para casa" badge="Próximamente">
            Aquí aparecerá la práctica sugerida después de cada clase.
          </MiniCard>

          <MiniCard title="Informe semanal" badge="Próximamente">
            Resumen del profesor sobre avances, logros y aspectos a reforzar.
          </MiniCard>
        </div>

        {/* Control del viaje */}
        <Card>
          <CardTitle>Control del viaje</CardTitle>
          <p style={{ margin: 0, fontSize: 13.5, color: "#6f6f6d", lineHeight: 1.55 }}>
            Desde aquí podrás revisar el recorrido completo, conocer las clases realizadas y ver lo que viene después.
          </p>
          <div style={{ fontSize: 12.5, color: B.grayText, fontStyle: "italic" }}>
            El acceso al recorrido se habilitará en la siguiente iteración.
          </div>
        </Card>

        {onBack && (
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
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function StatusText({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "40px 16px",
        textAlign: "center",
        color: B.grayText,
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
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
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 800,
        color: B.grayText,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Space Grotesk, sans-serif",
        fontSize: 15,
        fontWeight: 800,
        color: B.dark,
        marginTop: 4,
      }}
    >
      {children}
    </div>
  );
}

function MiniCard({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: B.white,
        border: `1px solid ${B.grayBorder}`,
        borderRadius: 14,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 14, color: B.dark }}>
          {title}
        </div>
        {badge && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              color: B.grayText,
              background: B.gray,
              padding: "3px 8px",
              borderRadius: 999,
            }}
          >
            {badge}
          </div>
        )}
      </div>
      <div style={{ fontSize: 13, color: "#6f6f6d", lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

function PillLabel({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "done" }) {
  const bg = tone === "done" ? B.greenLight : B.gray;
  const color = tone === "done" ? B.greenDark : B.grayText;
  return (
    <div
      style={{
        alignSelf: "flex-start",
        fontSize: 10.5,
        fontWeight: 800,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        color,
        background: bg,
        padding: "4px 9px",
        borderRadius: 999,
      }}
    >
      {children}
    </div>
  );
}

function ProgressRing({ percentage }: { percentage: number }) {
  const size = 72;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percentage));
  const dash = (clamped / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={B.gray} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={B.green}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeDashoffset={c / 4}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800,
          color: B.dark,
          fontSize: 15,
        }}
      >
        {clamped}%
      </div>
    </div>
  );
}
