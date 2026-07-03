import { useState } from "react";
import { Lock } from "lucide-react";
import { B } from "../data/brand";

type Route = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  active: boolean;
};

const ROUTES: Route[] = [
  {
    id: "empezar",
    icon: "🌱",
    title: "Quiero empezar",
    desc: "Nunca he podido aprender, pero esta vez es diferente.",
    active: true,
  },
  {
    id: "acompanar",
    icon: "🏡",
    title: "Quiero acompañar",
    desc: "Quiero ayudar a alguien cercano a descubrir la música.",
    active: false,
  },
  {
    id: "experiencia",
    icon: "🎸",
    title: "Ya tengo experiencia",
    desc: "Ya toco un poco y quiero seguir creciendo.",
    active: false,
  },
];

export function OnboardingScreen({ onStart }: { onStart: () => void }) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [pressId, setPressId] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 8 }}>
      {/* Título */}
      <div style={{ textAlign: "center", paddingTop: 4 }}>
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(24px, 6.2vw, 30px)",
            fontWeight: 800,
            color: B.dark,
            margin: 0,
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
          }}
        >
          ¿Cómo quieres comenzar
          <br />
          tu <span style={{ color: B.green }}>viaje musical</span>?
        </h1>
        <p
          style={{
            marginTop: 12,
            marginBottom: 0,
            fontSize: 13.5,
            fontWeight: 300,
            color: "#9a9a98",
            letterSpacing: "0.01em",
          }}
        >
          Cada ruta está diseñada para ti.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ROUTES.map((r) => {
          const isHover = hoverId === r.id;
          const isPress = pressId === r.id;

          const scale = isPress ? "scale(0.985)" : isHover ? "scale(1.01)" : "scale(1)";

          const activeShadow = isHover
            ? "0 10px 28px rgba(46,230,174,0.28), 0 0 0 1px rgba(46,230,174,0.15)"
            : "0 6px 20px rgba(46,230,174,0.18)";
          const lockedShadow = isHover
            ? "0 4px 14px rgba(0,0,0,0.06)"
            : "0 2px 8px rgba(0,0,0,0.035)";

          return (
            <button
              key={r.id}
              type="button"
              onMouseEnter={() => setHoverId(r.id)}
              onMouseLeave={() => {
                setHoverId(null);
                setPressId(null);
              }}
              onMouseDown={() => setPressId(r.id)}
              onMouseUp={() => setPressId(null)}
              onTouchStart={() => setPressId(r.id)}
              onTouchEnd={() => setPressId(null)}
              onTouchCancel={() => setPressId(null)}
              style={{
                all: "unset",
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
                boxSizing: "border-box",
                background: B.white,
                border: r.active
                  ? `1.5px solid ${B.green}`
                  : `1px solid ${B.grayBorder}`,
                borderRadius: 18,
                padding: "16px 16px",
                cursor: r.active ? "pointer" : "default",
                boxShadow: r.active ? activeShadow : lockedShadow,
                transform: scale,
                transition:
                  "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease",
                opacity: r.active ? 1 : 0.78,
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
              aria-disabled={!r.active}
            >
              {/* Icono */}
              <div
                style={{
                  flex: "0 0 auto",
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: r.active ? B.greenLight : "#f4f4f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  filter: r.active ? "none" : "grayscale(0.35)",
                }}
              >
                {r.icon}
              </div>

              {/* Texto */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700,
                    fontSize: 15.5,
                    color: r.active ? B.dark : "#8a8a88",
                    letterSpacing: "-0.005em",
                    marginBottom: 3,
                  }}
                >
                  {r.title}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.45,
                    color: r.active ? "#6f6f6d" : "#b3b3b1",
                    fontWeight: 400,
                  }}
                >
                  {r.desc}
                </div>
              </div>

              {/* Estado a la derecha */}
              <div
                style={{
                  flex: "0 0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 6,
                }}
              >
                {r.active ? (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: B.green,
                      boxShadow: `0 0 0 4px rgba(46,230,174,0.18)`,
                    }}
                  />
                ) : (
                  <>
                    <Lock size={14} color="#b8b8b6" strokeWidth={2.2} />
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: "#a0a09e",
                        background: "#f2f2f0",
                        borderRadius: 999,
                        padding: "3px 8px",
                        letterSpacing: "0.4px",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Próximamente
                    </span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 4 }}>
        <button
          type="button"
          onClick={onStart}
          style={{
            width: "100%",
            border: "none",
            background: B.green,
            color: B.dark,
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: "0.01em",
            borderRadius: 14,
            padding: "15px 20px",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(46,230,174,0.32)",
            transition: "transform 0.15s ease, box-shadow 0.2s ease, opacity 0.15s ease",
            userSelect: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 10px 24px rgba(46,230,174,0.38)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(46,230,174,0.32)";
          }}
        >
          Preparar mi viaje
        </button>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#bcbcba",
            margin: "12px 0 0 0",
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          Cada acorde es una pequeña victoria.
        </p>
      </div>
    </div>
  );
}
