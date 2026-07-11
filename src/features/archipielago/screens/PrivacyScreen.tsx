import { B } from "../data/brand";
import { Card } from "../components/Card";

type Props = { onBack: () => void };

export function PrivacyScreen({ onBack }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 4 }}>
      <BackChip onBack={onBack} />

      <div>
        <Chip>Privacidad y seguridad</Chip>
        <h1 style={heroTitle}>Cuidamos tu información</h1>
        <p style={heroSubtitle}>
          Aquí te contamos, en lenguaje simple, qué guardamos, para qué lo
          usamos y cómo lo protegemos.
        </p>
      </div>

      <Card>
        <SectionLabel>Nuestra promesa</SectionLabel>
        <p style={paragraph}>
          Tus datos son utilizados únicamente para acompañar tu aprendizaje
          musical. Nada más.
        </p>
      </Card>

      <Card>
        <SectionLabel>Qué información guardamos</SectionLabel>
        <List
          items={[
            "Datos básicos de tu cuenta.",
            "Progreso en las clases.",
            "Respuestas del onboarding.",
            "Avances y pequeños logros.",
            "Tareas (cuando estén disponibles).",
          ]}
        />
      </Card>

      <Card>
        <SectionLabel>Privacidad</SectionLabel>
        <List
          items={[
            "No vendemos tus datos.",
            "No compartimos información sin tu autorización.",
            "Solo tú y, cuando corresponda, tu profesor pueden ver tu información de aprendizaje.",
          ]}
        />
      </Card>

      <Card>
        <SectionLabel>Seguridad</SectionLabel>
        <List
          items={[
            "Las contraseñas están protegidas.",
            "Puedes cerrar sesión cuando quieras.",
          ]}
        />
      </Card>

      <Card>
        <SectionLabel>Contacto</SectionLabel>
        <InfoRow label="Correo" value="hola@soundkeleles.com" />
        <InfoRow label="WhatsApp" value="Próximamente" />
      </Card>

      <Card style={{ background: B.greenLight, borderColor: "rgba(46,230,174,0.4)" }}>
        <SectionLabel>Nuestro compromiso</SectionLabel>
        <p style={{ ...paragraph, color: B.dark }}>
          Creemos que aprender música debe ser una experiencia segura,
          tranquila y respetuosa. Por eso cuidamos tu información con el mismo
          compromiso con el que acompañamos tu viaje musical.
        </p>
      </Card>
    </div>
  );
}

// ── helpers ──
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
        marginBottom: 4,
      }}
    >
      {children}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            fontSize: 13.5,
            color: B.dark,
            lineHeight: 1.5,
          }}
        >
          <span aria-hidden="true" style={{ color: B.green, fontWeight: 900 }}>
            ✓
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
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

const paragraph: React.CSSProperties = {
  margin: 0,
  fontSize: 13.5,
  color: B.grayText,
  lineHeight: 1.55,
};
