// Tarjeta administrativa de un post: muestra estado, respuestas oficiales
// (incluidas las ocultas), acciones (ocultar post, ocultar respuestas,
// responder).

import { useState } from "react";
import { formatDiscussionDate } from "@/features/discussions/components/formatDate";
import type { ModerationPost } from "../services/moderationRepository";
import { ConfirmActionDialog } from "./ConfirmActionDialog";
import { OfficialReplyForm } from "./OfficialReplyForm";

interface Props {
  post: ModerationPost;
  lessonLabel: string;
  onHidePost: (input: { postId: string; lessonId: string }) => Promise<unknown>;
  onHideReply: (input: { replyId: string; lessonId: string }) => Promise<unknown>;
  onCreateReply: (input: { postId: string; lessonId: string; content: string }) => Promise<unknown>;
  isHidingPost: boolean;
  isHidingReply: boolean;
  isCreatingReply: boolean;
  replyError: string | null;
}

export function ModerationPostCard({
  post,
  lessonLabel,
  onHidePost,
  onHideReply,
  onCreateReply,
  isHidingPost,
  isHidingReply,
  isCreatingReply,
  replyError,
}: Props) {
  const [confirmHidePost, setConfirmHidePost] = useState(false);
  const [confirmHideReplyId, setConfirmHideReplyId] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const statusBadges: string[] = [];
  if (post.isDeleted) statusBadges.push("Eliminado por autor");
  if (post.isHidden) statusBadges.push("Oculto por moderación");
  const hasVisibleReply = post.visibleReplyCount > 0;
  if (!hasVisibleReply && !post.isDeleted && !post.isHidden) statusBadges.push("Sin respuesta");
  const canReply = !post.isHidden && !post.isDeleted;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono text-slate-400">{post.lessonId}</span>
            <span aria-hidden>·</span>
            <span>{lessonLabel}</span>
            <span aria-hidden>·</span>
            <span
              className={
                post.postType === "question"
                  ? "rounded bg-amber-100 px-1.5 py-0.5 text-amber-800"
                  : "rounded bg-sky-100 px-1.5 py-0.5 text-sky-800"
              }
            >
              {post.postType === "question" ? "Pregunta" : "Comentario"}
            </span>
            <span aria-hidden>·</span>
            <span>{formatDiscussionDate(post.createdAt)}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900">{post.authorDisplayName}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {statusBadges.map((b) => (
            <span
              key={b}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
            >
              {b}
            </span>
          ))}
        </div>
      </header>

      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{post.content}</p>

      {post.replies.length > 0 && (
        <ul className="mt-4 space-y-2 border-l-2 border-teal-200 pl-3">
          {post.replies.map((reply) => (
            <li
              key={reply.id}
              className={
                reply.isHidden
                  ? "rounded-lg bg-slate-50 p-2 text-sm text-slate-500 opacity-70"
                  : "rounded-lg bg-teal-50 p-2 text-sm text-slate-800"
              }
            >
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-semibold text-teal-800">
                  Familia SoundKeleles · {formatDiscussionDate(reply.createdAt)}
                </span>
                {reply.isHidden ? (
                  <span className="text-[11px] italic">Oculta</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmHideReplyId(reply.id)}
                    disabled={isHidingReply}
                    className="text-[11px] font-medium text-rose-600 hover:underline disabled:opacity-50"
                  >
                    Ocultar respuesta
                  </button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap">{reply.content}</p>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-4 flex flex-wrap gap-2">
        {canReply && (
          <button
            type="button"
            onClick={() => setShowReplyForm((v) => !v)}
            className="rounded-lg border border-teal-300 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50"
          >
            {showReplyForm ? "Cancelar respuesta" : "Responder oficialmente"}
          </button>
        )}
        {!post.isHidden && (
          <button
            type="button"
            onClick={() => setConfirmHidePost(true)}
            disabled={isHidingPost}
            className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
          >
            Ocultar publicación
          </button>
        )}
      </footer>

      {showReplyForm && canReply && (
        <OfficialReplyForm
          postId={post.id}
          lessonId={post.lessonId}
          isPending={isCreatingReply}
          errorMessage={replyError}
          onSubmit={async (input) => {
            await onCreateReply(input);
            setShowReplyForm(false);
          }}
        />
      )}

      <ConfirmActionDialog
        open={confirmHidePost}
        title="Ocultar publicación"
        description="La publicación dejará de ser visible para los estudiantes. Esta acción no se puede revertir desde esta pantalla."
        confirmLabel="Ocultar"
        destructive
        isPending={isHidingPost}
        onCancel={() => setConfirmHidePost(false)}
        onConfirm={async () => {
          try {
            await onHidePost({ postId: post.id, lessonId: post.lessonId });
          } finally {
            setConfirmHidePost(false);
          }
        }}
      />

      <ConfirmActionDialog
        open={confirmHideReplyId !== null}
        title="Ocultar respuesta oficial"
        description="La respuesta dejará de ser visible para los estudiantes. Esta acción no se puede revertir desde esta pantalla."
        confirmLabel="Ocultar"
        destructive
        isPending={isHidingReply}
        onCancel={() => setConfirmHideReplyId(null)}
        onConfirm={async () => {
          const id = confirmHideReplyId;
          if (!id) return;
          try {
            await onHideReply({ replyId: id, lessonId: post.lessonId });
          } finally {
            setConfirmHideReplyId(null);
          }
        }}
      />
    </article>
  );
}
