// Sección "Preguntas y comentarios de la clase".
// Componente autónomo: recibe únicamente `lessonId` y resuelve todo por sí.
// NO conoce progreso, navegación ni estado de finalización de clase.
import { useCallback, useEffect, useRef, useState } from "react";
import { B } from "@/features/archipielago/data/brand";
import { useLessonDiscussion } from "../hooks/useLessonDiscussion";
import type { LessonDiscussionPost, LessonDiscussionErrorCode } from "../types";
import { LessonDiscussionError } from "../types";
import { DiscussionPostForm, resolveDiscussionErrorMessage } from "./DiscussionPostForm";
import { DiscussionPostItem } from "./DiscussionPostItem";
import { DiscussionEmptyState } from "./DiscussionEmptyState";
import { DiscussionSkeleton } from "./DiscussionSkeleton";
import { DiscussionErrorState } from "./DiscussionErrorState";
import { DiscussionPrivacyNotice } from "./DiscussionPrivacyNotice";

export type LessonDiscussionSectionProps = {
  lessonId: string;
};

function extractCode(err: unknown): LessonDiscussionErrorCode | null {
  if (err instanceof LessonDiscussionError) return err.code;
  return null;
}

export function LessonDiscussionSection({ lessonId }: LessonDiscussionSectionProps) {
  const d = useLessonDiscussion(lessonId);
  const [pendingApplauseIds, setPendingApplauseIds] = useState<Set<string>>(() => new Set());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const successTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (successTimeoutRef.current !== null) {
        window.clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = null;
      }
    };
  }, []);

  const scheduleSuccessClear = useCallback(() => {
    if (successTimeoutRef.current !== null) {
      window.clearTimeout(successTimeoutRef.current);
    }
    successTimeoutRef.current = window.setTimeout(() => {
      successTimeoutRef.current = null;
      if (isMountedRef.current) setSuccessMsg(null);
    }, 4000);
  }, []);

  const handleSubmit = async (input: { postType: "comment"; content: string }) => {
    setSuccessMsg(null);
    await d.createPost(input);
    if (!isMountedRef.current) return;
    setSuccessMsg("Tu publicación fue enviada.");
    scheduleSuccessClear();
  };

  const handleToggleApplause = (post: LessonDiscussionPost) => {
    // No permitir doble clic sobre el mismo post mientras esté pendiente.
    if (pendingApplauseIds.has(post.id)) return;
    setPendingApplauseIds((prev) => {
      const next = new Set(prev);
      next.add(post.id);
      return next;
    });
    const action = post.hasCurrentUserReacted ? d.removeApplause : d.addApplause;
    void action(post.id).finally(() => {
      if (!isMountedRef.current) return;
      setPendingApplauseIds((prev) => {
        if (!prev.has(post.id)) return prev;
        const next = new Set(prev);
        next.delete(post.id);
        return next;
      });
    });
  };

  const handleDelete = async (postId: string) => {
    await d.deleteOwnPost(postId);
  };

  return (
    <section
      aria-labelledby={`lesson-discussion-${lessonId}`}
      style={{
        display: "grid",
        gap: 16,
        background: B.gray,
        border: `1px solid ${B.grayBorder}`,
        borderRadius: 24,
        padding: 16,
      }}
    >
      <header style={{ display: "grid", gap: 4 }}>
        <h2
          id={`lesson-discussion-${lessonId}`}
          style={{ margin: 0, color: B.dark, fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}
        >
          Comunidad de esta clase
        </h2>
        <p style={{ margin: 0, color: B.grayText, fontSize: 14, lineHeight: 1.55 }}>
          Comparte tus dudas, descubrimientos o experiencias con otras personas que están
          aprendiendo esta misma clase.
        </p>
      </header>

      <DiscussionPrivacyNotice />

      {successMsg && (
        <p
          role="status"
          aria-live="polite"
          style={{
            margin: 0,
            color: B.greenDark,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {successMsg}
        </p>
      )}

      {!d.currentUserHasActivePost && !d.isLoading && !d.isError && (
        <DiscussionPostForm
          onSubmit={handleSubmit}
          isSubmitting={d.isCreatingPost}
          errorCode={extractCode(d.createPostError)}
        />
      )}

      {d.isLoading && <DiscussionSkeleton />}

      {d.isError && !d.isLoading && (
        <DiscussionErrorState onRetry={() => void d.refetch()} isRetrying={d.isFetching} />
      )}

      {!d.isLoading && !d.isError && d.posts.length === 0 && <DiscussionEmptyState />}

      {!d.isLoading && !d.isError && d.posts.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
          {d.posts.map((post) => (
            <li key={post.id}>
              <DiscussionPostItem
                post={post}
                onToggleApplause={handleToggleApplause}
                isApplausePending={pendingApplauseIds.has(post.id)}
                onDelete={handleDelete}
                isDeleting={d.isDeletingPost}
                deleteError={resolveDiscussionErrorMessage(extractCode(d.deleteOwnPostError))}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
