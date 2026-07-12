// Dominio: discusiones por clase (preguntas y comentarios) del MVP1.
//
// Los tipos expuestos a la UI usan camelCase aunque Supabase persista en
// snake_case. La traducción se realiza dentro del repositorio.

export type DiscussionPostType = "question" | "comment";

/** Respuesta oficial del equipo SoundKeleles a una publicación. */
export type LessonDiscussionReply = {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  /** user_id del miembro de equipo que respondió. */
  authorUserId: string;
};

/** Publicación visible (pregunta o comentario) de una clase. */
export type LessonDiscussionPost = {
  id: string;
  lessonId: string;
  postType: DiscussionPostType;
  content: string;
  /** Primer nombre calculado por trigger `set_post_author_display_name`. */
  authorDisplayName: string;
  createdAt: string;
  updatedAt: string;
  /** Respuestas oficiales (siempre del equipo SoundKeleles). */
  officialReplies: LessonDiscussionReply[];
  /** Conteo real de aplausos visibles. */
  applauseCount: number;
  /** Si el usuario autenticado ya aplaudió esta publicación. */
  hasCurrentUserReacted: boolean;
  /** Si el usuario autenticado es autor de la publicación. */
  isCurrentUserAuthor: boolean;
};

/** Payload de creación aceptado por el repositorio. */
export type CreateLessonPostInput = {
  lessonId: string;
  postType: DiscussionPostType;
  content: string;
};

/** Resultado de la carga de discusión de una clase. */
export type LessonDiscussionResult = {
  posts: LessonDiscussionPost[];
  /**
   * Verdadero cuando el usuario autenticado tiene una publicación
   * **visible y activa** en esta clase (deleted_at IS NULL AND is_hidden = false).
   * Un post soft-deleted o oculto por moderación NO cuenta como activo.
   */
  currentUserHasActivePost: boolean;
};

// ── Errores semánticos ────────────────────────────────────────────

export type LessonDiscussionErrorCode =
  | "not_authenticated"
  | "duplicate_active_post"
  | "invalid_content"
  | "invalid_lesson"
  | "post_not_visible"
  | "not_authorized"
  | "network_error"
  | "unknown";

export class LessonDiscussionError extends Error {
  code: LessonDiscussionErrorCode;
  cause?: unknown;
  constructor(code: LessonDiscussionErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = "LessonDiscussionError";
    this.code = code;
    this.cause = cause;
  }
}
