// Repositorio de moderación: acceso admin a posts y respuestas.
//
// Todas las operaciones caben dentro de las policies RLS existentes
// (`posts_select_team_all`, `posts_update_team_only`, `replies_select_team_all`,
// `replies_insert_team_only`, `replies_update_team_only`). No hay migraciones.
//
// Reglas:
// - El equipo lee TODOS los posts (visibles y ocultos), incluidos soft-deleted.
// - El equipo puede hacer UPDATE, pero el trigger `guard_post_update` solo
//   permite modificar `is_hidden`; el resto de campos es inmutable.
// - Las respuestas oficiales pueden ser múltiples por post.
// - Ocultamiento es reversible en DB pero NO exponemos restauración en UI.

import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

export type ModerationPostType = "question" | "comment";

export interface ModerationReply {
  id: string;
  postId: string;
  content: string;
  authorUserId: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModerationPost {
  id: string;
  lessonId: string;
  postType: ModerationPostType;
  content: string;
  authorDisplayName: string;
  authorUserId: string;
  isHidden: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies: ModerationReply[];
  /** Total de respuestas visibles (no ocultas). */
  visibleReplyCount: number;
}

export type ModerationErrorCode =
  | "not_authenticated"
  | "not_authorized"
  | "not_found"
  | "invalid_content"
  | "network_error"
  | "unknown";

export class ModerationError extends Error {
  code: ModerationErrorCode;
  cause?: unknown;
  constructor(code: ModerationErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = "ModerationError";
    this.code = code;
    this.cause = cause;
  }
}

const REPLY_MIN = 3;
const REPLY_MAX = 2000;

function mapPgError(error: PostgrestError | null): ModerationError | null {
  if (!error) return null;
  const code = error.code ?? "";
  if (code === "42501") {
    return new ModerationError("not_authorized", "No tienes permisos para esta acción.", error);
  }
  if (code === "23514") {
    return new ModerationError("invalid_content", "El contenido no cumple las reglas.", error);
  }
  if (code === "PGRST116") {
    return new ModerationError("not_found", "Registro no encontrado.", error);
  }
  return new ModerationError("unknown", "Ocurrió un problema al comunicarse con el servidor.", error);
}

async function requireTeamUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    throw new ModerationError("not_authenticated", "Tu sesión terminó. Inicia sesión de nuevo.");
  }
  return data.user.id;
}

// ── Tipos crudos ─────────────────────────────────────────────

type RawReply = {
  id: string;
  post_id: string;
  content: string;
  user_id: string;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
};

type RawPost = {
  id: string;
  lesson_id: string;
  post_type: string;
  content: string;
  author_display_name: string;
  user_id: string;
  is_hidden: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  replies: RawReply[] | null;
};

function normalizeReply(r: RawReply): ModerationReply {
  return {
    id: r.id,
    postId: r.post_id,
    content: r.content,
    authorUserId: r.user_id,
    isHidden: r.is_hidden,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function normalizePost(row: RawPost): ModerationPost {
  const replies = (row.replies ?? []).map(normalizeReply);
  return {
    id: row.id,
    lessonId: row.lesson_id,
    postType: (row.post_type === "question" ? "question" : "comment") as ModerationPostType,
    content: row.content,
    authorDisplayName: row.author_display_name,
    authorUserId: row.user_id,
    isHidden: row.is_hidden,
    isDeleted: row.deleted_at !== null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    replies: replies.sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    visibleReplyCount: replies.filter((r) => !r.isHidden).length,
  };
}

// ── API pública ──────────────────────────────────────────────

/**
 * Lista TODOS los posts (visibles, ocultos y soft-deleted) para el equipo.
 * Filtro opcional por lección. Máximo 200 por carga.
 */
export async function listModerationPosts(lessonId?: string): Promise<ModerationPost[]> {
  await requireTeamUserId();

  let query = supabase
    .from("lesson_discussion_posts")
    .select(
      `
        id, lesson_id, post_type, content, author_display_name, user_id,
        is_hidden, deleted_at, created_at, updated_at,
        replies:lesson_discussion_replies(
          id, post_id, content, user_id, is_hidden, created_at, updated_at
        )
      `,
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (lessonId) query = query.eq("lesson_id", lessonId);

  const { data, error } = await query;
  const mapped = mapPgError(error);
  if (mapped) throw mapped;
  const rows = (data ?? []) as unknown as RawPost[];
  return rows.map(normalizePost);
}

/**
 * Oculta un post. El trigger `guard_post_update` verifica que solo se cambie
 * `is_hidden`. Comprueba cero filas afectadas para detectar RLS o carrera.
 */
export async function hidePost(postId: string): Promise<void> {
  await requireTeamUserId();
  const { data, error } = await supabase
    .from("lesson_discussion_posts")
    .update({ is_hidden: true })
    .eq("id", postId)
    .eq("is_hidden", false)
    .select("id");
  const mapped = mapPgError(error);
  if (mapped) throw mapped;
  if (!data || data.length === 0) {
    throw new ModerationError(
      "not_found",
      "No se pudo ocultar la publicación (puede que ya esté oculta o haya sido eliminada).",
    );
  }
}

/**
 * Oculta una respuesta oficial. Idéntica verificación de 0 filas.
 */
export async function hideReply(replyId: string): Promise<void> {
  await requireTeamUserId();
  const { data, error } = await supabase
    .from("lesson_discussion_replies")
    .update({ is_hidden: true })
    .eq("id", replyId)
    .eq("is_hidden", false)
    .select("id");
  const mapped = mapPgError(error);
  if (mapped) throw mapped;
  if (!data || data.length === 0) {
    throw new ModerationError(
      "not_found",
      "No se pudo ocultar la respuesta (puede que ya esté oculta).",
    );
  }
}

/**
 * Crea una respuesta oficial firmada por el usuario del equipo autenticado.
 * Se permiten múltiples respuestas por post.
 */
export async function createOfficialReply(input: {
  postId: string;
  content: string;
}): Promise<ModerationReply> {
  const userId = await requireTeamUserId();
  const content = input.content.trim();
  if (content.length < REPLY_MIN) {
    throw new ModerationError("invalid_content", `Mínimo ${REPLY_MIN} caracteres.`);
  }
  if (content.length > REPLY_MAX) {
    throw new ModerationError("invalid_content", `Máximo ${REPLY_MAX} caracteres.`);
  }
  if (!input.postId) {
    throw new ModerationError("not_found", "Publicación no especificada.");
  }

  const { data, error } = await supabase
    .from("lesson_discussion_replies")
    .insert({ post_id: input.postId, user_id: userId, content })
    .select("id, post_id, content, user_id, is_hidden, created_at, updated_at")
    .single();

  const mapped = mapPgError(error);
  if (mapped) throw mapped;
  if (!data) throw new ModerationError("unknown", "No se pudo crear la respuesta.");
  return normalizeReply(data as unknown as RawReply);
}
