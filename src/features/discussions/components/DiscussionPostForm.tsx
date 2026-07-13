import { useId, useState } from "react";
import { B } from "@/features/archipielago/data/brand";
import { Btn } from "@/features/archipielago/components/Btn";
import type { DiscussionPostType, LessonDiscussionErrorCode } from "../types";

const MAX_LEN = 1000;
const MIN_LEN = 3;

const PLACEHOLDER =
  "¿Qué aprendiste, qué descubriste o qué se te hizo difícil? Comparte tu experiencia…";

const ERROR_MESSAGES: Record<LessonDiscussionErrorCode, string> = {
  duplicate_active_post: "Ya tienes una publicación activa en esta clase.",
  invalid_content: "Escribe entre 3 y 1000 caracteres.",
  invalid_lesson: "No pudimos identificar esta clase.",
  not_authenticated: "Tu sesión terminó. Inicia sesión nuevamente.",
  network_error: "No pudimos publicar. Revisa tu conexión e inténtalo otra vez.",
  post_not_visible: "Esta publicación ya no está disponible.",
  not_authorized: "No tienes permisos para publicar.",
  unknown: "Ocurrió un problema. Inténtalo nuevamente.",
};

export function resolveDiscussionErrorMessage(
  code: LessonDiscussionErrorCode | undefined | null,
): string | null {
  if (!code) return null;
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.unknown;
}

type Props = {
  onSubmit: (input: { postType: DiscussionPostType; content: string }) => Promise<void>;
  isSubmitting: boolean;
  errorCode: LessonDiscussionErrorCode | null;
};

export function DiscussionPostForm({ onSubmit, isSubmitting, errorCode }: Props) {
  const [content, setContent] = useState("");
  const [lastFailedValidation, setLastFailedValidation] = useState<string | null>(null);
  const textareaId = useId();
  const counterId = useId();
  const errorId = useId();

  const trimmedLen = content.trim().length;
  const overLimit = content.length > MAX_LEN;
  const tooShort = trimmedLen < MIN_LEN;
  const canSubmit = !isSubmitting && !overLimit && !tooShort;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setLastFailedValidation(
        overLimit
          ? `Tu texto supera el máximo de ${MAX_LEN} caracteres.`
          : "Escribe al menos 3 caracteres.",
      );
      return;
    }
    setLastFailedValidation(null);
    try {
      // Internamente todas las publicaciones se envían como "comment".
      // El backend conserva post_type por compatibilidad; la UI ya no lo diferencia.
      await onSubmit({ postType: "comment", content: content.trim() });
      setContent("");
    } catch {
      // El borrador permanece intacto.
    }
  };

  const serverError = resolveDiscussionErrorMessage(errorCode);
  const visibleError = lastFailedValidation ?? serverError;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: B.white,
        borderRadius: 20,
        padding: 20,
        display: "grid",
        gap: 14,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      aria-describedby={visibleError ? errorId : undefined}
    >
      <label
        htmlFor={textareaId}
        style={{ fontSize: 15, color: B.dark, fontWeight: 700, letterSpacing: -0.1 }}
      >
        Escribe algo para la comunidad
      </label>
      <textarea
        id={textareaId}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={4}
        maxLength={MAX_LEN}
        disabled={isSubmitting}
        aria-describedby={visibleError ? `${counterId} ${errorId}` : counterId}
        aria-invalid={overLimit || tooShort ? true : undefined}
        style={{
          width: "100%",
          minHeight: 120,
          padding: "14px 14px",
          borderRadius: 14,
          border: `1px solid ${overLimit ? B.pink : B.grayBorder}`,
          fontFamily: "inherit",
          fontSize: 15,
          lineHeight: 1.55,
          color: B.dark,
          background: B.white,
          resize: "vertical",
          boxSizing: "border-box",
          outline: "none",
          transition: "border-color 120ms ease",
        }}
      />

      {visibleError && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          style={{
            margin: 0,
            color: B.pink,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {visibleError}
        </p>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          id={counterId}
          style={{
            fontSize: 12,
            color: overLimit ? B.pink : B.grayText,
          }}
        >
          {content.length}/{MAX_LEN}
        </span>
        <Btn variant="primary" type="submit" disabled={!canSubmit}>
          {isSubmitting ? "Publicando…" : "Publicar"}
        </Btn>
      </div>
    </form>
  );
}
