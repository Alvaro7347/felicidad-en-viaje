// Aviso de privacidad discreto. Colapsado por defecto.
import { useId, useState } from "react";
import { B } from "@/features/archipielago/data/brand";

export function DiscussionPrivacyNotice() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div
      role="note"
      aria-label="Aviso de privacidad"
      style={{
        color: B.grayText,
        fontSize: 13,
        lineHeight: 1.5,
        padding: "4px 2px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ color: B.dark, fontWeight: 600 }}>
          <span aria-hidden style={{ marginRight: 6 }}>
            🔒
          </span>
          No compartas información personal.
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          style={{
            background: "transparent",
            border: "none",
            color: B.grayText,
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          {open ? "Ocultar" : "¿Qué significa esto?"}
        </button>
      </div>
      {open && (
        <p id={panelId} style={{ margin: "6px 0 0", color: B.grayText }}>
          Evita compartir teléfonos, correos, direcciones, apellidos o nombres completos de niños.
        </p>
      )}
    </div>
  );
}
