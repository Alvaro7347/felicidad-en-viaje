import { useId, useState } from "react";
import { B } from "@/features/archipielago/data/brand";
import { Btn } from "@/features/archipielago/components/Btn";
import type { DiscussionPostType, LessonDiscussionErrorCode } from "../types";

const MAX_LEN = 1000;
const MIN_LEN = 3;

const PLACEHOLDERS: Record<DiscussionPostType, string> = {
  question: "Escribe tu pregunta sobre esta clase…",
  comment: "Cuéntanos qué aprendiste, sentiste o descubriste…",
};

const ERROR_MESSAGES: Record<LessonDiscussionErrorCode, string> = {
  duplicate_active_post: "Ya tienes una publicación activa en esta clase.",
  invalid_content: "Revisa el contenido. Debe tener entre 3 y 1000 caracteres.",
  invalid_lesson: "No pudimos identificar esta clase.",
  not_authenticated: "Tu sesión terminó. Inicia sesión nuevamente.",
  network_error:
    "No pudimos publicar. Revisa tu conexión e inténtalo otra vez.",
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
  const [postType, setPostType] = useState<DiscussionPostType>("question");
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
          ? `El contenido supera el máximo de ${MAX_LEN} caracteres.`
          : "Escribe al menos 3 caracteres."
      );
      return;
    }
    setLastFailedValidation(null);
    try {
      await onSubmit({ postType, content: content.trim() });
      // Éxito: limpiar borrador. El error se conserva en state del padre.
      setContent("");
    } catch {
      // El borrador permanece intacto para no perder el trabajo del usuario.
    }
  };

  const serverError = resolveDiscussionErrorMessage(errorCode);
  const visibleError = lastFailedValidation ?? serverError;

  const typeButton = (value: DiscussionPostType, label: string) => {
    const active = postType === value;
    return (
      <button
        key={value}
        type="button"
        role="radio"
        aria-checked={active}
        onClick={() => setPostType(value)}
        disabled={isSubmitting}
        style={{
          flex: 1,
          minHeight: 44,
          padding: "10px 14px",
          borderRadius: 12,
          border: `2px solid ${active ? B.green : B.grayBorder}`,
          background: active ? B.greenLight : B.white,
          color: B.dark,
          fontWeight: 700,
          fontSize: 14,
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: B.white,
        border: `1px solid ${B.grayBorder}`,
        borderRadius: 20,
        padding: 16,
        display: "grid",
        gap: 12,
      }}
      aria-describedby={visibleError ? `${counterId} ${errorId}` : counterId}
    >
      <div
        role="radiogroup"
        aria-label="Tipo de publicación"
        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        {typeButton("question", "Tengo una pregunta")}
        {typeButton("comment", "Quiero compartir un comentario")}
      </div>

      <label
        htmlFor={textareaId}
        style={{ fontSize: 13, color: B.dark, fontWeight: 700 }}
      >
        {postType === "question" ? "Tu pregunta" : "Tu comentario"}
      </label>
      <textarea
        id={textareaId}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={PLACEHOLDERS[postType]}
        rows={4}
        maxLength={MAX_LEN}
        disabled={isSubmitting}
        aria-describedby={counterId}
        aria-invalid={overLimit || tooShort ? true : undefined}
        style={{
          width: "100%",
          minHeight: 110,
          padding: 12,
          borderRadius: 12,
          border: `1px solid ${overLimit ? B.pink : B.grayBorder}`,
          fontFamily: "inherit",
          fontSize: 15,
          lineHeight: 1.5,
          color: B.dark,
          background: B.white,
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
      <div
        id={counterId}
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: overLimit ? B.pink : B.grayText,
        }}
      >
        <span>Mínimo 3, máximo {MAX_LEN} caracteres.</span>
        <span>
          {content.length}/{MAX_LEN}
        </span>
      </div>

      {visibleError && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          style={{
            margin: 0,
            color: B.pink,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {visibleError}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn variant="primary" type="submit" disabled={!canSubmit}>
          {isSubmitting ? "Publicando…" : "Publicar"}
        </Btn>
      </div>
    </form>
  );
}
