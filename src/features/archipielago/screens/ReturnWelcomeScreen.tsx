import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { InstallHelpCard } from "../components/InstallHelpCard";

interface Props {
  userName: string;
  onEnter: () => void;
  loading?: boolean;
  ctaLabel?: string;
}

export function ReturnWelcomeScreen({ userName, onEnter, loading = false, ctaLabel }: Props) {
  const firstName = (userName ?? "").trim().split(/\s+/)[0] || "Navegante";


  return (
    <div
      style={{
        minHeight: "calc(100vh - 32px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 8px",
        margin: "-16px",
        background:
          "radial-gradient(circle at 30% 20%, #B8F5E2 0%, transparent 60%), radial-gradient(circle at 70% 80%, #A5EBD8 0%, transparent 55%), linear-gradient(160deg, #DFF9EF 0%, #C9F0E1 55%, #A8E5CC 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* Ilustración */}
        <div
          style={{
            width: 108,
            height: 108,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.55)",
            border: `2px solid ${B.green}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 54,
            boxShadow: "0 12px 32px rgba(28,196,142,0.18)",
            backdropFilter: "blur(4px)",
          }}
          aria-hidden
        >
          🪕
        </div>

        <div>
          <h1
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: 30,
              color: B.dark,
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Hola, {firstName}
          </h1>
          <div
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: B.greenDark,
              marginTop: 8,
            }}
          >
            Qué gusto verte de nuevo.
          </div>
        </div>

        <p
          style={{
            fontSize: 14.5,
            lineHeight: 1.6,
            color: B.dark,
            opacity: 0.78,
            margin: "0 12px",
          }}
        >
          Tu Archipiélago sigue esperándote. Continúa tu viaje musical desde
          donde lo dejaste.
        </p>

        <div style={{ width: "100%", marginTop: 6 }}>
          <Btn onClick={onEnter} fullWidth disabled={loading}>
            {ctaLabel ?? "Entrar a mi Archipiélago"}
          </Btn>
        </div>


        <div
          style={{
            fontSize: 11.5,
            color: B.dark,
            opacity: 0.55,
            marginTop: 4,
            fontStyle: "italic",
            letterSpacing: "0.02em",
          }}
        >
          Toca la felicidad, paso a paso.
        </div>
      </div>
    </div>
  );
}
