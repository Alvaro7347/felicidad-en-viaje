// Formulario para responder oficialmente a un post.
import { useEffect, useRef, useState } from "react";
import { OFFICIAL_TEAM_NAME } from "@/features/discussions/brand";

interface Props {
  postId: string;
  lessonId: string;
  isPending: boolean;
  errorMessage: string | null;
  onSubmit: (input: { postId: string; lessonId: string; content: string }) => Promise<unknown>;
}

const MIN = 3;
const MAX = 2000;

export function OfficialReplyForm({ postId, lessonId, isPending, errorMessage, onSubmit }: Props) {
  const [content, setContent] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const trimmedLen = content.trim().length;
  const canSubmit = trimmedLen >= MIN && trimmedLen <= MAX && !isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await onSubmit({ postId, lessonId, content: content.trim() });
      if (!isMountedRef.current) return;
      setContent("");
      setShowSuccess(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) setShowSuccess(false);
      }, 3000);
    } catch {
      // El error se muestra vía errorMessage (prop).
    }
  }

  const helperId = `reply-helper-${postId}`;
  const errorId = `reply-error-${postId}`;
  const describedBy = [helperId, errorMessage ? errorId : null].filter(Boolean).join(" ");

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <label htmlFor={`reply-${postId}`} className="text-xs font-semibold text-slate-700">
        Respuesta oficial de {OFFICIAL_TEAM_NAME}
      </label>
      <textarea
        id={`reply-${postId}`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={MAX}
        rows={3}
        aria-describedby={describedBy || undefined}
        disabled={isPending}
        className="w-full resize-y rounded-lg border border-slate-300 p-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
        placeholder="Responde con calidez y precisión…"
      />
      <div id={helperId} className="flex justify-between text-xs text-slate-500">
        <span>
          Mínimo {MIN} · Máximo {MAX}
        </span>
        <span>
          {trimmedLen}/{MAX}
        </span>
      </div>
      {errorMessage && (
        <p id={errorId} role="alert" className="text-xs text-rose-600">
          {errorMessage}
        </p>
      )}
      {showSuccess && (
        <p role="status" className="text-xs text-emerald-600">
          Respuesta publicada.
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {isPending ? "Publicando…" : "Publicar respuesta"}
        </button>
      </div>
    </form>
  );
}
