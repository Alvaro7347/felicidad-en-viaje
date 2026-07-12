// Repositorio de datos para "Preguntas y comentarios de la clase".
//
// Responsabilidad ÚNICA: encapsular las lecturas y escrituras contra Supabase
// para las tablas `lesson_discussion_posts`, `lesson_discussion_replies` y
// `lesson_discussion_reactions`. Este archivo:
//
//   - importa el cliente Supabase;
//   - obtiene la identidad del usuario desde `supabase.auth.getUser()` para
//     todas las mutaciones (nunca confía en un userId recibido del componente);
//   - devuelve datos tipados en camelCase (traducidos desde snake_case);
//   - traduce los errores de Postgres/PostgREST en `LessonDiscussionError`
//     con códigos semánticos para que la UI decida el mensaje visible;
//   - NO conoce JSX, React, React Query, navegación ni progreso pedagógico.
//
// React Query se ensamblará en un commit posterior mediante
// `src/features/discussions/hooks/useLessonDiscussion.ts`.
//
// Estrategia anti-N+1
// -------------------
// La carga de una clase se resuelve con UNA sola consulta a
// `lesson_discussion_posts` que expande relaciones anidadas
// (`lesson_discussion_replies` y `lesson_discussion_reactions`) vía PostgREST.
// El chequeo de "publicación activa del usuario" agrega UNA consulta más.
// Total máximo por carga de clase: **2 consultas** (más la resolución de la
// sesión, que Supabase cachea localmente). No se emiten consultas por post.

import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";
import { MVP1_LESSON_IDS } from "@/features/archipielago/data/mvp1Progress";
import type {
  CreateLessonPostInput,
  DiscussionPostType,
  LessonDiscussionPost,
  LessonDiscussionReply,
  LessonDiscussionResult,
} from "../types";
import { LessonDiscussionError } from "../types";

// ── Constantes ────────────────────────────────────────────────────

const MAX_VISIBLE_POSTS = 20;
const MIN_CONTENT_LENGTH = 3;
// Alineado con el CHECK `posts_content_len` de la DB (3..1000 para todo post
// principal). Los 2000 caracteres corresponden a `replies` oficiales futuras.
const MAX_POST_CONTENT_LENGTH = 1000;

// Set con los lesson_id válidos del MVP1 (misma fuente que el catálogo
// pedagógico). La DB sigue siendo la autoridad final vía CHECK.
const VALID_LESSON_IDS = new Set<string>(MVP1_LESSON_IDS);

// Valor técnico enviado al INSERT: el trigger de servidor SIEMPRE lo
// sobrescribe con el primer nombre real (o el fallback correspondiente),
// pero la columna es NOT NULL y el tipo generado lo exige.
const AUTHOR_DISPLAY_NAME_PLACEHOLDER = "__server_will_replace__";

// ── Helpers ───────────────────────────────────────────────────────

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    throw new LessonDiscussionError(
      "not_authenticated",
      "Necesitas iniciar sesión para realizar esta acción.",
      error ?? undefined,
    );
  }
  return data.user.id;
}

function mapPgError(error: PostgrestError | null): LessonDiscussionError | null {
  if (!error) return null;
  // 23505 = unique_violation; 23503 = fk_violation; 23514 = check_violation;
  // 42501 = insufficient_privilege; 22P02 = invalid_text_representation (enum).
  const code = error.code ?? "";
  const detail = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();

  if (code === "23505") {
    return new LessonDiscussionError(
      "duplicate_active_post",
      "Ya tienes una publicación activa en esta clase.",
      error,
    );
  }
  if (code === "23514") {
    // Distinguir por nombre de la constraint (aparece en message/details).
    if (detail.includes("posts_lesson_id_valid")) {
      return new LessonDiscussionError(
        "invalid_lesson",
        "La clase indicada no pertenece al catálogo MVP1.",
        error,
      );
    }
    if (detail.includes("posts_content_len")) {
      return new LessonDiscussionError(
        "invalid_content",
        "El contenido debe tener entre 3 y 1000 caracteres.",
        error,
      );
    }
    if (detail.includes("posts_post_type")) {
      return new LessonDiscussionError(
        "invalid_content",
        "Tipo de publicación no permitido.",
        error,
      );
    }
    return new LessonDiscussionError(
      "invalid_content",
      "El contenido no cumple con las reglas de la clase.",
      error,
    );
  }
  if (code === "23503") {
    return new LessonDiscussionError(
      "invalid_lesson",
      "La clase indicada no existe o no es válida.",
      error,
    );
  }
  if (code === "22P02") {
    return new LessonDiscussionError(
      "invalid_content",
      "Valor no aceptado por el servidor.",
      error,
    );
  }
  if (code === "42501") {
    return new LessonDiscussionError(
      "not_authorized",
      "No tienes permisos para realizar esta acción.",
      error,
    );
  }
  // Mensaje genérico sin filtrar detalles internos de Postgres.
  return new LessonDiscussionError(
    "unknown",
    "Ocurrió un problema al comunicarse con el servidor.",
    error,
  );
}

