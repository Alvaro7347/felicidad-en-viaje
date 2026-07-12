import { B } from "../data/brand";
import { Card } from "../components/Card";
import type { ParentOnboardingAnswers } from "@/features/parent-journey/types";

export const APP_VERSION = "MVP1 · 1.0.0";

type Props = {
  mode: "self_learning" | "accompanied_learning" | null;
  userName: string;
  userEmail?: string | null;
  studentName?: string;
  parentAnswers?: ParentOnboardingAnswers | null;
  onBack: () => void;
};

export function MyProfileScreen({
  mode,
  userName,
  userEmail,
  studentName,
  parentAnswers,
  onBack,
}: Props) {
  const isAccompanied = mode === "accompanied_learning";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 4 }}>
      <BackChip onBack={onBack} />

      <div>
        <Chip>Mi perfil</Chip>
        <h1 style={heroTitle}>
          {isAccompanied ? "Tu perfil de acompañamiento" : "Tu perfil"}
        </h1>
        <p style={heroSubtitle}>
          {isAccompanied
            ? "Aquí puedes revisar tus datos y los del estudiante que acompañas."
            : "Aquí puedes revisar tus datos personales y los de tu cuenta."}
        </p>
      </div>

      {/* Bloque 1: Información personal / apoderado */}
      <Card>
        <SectionLabel>
          {isAccompanied ? "Información del apoderado" : "Información personal"}
        </SectionLabel>
        <InfoRow label="Nombre" value={userName || "—"} />
        <InfoRow label="Correo electrónico" value={userEmail || "—"} />
        {isAccompanied && parentAnswers?.parent.relationship && (
          <InfoRow label="Relación" value={parentAnswers.parent.relationship} />
        )}
      </Card>

      {/* Bloque 2A: Estudiante (solo María José) */}
      {isAccompanied && (
        <Card>
          <SectionLabel>Información del estudiante</SectionLabel>
          <InfoRow
            label="Nombre"
            value={studentName || parentAnswers?.student.name || "—"}
          />
          {parentAnswers?.student.age && (
            <InfoRow label="Edad" value={parentAnswers.student.age} />
          )}
          {parentAnswers?.student.hasUkulele && (
            <InfoRow label="Tiene ukelele" value={parentAnswers.student.hasUkulele} />
          )}
          {parentAnswers?.practice.homePractice && (
            <InfoRow
              label="Tiempo para practicar"
              value={parentAnswers.practice.homePractice}
            />
          )}
          {parentAnswers?.expectations.goal && (
            <InfoRow label="Objetivo del viaje" value={parentAnswers.expectations.goal} />
          )}

          <button type="button" disabled style={disabledCta}>
            Editar información del viaje · Próximamente
          </button>
        </Card>
      )}

      {/* Bloque 2B: Cuenta (solo Alejandra) */}
      {!isAccompanied && (
        <Card>
          <SectionLabel>Cuenta</SectionLabel>
          <button type="button" disabled style={disabledCta}>
            Cambiar contraseña · Próximamente
          </button>
          <InfoRow label="Versión" value={APP_VERSION} />
        </Card>
      )}

      {isAccompanied && (
        <Card>
          <SectionLabel>Cuenta</SectionLabel>
          <InfoRow label="Versión" value={APP_VERSION} />
        </Card>
      )}
    </div>
  );
}

// ── UI helpers ──
function BackChip({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      style={{
        alignSelf: "flex-start",
        background: "transparent",
        border: `1px solid ${B.grayBorder}`,
        color: B.grayText,
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: 600,
        fontSize: 12.5,
        padding: "7px 12px",
        borderRadius: 999,
        cursor: "pointer",
        marginBottom: 4,
      }}
    >
      ← Volver
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-block",
        fontSize: 10.5,
        fontWeight: 800,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: B.green,
        background: B.greenLight,
        padding: "5px 10px",
        borderRadius: 999,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 800,
        color: B.grayText,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        marginBottom: 2,
      }}
    >
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "baseline",
        padding: "6px 0",
        borderBottom: `1px dashed ${B.grayBorder}`,
      }}
    >
      <div style={{ fontSize: 13, color: B.grayText }}>{label}</div>
      <div style={{ fontSize: 14, color: B.dark, fontWeight: 600, textAlign: "right" }}>
        {value}
      </div>
    </div>
  );
}

const heroTitle: React.CSSProperties = {
  fontFamily: "Space Grotesk, sans-serif",
  fontSize: "clamp(22px, 5.6vw, 28px)",
  fontWeight: 800,
  color: B.dark,
  margin: "0 0 8px 0",
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
};

const heroSubtitle: React.CSSProperties = {
  margin: 0,
  color: "#6f6f6d",
  fontSize: 14,
  lineHeight: 1.55,
};

const disabledCta: React.CSSProperties = {
  marginTop: 8,
  width: "100%",
  border: `1px solid ${B.grayBorder}`,
  background: "#FAFAF8",
  color: B.grayText,
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 700,
  fontSize: 13.5,
  borderRadius: 12,
  padding: "12px 16px",
  cursor: "not-allowed",
};
