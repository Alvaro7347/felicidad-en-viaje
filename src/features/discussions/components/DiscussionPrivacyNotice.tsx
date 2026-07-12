// Aviso permanente de privacidad para la sección comunitaria.
// Recordatorio breve + detalle expandible.
import { useState } from "react";
import { B } from "@/features/archipielago/data/brand";

export function DiscussionPrivacyNotice() {
  const [open, setOpen] = useState(false);
  return (
    <div
      role="note"
      aria-label="Aviso de privacidad"
      style={{
        background: B.pinkLight,
        border: `1px solid ${B.grayBorder}`,
        borderRadius: 16,
        padding: "12px 14px",
        color: B.dark,
        fontSize: 14,
        lineHeight: 1.4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
        <span aria-hidden>🔒</span>
        <span>No compartas información personal.</span>
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          marginTop: 6,
          background: "transparent",
          border: "none",
          color: B.pink,
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          padding: 0,
        }}
      >
        {open ? "Ocultar detalles" : "¿Qué debo evitar?"}
      </button>
      {open && (
        <p style={{ margin: "8px 0 0", color: B.dark }}>
          Evita publicar teléfonos, direcciones, correos electrónicos, apellidos o
          nombres completos de niños.
        </p>
      )}
    </div>
  );
}
