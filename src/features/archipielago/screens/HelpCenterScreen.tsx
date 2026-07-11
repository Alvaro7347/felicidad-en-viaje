import { useState } from "react";
import { B } from "../data/brand";
import { Card } from "../components/Card";
import { APP_VERSION } from "./MyProfileScreen";

type Props = {
  mode: "self_learning" | "accompanied_learning" | null;
  onBack: () => void;
  onOpenPrivacy: () => void;
};

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "¿Cómo desbloqueo una clase?",
    a: "Cada clase se abre al completar la anterior. Tu viaje avanza una clase a la vez, con calma y sin presión.",
  },
  {
    q: "¿Dónde quedó mi progreso?",
    a: "Todo tu avance se guarda automáticamente en tu cuenta. Al volver a entrar retomas exactamente donde dejaste.",
  },
  {
    q: "¿Puedo repetir una clase?",
    a: "Sí. Puedes volver a cualquier clase ya completada desde el mapa del Puerto o desde la isla correspondiente.",
  },
  {
    q: "¿Cómo recupero mi contraseña?",
    a: "Desde la pantalla de inicio de sesión puedes solicitar el enlace de recuperación al correo con el que te registraste.",
  },
  {
    q: "¿Qué hago si todavía no tengo ukelele?",
    a: "Puedes avanzar en las primeras clases de escucha y pulso sin instrumento. Al llegar a la Isla del Ritmo lo ideal es tenerlo a mano.",
  },
];

const TIPS_GENERAL = [
  "Practica pocos minutos cada día.",
  "Disfruta el proceso.",
  "No te preocupes por equivocarte.",
  "Cada pequeño avance cuenta.",
];

const TIPS_PARENT = [
  "Celebra los avances.",
  "No corrijas constantemente.",
  "Practiquen juntos.",
  "Disfruten el proceso.",
];

export function HelpCenterScreen({ mode, onBack, onOpenPrivacy }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isAccompanied = mode === "accompanied_learning";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 4 }}>
      <BackChip onBack={onBack} />

      <div>
        <Chip>Centro de ayuda</Chip>
        <h1 style={heroTitle}>Estamos para acompañarte</h1>
        <p style={heroSubtitle}>
          Aquí encontrarás una guía breve, respuestas a dudas frecuentes y
          formas de conversar con nosotros cuando lo necesites.
        </p>
      </div>

      {/* 1. Cómo funciona */}
      <Card>
        <SectionLabel>1 · ¿Cómo funciona el Archipiélago?</SectionLabel>
        <p style={paragraph}>
          El Archipiélago es un viaje musical por islas. Cada isla contiene
          clases cortas que se desbloquean a tu ritmo. Todo lo que aprendes
          queda guardado en tu cuenta.
        </p>
        <button type="button" disabled style={placeholderBtn}>
          ▶ Ver video introductorio · Próximamente
        </button>
      </Card>

      {/* 2. FAQ */}
      <Card>
        <SectionLabel>2 · Preguntas frecuentes</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  border: `1px solid ${B.grayBorder}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: isOpen ? B.greenLight : "#FFFFFF",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    background: "transparent",
                    border: "none",
                    padding: "12px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    color: B.dark,
                  }}
                >
                  <span>{item.q}</span>
                  <span aria-hidden="true" style={{ color: B.greenDark }}>
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: "0 14px 14px",
                      fontSize: 13.5,
                      color: B.grayText,
                      lineHeight: 1.55,
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Necesitas ayuda */}
      <Card style={{ background: B.greenLight, borderColor: "rgba(46,230,174,0.4)" }}>
        <SectionLabel>3 · ¿Necesitas ayuda?</SectionLabel>
        <p style={paragraph}>
          Si algo no funciona o quieres conversar con nuestro equipo, escríbenos
          y te acompañamos.
        </p>
        <button
          type="button"
          onClick={() => {
            // Placeholder — se conectará a WhatsApp cuando esté disponible.
            window.alert("Muy pronto podrás conversar con SoundKeleles por WhatsApp.");
          }}
          style={ctaBtn}
        >
          💬 Hablar con SoundKeleles
        </button>
      </Card>

      {/* 4. Consejos */}
      <Card>
        <SectionLabel>4 · Consejos para aprender mejor</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TIPS_GENERAL.map((tip, i) => (
            <TipRow key={i}>{tip}</TipRow>
          ))}
        </div>

        {isAccompanied && (
          <>
            <div
              style={{
                marginTop: 14,
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: 14,
                fontWeight: 800,
                color: B.dark,
              }}
            >
              Cómo acompañar sin presionar
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              {TIPS_PARENT.map((tip, i) => (
                <TipRow key={`p-${i}`}>{tip}</TipRow>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* 5. Información */}
      <Card>
        <SectionLabel>5 · Información</SectionLabel>
        <InfoRow label="Versión" value={APP_VERSION} />
        <InfoRow label="Contacto" value="hola@soundkeleles.com" />
        <button
          type="button"
          onClick={onOpenPrivacy}
          style={{
            marginTop: 8,
            background: "transparent",
            border: `1px solid ${B.grayBorder}`,
            color: B.dark,
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: 13.5,
            borderRadius: 12,
            padding: "10px 14px",
            cursor: "pointer",
          }}
        >
          Ver privacidad y seguridad →
        </button>
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
      }}
    >
      {children}
    </div>
  );
}

function TipRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 10,
        background: "#FAFAF8",
        border: `1px solid ${B.grayBorder}`,
        fontSize: 13.5,
        color: B.dark,
        lineHeight: 1.45,
      }}
    >
      <span aria-hidden="true" style={{ color: B.green, fontWeight: 900 }}>
        ✓
      </span>
      <span>{children}</span>
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

const paragraph: React.CSSProperties = {
  margin: 0,
  fontSize: 13.5,
  color: B.grayText,
  lineHeight: 1.55,
};

const placeholderBtn: React.CSSProperties = {
  marginTop: 4,
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

const ctaBtn: React.CSSProperties = {
  marginTop: 4,
  width: "100%",
  border: "none",
  background: B.green,
  color: B.dark,
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 800,
  fontSize: 15,
  borderRadius: 12,
  padding: "13px 18px",
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(46,230,174,0.32)",
};
