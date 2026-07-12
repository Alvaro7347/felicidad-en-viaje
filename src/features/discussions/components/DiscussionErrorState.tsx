import { B } from "@/features/archipielago/data/brand";
import { Btn } from "@/features/archipielago/components/Btn";

type Props = {
  onRetry: () => void;
  isRetrying?: boolean;
};

export function DiscussionErrorState({ onRetry, isRetrying }: Props) {
  return (
    <div
      role="alert"
      style={{
        border: `1px solid ${B.grayBorder}`,
        borderRadius: 16,
        padding: 16,
        background: B.white,
        display: "grid",
        gap: 12,
      }}
    >
      <p style={{ margin: 0, color: B.dark, fontWeight: 600 }}>
        No pudimos cargar las preguntas y comentarios.
      </p>
      <div>
        <Btn variant="ghost" size="sm" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? "Reintentando…" : "Intentar nuevamente"}
        </Btn>
      </div>
    </div>
  );
}
