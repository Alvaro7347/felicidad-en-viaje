import { B } from "@/features/archipielago/data/brand";

export function DiscussionEmptyState() {
  return (
    <div
      style={{
        border: `1px dashed ${B.grayBorder}`,
        borderRadius: 20,
        padding: "20px 18px",
        background: B.greenLight,
        color: B.dark,
      }}
    >
      <p style={{ margin: 0, fontWeight: 800, fontSize: 16 }}>
        Aún no hay preguntas ni comentarios
      </p>
      <p style={{ margin: "6px 0 0", fontSize: 14, color: B.dark }}>
        Puedes ser la primera persona en compartir algo sobre esta clase.
      </p>
    </div>
  );
}
