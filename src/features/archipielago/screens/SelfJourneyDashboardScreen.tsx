import type { CSSProperties } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { useMvp1ProgressContext } from "../context/Mvp1ProgressContext";
import {
  MVP1_LESSON_SEQUENCE,
  MVP1_LOCKED_ISLANDS,
  findMvp1Lesson,
  type IslandId,
} from "../data/mvp1Progress";
import { getIslandProgress } from "../utils/islandProgress";
import { LEARNING_OUTCOMES } from "../data/learningOutcomes";
import { ISLAND_ORDER, ISLAND_TITLES } from "../data/journeyCatalog";

interface Props {
  userName: string;
  onContinue: (nextLessonId: string | null) => void;
  onReview: () => void;
}

const CARD: CSSProperties = {
  background: "#FFFFFF",
  border: `1px solid ${B.grayBorder}`,
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 2px 10px rgba(46,230,174,0.06)",
};

const SECTION_TITLE: CSSProperties = {
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 800,
  fontSize: 16,
  color: B.dark,
  margin: 0,
  marginBottom: 10,
  letterSpacing: "-0.01em",
};

export function SelfJourneyDashboardScreen({ userName, onContinue, onReview }: Props) {
  const progress = useMvp1ProgressContext();
  const firstName = (userName ?? "").trim().split(/\s+/)[0] || "Navegante";

  const totalLessons = MVP1_LESSON_SEQUENCE.length;
  const completedLessons = MVP1_LESSON_SEQUENCE.filter((l) =>
    progress.isLessonCompleted(l.lessonId),
  ).length;
  const totalPct = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  const currentLessonId = progress.getCurrentLessonId();
  const currentEntry = currentLessonId ? findMvp1Lesson(currentLessonId) : null;
  const currentIslandId: IslandId | null = currentEntry?.islandId ?? null;

  // Última completada (último item de la secuencia que esté completado).
  const lastCompleted = [...MVP1_LESSON_SEQUENCE]
    .reverse()
    .find((l) => progress.isLessonCompleted(l.lessonId)) ?? null;

  // Aprendizajes: solo lecciones completadas, en el orden de la secuencia.
  const outcomes = MVP1_LESSON_SEQUENCE
    .filter((l) => progress.isLessonCompleted(l.lessonId) && LEARNING_OUTCOMES[l.lessonId])
    .map((l) => ({ id: l.lessonId, text: LEARNING_OUTCOMES[l.lessonId] }));

  const isMvpComplete = currentLessonId === null && completedLessons > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Bloque 1 — Resumen general */}
      <section style={CARD} aria-labelledby="sj-summary">
        <div style={{ fontSize: 12, color: B.grayText, marginBottom: 4 }}>Mi viaje</div>
        <h2
          id="sj-summary"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: 22,
            color: B.dark,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Hola, {firstName}
        </h2>
        <div style={{ fontSize: 14, color: B.dark, opacity: 0.8, marginTop: 6, lineHeight: 1.5 }}>
          {isMvpComplete
            ? "Completaste tu viaje actual. Puedes revisar todo lo que aprendiste."
            : completedLessons === 0
              ? "Tu viaje musical está por comenzar. Tu primera victoria te espera."
              : `Has completado ${completedLessons} de ${totalLessons} clases.`}
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: B.grayText, marginBottom: 6 }}>
            <span>Progreso total</span>
            <span style={{ color: B.greenDark, fontWeight: 800 }}>{totalPct}%</span>
          </div>
          <div style={{ height: 8, background: "#EAF6F0", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${totalPct}%`, height: "100%", background: B.green, borderRadius: 999, transition: "width 0.4s ease" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <MiniStat label="Isla actual" value={currentIslandId ? ISLAND_TITLES[currentIslandId] : "—"} />
          <MiniStat label="Última clase" value={lastCompleted ? lastCompleted.label : "Aún ninguna"} />
        </div>
      </section>

      {/* Bloque 4 — Próximo paso (destacado, antes de listas largas) */}
      <section
        style={{
          ...CARD,
          background: "linear-gradient(160deg, #EEFBF4 0%, #DFF7EC 100%)",
          border: `1px solid rgba(46,230,174,0.35)`,
        }}
        aria-labelledby="sj-next"
      >
        <h3 id="sj-next" style={SECTION_TITLE}>Tu próximo paso</h3>
        {isMvpComplete ? (
          <>
            <div style={{ fontSize: 14, color: B.dark, lineHeight: 1.55 }}>
              Completaste todas las clases del viaje actual. Sigue explorando tu Archipiélago.
            </div>
            <div style={{ marginTop: 14 }}>
              <Btn onClick={onReview} fullWidth>Revisar mi recorrido</Btn>
            </div>
          </>
        ) : currentEntry ? (
          <>
            <div
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: B.dark,
                lineHeight: 1.35,
              }}
            >
              {currentEntry.label}
            </div>
            <div style={{ fontSize: 12.5, color: B.grayText, marginTop: 4 }}>
              {ISLAND_TITLES[currentEntry.islandId]}
            </div>
            <div style={{ marginTop: 14 }}>
              <Btn onClick={() => onContinue(currentLessonId)} fullWidth>Continuar mi viaje</Btn>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 14, color: B.dark, lineHeight: 1.55 }}>
              Preparando tu próxima clase…
            </div>
            <div style={{ marginTop: 14 }}>
              <Btn onClick={() => onContinue(null)} fullWidth disabled={progress.loading}>
                Continuar mi viaje
              </Btn>
            </div>
          </>
        )}
      </section>

      {/* Bloque 2 — Lo que has aprendido */}
      <section style={CARD} aria-labelledby="sj-outcomes">
        <h3 id="sj-outcomes" style={SECTION_TITLE}>Lo que has aprendido</h3>
        {outcomes.length === 0 ? (
          <div style={{ fontSize: 13.5, color: B.grayText, lineHeight: 1.55 }}>
            Todavía no has completado aprendizajes. Tu primera victoria está por comenzar.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {outcomes.map((o) => (
              <li
                key={o.id}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  fontSize: 13.5,
                  color: B.dark,
                  lineHeight: 1.5,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: B.green,
                    color: B.dark,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    marginTop: 1,
                  }}
                >
                  ✓
                </span>
                <span>{o.text}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bloque 3 — Progreso por isla */}
      <section style={CARD} aria-labelledby="sj-islands">
        <h3 id="sj-islands" style={SECTION_TITLE}>Progreso por isla</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ISLAND_ORDER.map((islandId) => {
            const { completed, total, pct } = getIslandProgress(progress, islandId);
            const isLocked = MVP1_LOCKED_ISLANDS.includes(islandId) || total === 0;
            const isDone = total > 0 && completed === total;
            const isCurrent = !isDone && !isLocked && islandId === currentIslandId;
            const statusLabel = isLocked
              ? "Bloqueada"
              : isDone
                ? "Completada"
                : isCurrent
                  ? "En curso"
                  : completed > 0
                    ? "En curso"
                    : "Por comenzar";
            const statusColor = isLocked
              ? B.grayText
              : isDone
                ? B.greenDark
                : B.dark;
            return (
              <div
                key={islandId}
                style={{
                  border: `1px solid ${B.grayBorder}`,
                  borderRadius: 14,
                  padding: 12,
                  background: isLocked ? "#F7F8FA" : "#FFFFFF",
                  opacity: isLocked ? 0.75 : 1,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <div
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: B.dark,
                    }}
                  >
                    {ISLAND_TITLES[islandId]}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: statusColor }}>
                    {statusLabel}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: B.grayText, marginTop: 4 }}>
                  <span>
                    {total > 0 ? `${completed} / ${total} clases` : "Próximamente"}
                  </span>
                  {total > 0 && <span style={{ color: isDone ? B.greenDark : B.grayText, fontWeight: 700 }}>{pct}%</span>}
                </div>
                {total > 0 && (
                  <div style={{ marginTop: 8, height: 5, background: "#EAF6F0", borderRadius: 999, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: isLocked ? "#C7D3CE" : B.green,
                        borderRadius: 999,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#F5FBF8",
        border: `1px solid ${B.grayBorder}`,
        borderRadius: 12,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 11, color: B.grayText, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 700,
          fontSize: 13.5,
          color: B.dark,
          marginTop: 3,
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {value}
      </div>
    </div>
  );
}
