// Sección "Preguntas y comentarios de la clase".
// Componente autónomo: recibe únicamente `lessonId` y resuelve todo por sí.
// NO conoce progreso, navegación ni estado de finalización de clase.
import { useState } from "react";
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
  const [applauseTargetId, setApplauseTargetId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (input: { postType: "question" | "comment"; content: string }) => {
    setSuccessMsg(null);
    await d.createPost(input);
    setSuccessMsg("Tu publicación fue enviada.");
    window.setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleToggleApplause = (post: LessonDiscussionPost) => {
    setApplauseTargetId(post.id);
    const action = post.hasCurrentUserReacted ? d.removeApplause : d.addApplause;
    void action(post.id).finally(() => {
      // Limpiar el target al terminar (éxito o error), pero solo si sigue siendo el mismo.
      setApplauseTargetId((prev) => (prev === post.id ? null : prev));
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
          style={{ margin: 0, color: B.dark, fontSize: 20, fontWeight: 800 }}
        >
          Preguntas y comentarios de la clase
        </h2>
        <p style={{ margin: 0, color: B.dark, fontSize: 14, lineHeight: 1.5 }}>
          Comparte una duda o una experiencia relacionada con esta clase.
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
        <DiscussionErrorState
          onRetry={() => void d.refetch()}
          isRetrying={d.isFetching}
        />
      )}

      {!d.isLoading && !d.isError && d.posts.length === 0 && <DiscussionEmptyState />}

      {!d.isLoading && !d.isError && d.posts.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
          {d.posts.map((post) => (
            <li key={post.id}>
              <DiscussionPostItem
                post={post}
                onToggleApplause={handleToggleApplause}
                isTogglingApplause={d.isTogglingApplause}
                applauseTargetId={applauseTargetId}
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