function assertContent(_postType: DiscussionPostType, raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length < MIN_CONTENT_LENGTH) {
    throw new LessonDiscussionError(
      "invalid_content",
      "El contenido debe tener al menos 3 caracteres.",
    );
  }
  if (trimmed.length > MAX_POST_CONTENT_LENGTH) {
    throw new LessonDiscussionError(
      "invalid_content",
      `El contenido supera el máximo de ${MAX_POST_CONTENT_LENGTH} caracteres.`,
    );
  }
  return trimmed;
}

function assertLessonId(lessonId: string): string {
  const value = lessonId?.trim();
  if (!value) {
    throw new LessonDiscussionError("invalid_lesson", "Clase no especificada.");
  }
  if (!VALID_LESSON_IDS.has(value)) {
    throw new LessonDiscussionError(
      "invalid_lesson",
      "La clase indicada no pertenece al catálogo MVP1.",
    );
  }
  return value;
}

/**
 * Resuelve el usuario autenticado sin lanzar. Útil para lecturas: si no hay
 * sesión, las banderas dependientes del usuario se calculan como `false`.
 */
async function resolveCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

// ── Tipos internos de la fila cruda de Supabase ───────────────────

type RawReplyRow = {
  id: string;
  post_id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

type RawReactionRow = {
  user_id: string;
};

type RawPostRow = {
  id: string;
  lesson_id: string;
  post_type: string;
  content: string;
  author_display_name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  replies: RawReplyRow[] | null;
  reactions: RawReactionRow[] | null;
};

function normalizeReply(row: RawReplyRow): LessonDiscussionReply {
  return {
    id: row.id,
    postId: row.post_id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorUserId: row.user_id,
  };
}

function normalizePost(row: RawPostRow, currentUserId: string | null): LessonDiscussionPost {
  const replies = (row.replies ?? []).map(normalizeReply);
  const reactions = row.reactions ?? [];
  return {
    id: row.id,
    lessonId: row.lesson_id,
    postType: (row.post_type === "question" ? "question" : "comment") as DiscussionPostType,
    content: row.content,
    authorDisplayName: row.author_display_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    officialReplies: replies.sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    applauseCount: reactions.length,
    hasCurrentUserReacted: currentUserId
      ? reactions.some((r) => r.user_id === currentUserId)
      : false,
    isCurrentUserAuthor: currentUserId === row.user_id,
  };
}

// ── API pública ───────────────────────────────────────────────────

/**
 * Carga la discusión visible de una clase.
 *
 * Resuelve la identidad del usuario autenticado internamente (no la recibe
 * como argumento) para calcular `hasCurrentUserReacted`, `isCurrentUserAuthor`
 * y `currentUserHasActivePost`. Si no hay sesión, esas banderas son `false`.
 *
 * Estrategia: 2 consultas máximo. Una con relaciones anidadas para los posts,
 * respuestas oficiales y aplausos; otra corta para determinar si el usuario
 * tiene una publicación **visible y activa** (deleted_at IS NULL AND
 * is_hidden = false), lo que refleja el nuevo índice único parcial.
 */
export async function listLessonDiscussion(
  lessonId: string,
): Promise<LessonDiscussionResult> {
  const safeLessonId = assertLessonId(lessonId);
  const currentUserId = await resolveCurrentUserId();

  const postsQuery = supabase
    .from("lesson_discussion_posts")
    .select(
      `
        id,
        lesson_id,
        post_type,
        content,
        author_display_name,
        user_id,
        created_at,
        updated_at,
        replies:lesson_discussion_replies(id, post_id, content, user_id, created_at, updated_at),
        reactions:lesson_discussion_reactions(user_id)
      `,
    )
    .eq("lesson_id", safeLessonId)
    .order("created_at", { ascending: false })
    .limit(MAX_VISIBLE_POSTS);

  const activePostQuery = currentUserId
    ? supabase
        .from("lesson_discussion_posts")
        .select("id")
        .eq("lesson_id", safeLessonId)
        .eq("user_id", currentUserId)
        .is("deleted_at", null)
        .eq("is_hidden", false)
        .limit(1)
        .maybeSingle()
    : Promise.resolve({ data: null, error: null } as {
        data: { id: string } | null;
        error: PostgrestError | null;
      });

  const [postsRes, activeRes] = await Promise.all([postsQuery, activePostQuery]);

  const postsErr = mapPgError(postsRes.error);
  if (postsErr) throw postsErr;
  const activeErr = mapPgError(activeRes.error);
  if (activeErr) throw activeErr;

  const rows = (postsRes.data ?? []) as unknown as RawPostRow[];
  const normalized = rows.map((row) => normalizePost(row, currentUserId));

  // Orden final: primero las que tienen respuesta oficial, luego por fecha desc.
  normalized.sort((a, b) => {
    const aHas = a.officialReplies.length > 0 ? 1 : 0;
    const bHas = b.officialReplies.length > 0 ? 1 : 0;
    if (aHas !== bHas) return bHas - aHas;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return {
    posts: normalized,
    currentUserHasActivePost: !!activeRes.data,
  };
}

/**
 * Crea una nueva publicación (pregunta o comentario) firmada por el usuario
 * autenticado. El `author_display_name` real lo calcula el servidor.
 */
export async function createLessonPost(input: CreateLessonPostInput): Promise<LessonDiscussionPost> {
  const userId = await requireUserId();
  const lessonId = assertLessonId(input.lessonId);
  const content = assertContent(input.postType, input.content);

  const { data, error } = await supabase
    .from("lesson_discussion_posts")
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      post_type: input.postType,
      content,
      // Marcador técnico: el trigger `set_post_author_display_name`
      // SIEMPRE lo sobrescribe con el primer nombre real del perfil.
      author_display_name: AUTHOR_DISPLAY_NAME_PLACEHOLDER,
    })
    .select(
      `
        id, lesson_id, post_type, content, author_display_name, user_id,
        created_at, updated_at
      `,
    )
    .single();

  const mapped = mapPgError(error);
  if (mapped) throw mapped;
  if (!data) {
    throw new LessonDiscussionError("unknown", "No se pudo crear la publicación.");
  }

  const row = data as unknown as Omit<RawPostRow, "replies" | "reactions">;
  return normalizePost(
    { ...row, replies: [], reactions: [] } as RawPostRow,
    userId,
  );
}

/**
 * Soft-delete de la propia publicación. Usa exclusivamente la función
 * `SECURITY DEFINER` `soft_delete_own_post`, que verifica la titularidad y
 * evita que la política SELECT bloquee el UPDATE tras marcar la fila.
 */
export async function softDeleteOwnPost(postId: string): Promise<void> {
  await requireUserId();
  if (!postId) {
    throw new LessonDiscussionError("post_not_visible", "Publicación no especificada.");
  }
  const { error } = await supabase.rpc("soft_delete_own_post", { _post_id: postId });
  if (error) {
    const message = (error.message ?? "").toLowerCase();
    if (message.includes("not found") || message.includes("not owned") || message.includes("already deleted")) {
      throw new LessonDiscussionError(
        "post_not_visible",
        "La publicación ya no está disponible.",
        error,
      );
    }
    if (message.includes("not authenticated")) {
      throw new LessonDiscussionError("not_authenticated", "Necesitas iniciar sesión.", error);
    }
    throw new LessonDiscussionError("unknown", "No se pudo eliminar la publicación.", error);
  }
}

/**
 * Aplaude una publicación. La operación es idempotente: si el usuario ya
 * había reaccionado, no lanza error.
 */
export async function addReaction(postId: string): Promise<void> {
  const userId = await requireUserId();
  if (!postId) {
    throw new LessonDiscussionError("post_not_visible", "Publicación no especificada.");
  }
  const { error } = await supabase
    .from("lesson_discussion_reactions")
    .insert({ post_id: postId, user_id: userId });
  if (!error) return;
  // Idempotencia: PK compuesta (post_id, user_id) → violación única = OK.
  if (error.code === "23505") return;
  const mapped = mapPgError(error);
  throw mapped ?? new LessonDiscussionError("unknown", "No se pudo aplaudir.", error);
}

/**
 * Retira el aplauso propio. No acepta userId arbitrario: siempre usa el
 * identificador de la sesión autenticada.
 */
export async function removeReaction(postId: string): Promise<void> {
  const userId = await requireUserId();
  if (!postId) {
    throw new LessonDiscussionError("post_not_visible", "Publicación no especificada.");
  }
  const { error } = await supabase
    .from("lesson_discussion_reactions")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
  const mapped = mapPgError(error);
  if (mapped) throw mapped;
}
