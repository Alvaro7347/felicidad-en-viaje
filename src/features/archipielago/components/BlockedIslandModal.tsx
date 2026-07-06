import { B } from "../data/brand";
import { Card } from "./Card";
import { Btn } from "./Btn";

interface Props {
  open: boolean;
  onClose: () => void;
  variant?: "island" | "lesson";
}

export function BlockedIslandModal({ open, onClose, variant = "island" }: Props) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(60,60,59,0.45)",
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 420 }}>
        <Card style={{ border: `1.5px solid ${B.pink}` }}>
          <div style={{ fontSize: 18, fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, color: B.dark, marginBottom: 8 }}>
            {variant === "lesson" ? "🔒 Clase bloqueada" : "🔒 Isla bloqueada"}
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: B.dark, marginBottom: 14 }}>
            {variant === "lesson" ? (
              <>
                Para abrir esta clase primero necesitas completar la clase anterior.
                Tu viaje avanza una clase a la vez.
              </>
            ) : (
              <>
                Esta isla estará disponible más adelante en el taller.
                <br />
                <br />
                Por ahora, tu recorrido llega hasta la Isla del Pulso. Enfócate en
                practicar DO, LAm, FA y SOL, especialmente los cambios con SOL.
              </>
            )}
          </div>
          <Btn onClick={onClose} fullWidth>
            Entendido
          </Btn>
        </Card>
      </div>
    </div>
  );
}
