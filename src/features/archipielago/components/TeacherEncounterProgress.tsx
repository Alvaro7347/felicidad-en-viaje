import { useMemo } from "react";
import { useMvp1ProgressContext } from "../context/Mvp1ProgressContext";
import { MVP1_LESSON_SEQUENCE, type IslandId } from "../data/mvp1Progress";

// Territorios que cuentan hacia el desbloqueo del encuentro en vivo.
const ELIGIBLE_ISLANDS: IslandId[] = ["start-port", "first-melodies", "pulse"];
const ACCENT = "#2EE6AE";

const ELIGIBLE_LESSON_IDS = MVP1_LESSON_SEQUENCE
  .filter((l) => ELIGIBLE_ISLANDS.includes(l.islandId) && l.isMvp1Enabled)
  .map((l) => l.lessonId);

export function TeacherEncounterProgress() {
  const { isLessonCompleted, loading, loadError } = useMvp1ProgressContext();

  const pct = useMemo(() => {
    const total = ELIGIBLE_LESSON_IDS.length;
    if (total === 0) return 0;
    const seen = new Set<string>();
    for (const id of ELIGIBLE_LESSON_IDS) {
      if (isLessonCompleted(id)) seen.add(id);
    }
    return Math.min(100, Math.max(0, Math.round((seen.size / total) * 100)));
  }, [isLessonCompleted]);

  // Placeholder mínimo mientras carga: mantiene la altura para evitar saltos.
  if (loading) {
    return <div aria-hidden style={{ height: 36, marginTop: 8, marginBottom: 4 }} />;
  }
  // En error, ocultar silenciosamente.
  if (loadError) return null;

  const unlocked = pct >= 100;
  const title = unlocked ? "Encuentro desbloqueado" : "Tu encuentro con el profesor";
  const sub = unlocked
    ? "Ya puedes agendar tu encuentro con el profesor"
    : `${pct}% del camino completado`;

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        marginTop: 8,
        marginBottom: 4,
        padding: "0 2px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          flexWrap: "wrap",
          fontSize: 12,
          lineHeight: 1.35,
        }}
      >
        <span style={{ color: ACCENT, fontSize: 11 }} aria-hidden>✦</span>
        <span style={{ fontWeight: 600, color: "#2b2b2b" }}>{title}</span>
        <span style={{ color: "#8a8a8a", fontSize: 11 }}>{sub}</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Progreso hacia el encuentro con el profesor"
        style={{
          marginTop: 6,
          height: 3,
          width: "100%",
          background: "rgba(0,0,0,0.06)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: ACCENT,
            borderRadius: 999,
            transition: "width 400ms ease",
          }}
        />
      </div>
    </div>
  );
}
