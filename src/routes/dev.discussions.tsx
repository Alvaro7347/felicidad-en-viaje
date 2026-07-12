// Ruta TEMPORAL de desarrollo aislado para Commit 4.
// - No enlazada desde ninguna pantalla productiva.
// - Deshabilitada en producción (muestra 404 informativo).
// - A eliminar en el Commit 5.
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { LessonDiscussionSection } from "@/features/discussions/components/LessonDiscussionSection";
import { MVP1_LESSON_IDS } from "@/features/archipielago/data/mvp1Progress";
import { B } from "@/features/archipielago/data/brand";

export const Route = createFileRoute("/dev/discussions")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Dev · Discusiones (aislado)" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DevDiscussionsPreview,
});

function DevDiscussionsPreview() {
  const [lessonId, setLessonId] = useState<string>("n1");
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "24px 16px 64px",
        fontFamily: "Quicksand, sans-serif",
        color: B.dark,
      }}
    >
      <h1 style={{ fontSize: 22, margin: "0 0 12px", fontWeight: 800 }}>
        Preview aislado · Discusiones de clase
      </h1>
      <p style={{ margin: "0 0 12px", fontSize: 14, color: B.grayText }}>
        Ruta de desarrollo. No integrada en clases productivas.
      </p>
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
          fontSize: 14,
        }}
      >
        <span style={{ fontWeight: 700 }}>Lección:</span>
        <select
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: `1px solid ${B.grayBorder}`,
          }}
        >
          {MVP1_LESSON_IDS.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>
      <LessonDiscussionSection lessonId={lessonId} />
    </main>
  );
}
