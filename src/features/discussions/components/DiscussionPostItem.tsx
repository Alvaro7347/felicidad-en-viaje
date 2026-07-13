import { useState } from "react";
import { B } from "@/features/archipielago/data/brand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { LessonDiscussionPost } from "../types";
import { DiscussionReplyItem } from "./DiscussionReplyItem";
import { formatDiscussionDate } from "./formatDate";

type Props = {
  post: LessonDiscussionPost;
  onToggleApplause: (post: LessonDiscussionPost) => void;
  isApplausePending: boolean;
  onDelete: (postId: string) => Promise<void> | void;
  isDeleting: boolean;
  deleteError?: string | null;
};

export function DiscussionPostItem({
  post,
  onToggleApplause,
  isApplausePending,
  onDelete,
  isDeleting,
  deleteError,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isThisApplauding = isApplausePending;
  const applauseCountLabel =
    post.applauseCount === 0
      ? "Me inspira"
      : `${post.applauseCount} ${post.applauseCount === 1 ? "aplauso" : "aplausos"}`;

  const handleDelete = async () => {
    try {
      await onDelete(post.id);
      setConfirmOpen(false);
    } catch {
      // deleteError se muestra y el diálogo permanece abierto.
    }
  };

  return (
    <article
      style={{
        background: B.white,
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <header
        style={{
          display: "flex",
          gap: 10,
          alignItems: "baseline",
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        <span style={{ fontWeight: 700, color: B.dark, fontSize: 15, letterSpacing: -0.1 }}>
          {post.authorDisplayName}
        </span>
        <span style={{ fontSize: 12, color: B.grayText }}>
          {formatDiscussionDate(post.createdAt)}
        </span>
      </header>

      <p
        style={{
          margin: 0,
          color: B.dark,
          fontSize: 15,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {post.content}
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: 16,
        }}
      >
        <button
          type="button"
          onClick={() => onToggleApplause(post)}
          disabled={isThisApplauding}
          aria-pressed={post.hasCurrentUserReacted}
          aria-label={
            post.hasCurrentUserReacted
              ? `Retirar aplauso (${post.applauseCount})`
              : `Aplaudir esta publicación (${post.applauseCount})`
          }
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 999,
            border: `1px solid ${post.hasCurrentUserReacted ? B.pink : B.grayBorder}`,
            background: post.hasCurrentUserReacted ? B.pinkLight : B.white,
            color: post.hasCurrentUserReacted ? B.pink : B.dark,
            fontWeight: 600,
            fontSize: 13,
            cursor: isThisApplauding ? "wait" : "pointer",
            minHeight: 38,
            transition: "background 120ms ease",
          }}
        >
          <span aria-hidden>👏</span>
          <span>{applauseCountLabel}</span>
        </button>

        {post.isCurrentUserAuthor && (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              color: B.grayText,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              padding: "8px 6px",
              minHeight: 38,
            }}
          >
            Eliminar
          </button>
        )}
      </div>

      {post.officialReplies.length > 0 && (
        <div style={{ marginTop: 14 }}>
          {post.officialReplies.map((r) => (
            <DiscussionReplyItem key={r.id} reply={r} />
          ))}
        </div>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar tu publicación</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará tu publicación de esta clase. Después podrás publicar una nueva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p role="alert" style={{ color: B.pink, margin: 0, fontSize: 14 }}>
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando…" : "Eliminar publicación"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
