// Pantalla principal del workspace de moderación.
// - Filtro por lección MVP1.
// - Filtro "Solo sin respuesta".
// - Lista virtualizada simple (limit 50 desde el repo).

import { useMemo, useState } from "react";
import { MVP1_LESSON_SEQUENCE } from "@/features/archipielago/data/mvp1Progress";
import { OFFICIAL_TEAM_NAME } from "@/features/discussions/brand";
import { useModerationQueue } from "../hooks/useModerationQueue";
import { ModerationPostCard } from "./ModerationPostCard";

export function ModerationScreen() {
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [onlyUnanswered, setOnlyUnanswered] = useState(false);

  const {
    posts,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    hidePost,
    hideReply,
    createReply,
    isHidingPost,
    isHidingReply,
    isCreatingReply,
    createReplyError,
  } = useModerationQueue(lessonId);

  const lessonLabelById = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of MVP1_LESSON_SEQUENCE) m.set(l.lessonId, l.label);
    return m;
  }, []);

  const filtered = useMemo(() => {
    if (!onlyUnanswered) return posts;
    return posts.filter((p) => p.visibleReplyCount === 0 && !p.isDeleted && !p.isHidden);
  }, [posts, onlyUnanswered]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          {OFFICIAL_TEAM_NAME}
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Moderación de comunidad</h1>
        <p className="mt-1 text-sm text-slate-600">
          Revisa publicaciones, responde oficialmente y modera cuando sea necesario.
        </p>
      </header>

      <section className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="mod-lesson" className="text-xs font-semibold text-slate-700">
            Clase
          </label>
          <select
            id="mod-lesson"
            value={lessonId ?? ""}
            onChange={(e) => setLessonId(e.target.value === "" ? null : e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          >
            <option value="">Todas las clases</option>
            {MVP1_LESSON_SEQUENCE.map((l) => (
              <option key={l.lessonId} value={l.lessonId}>
                {l.lessonId} · {l.label}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={onlyUnanswered}
            onChange={(e) => setOnlyUnanswered(e.target.checked)}
            className="h-4 w-4"
          />
          Solo sin respuesta
        </label>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          {isFetching && <span>Actualizando…</span>}
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Recargar
          </button>
        </div>
      </section>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando publicaciones…</p>
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-semibold text-rose-800">
            No se pudo cargar la cola de moderación.
          </p>
          <p className="mt-1 text-xs text-rose-700">{error?.message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Reintentar
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No hay publicaciones que coincidan con este filtro.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <ModerationPostCard
              key={post.id}
              post={post}
              lessonLabel={lessonLabelById.get(post.lessonId) ?? ""}
              onHidePost={hidePost}
              onHideReply={hideReply}
              onCreateReply={createReply}
              isHidingPost={isHidingPost}
              isHidingReply={isHidingReply}
              isCreatingReply={isCreatingReply}
              replyError={createReplyError?.message ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
