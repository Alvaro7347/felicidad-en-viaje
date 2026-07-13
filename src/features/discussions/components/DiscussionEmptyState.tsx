import { B } from "@/features/archipielago/data/brand";

export function DiscussionEmptyState() {
  return (
    <div
      style={{
        borderRadius: 20,
        padding: "22px 20px",
        background: B.white,
        color: B.dark,
        textAlign: "center",
      }}
    >
      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: B.dark }}>
        Todavía nadie ha iniciado esta conversación.
      </p>
      <p style={{ margin: "6px 0 0", fontSize: 14, color: B.grayText, lineHeight: 1.5 }}>
        Tu publicación puede ayudar a la próxima persona que llegue a esta clase.
      </p>
    </div>
  );
}
