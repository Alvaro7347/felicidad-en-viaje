import { useMemo, useState } from "react";
import { B } from "../data/brand";

type Platform = "ios" | "android";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "android";
  const ua = navigator.userAgent || "";
  return /iPhone|iPad|iPod/i.test(ua) ? "ios" : "android";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari
  // @ts-expect-error legacy prop
  if (window.navigator.standalone) return true;
  return window.matchMedia?.("(display-mode: standalone)").matches ?? false;
}

export function InstallHelpCard() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const platform = useMemo(detectPlatform, []);
  const standalone = useMemo(isStandalone, []);

  if (standalone || dismissed) return null;

  const steps =
    platform === "ios"
      ? [
          "Abre esta página en Safari.",
          "Toca el botón Compartir.",
          "Toca “Agregar a pantalla de inicio”.",
          "Toca “Agregar”.",
        ]
      : [
          "Abre esta página en Chrome.",
          "Toca los tres puntos ⋮ arriba a la derecha.",
          "Toca “Agregar a pantalla principal” o “Instalar app”.",
          "Confirma.",
        ];

  return (
    <div
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.75)",
        border: `1px solid ${B.green}`,
        borderRadius: 16,
        padding: 14,
        boxShadow: "0 6px 18px rgba(28,196,142,0.12)",
        backdropFilter: "blur(4px)",
        textAlign: "left",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
        }}
        aria-expanded={open}
      >
        <span style={{ fontSize: 22 }} aria-hidden>📱</span>
        <span style={{ flex: 1 }}>
          <span
            style={{
              display: "block",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: 14.5,
              color: B.dark,
            }}
          >
            Guarda el Archipiélago en tu celular
          </span>
          <span
            style={{
              display: "block",
              fontSize: 12.5,
              color: B.dark,
              opacity: 0.7,
              marginTop: 2,
            }}
          >
            Así podrás volver a practicar con un solo toque.
          </span>
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: B.greenDark,
          }}
        >
          {open ? "Ocultar" : "Ver cómo"}
        </span>
      </button>

      {open && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: B.greenDark,
              marginBottom: 6,
            }}
          >
            {platform === "ios" ? "En iPhone (Safari)" : "En Android (Chrome)"}
          </div>
          <ol
            style={{
              margin: 0,
              paddingLeft: 20,
              fontSize: 13,
              lineHeight: 1.6,
              color: B.dark,
            }}
          >
            {steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            style={{
              marginTop: 10,
              border: "none",
              background: "transparent",
              color: B.grayText,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              fontFamily: "Quicksand, sans-serif",
            }}
          >
            No mostrar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
