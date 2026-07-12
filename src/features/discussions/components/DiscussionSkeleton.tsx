import { B } from "@/features/archipielago/data/brand";

function Block({ h, w = "100%" }: { h: number; w?: number | string }) {
  return (
    <div
      aria-hidden
      style={{
        height: h,
        width: w,
        background: B.gray,
        borderRadius: 12,
        animation: "pulse 1.4s ease-in-out infinite",
      }}
    />
  );
}

export function DiscussionSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando preguntas y comentarios"
      style={{ display: "grid", gap: 16 }}
    >
      <Block h={90} />
      <Block h={110} />
      <Block h={110} />
      <style>{`@keyframes pulse { 0%,100%{opacity:.7} 50%{opacity:.4} }`}</style>
    </div>
  );
}
