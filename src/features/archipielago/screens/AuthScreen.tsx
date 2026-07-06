import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { B } from "../data/brand";
import { Card } from "../components/Card";
import { Btn } from "../components/Btn";

type Stage = "email" | "sent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function logEvent(name: string, data?: Record<string, unknown>) {
  try {
    const { data: sess } = await supabase.auth.getSession();
    await supabase.from("app_events").insert({
      user_id: sess.session?.user.id ?? null,
      event_name: name,
      event_data: (data ?? null) as never,
    });
  } catch {
    /* silencioso */
  }
}

export function AuthScreen() {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendLink = async (targetEmail?: string) => {
    setError(null);
    const clean = (targetEmail ?? email).trim().toLowerCase();
    if (!clean) {
      setError("Ingresa tu correo.");
      return;
    }
    if (!EMAIL_RE.test(clean)) {
      setError("Ingresa un correo válido.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: clean,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (err) {
      const msg = err.message?.toLowerCase() ?? "";
      if (msg.includes("rate") || msg.includes("seconds")) {
        setError("Espera un momento antes de pedir otro enlace.");
      } else {
        setError("No pudimos enviar el enlace. Intenta nuevamente.");
      }
      logEvent("auth_magic_link_error", { message: err.message });
      return;
    }
    setEmail(clean);
    setStage("sent");
    logEvent("auth_magic_link_requested", { email: clean });
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "Quicksand, sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: B.dark,
    marginBottom: 6,
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: `1.5px solid ${B.grayBorder}`,
    fontFamily: "Quicksand, sans-serif",
    fontSize: 16,
    color: B.dark,
    background: B.white,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: 22,
            color: B.dark,
          }}
        >
          Archipiélago de la Felicidad
        </div>
        <div style={{ fontSize: 13, color: B.grayText, marginTop: 4 }}>
          Tu viaje musical
        </div>
      </div>

      <Card>
        {stage === "email" ? (
          <>
            <h1
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: 22,
                margin: 0,
                color: B.dark,
              }}
            >
              Ingresa al Archipiélago
            </h1>
            <p style={{ fontSize: 15, color: B.dark, marginTop: 8, lineHeight: 1.5 }}>
              Escribe tu correo para recibir un enlace de acceso a tu viaje musical.
            </p>

            <div style={{ marginTop: 18 }}>
              <label htmlFor="email" style={labelStyle}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                style={inputStyle}
                disabled={loading}
              />
            </div>

            {error && (
              <div style={{ color: B.pink, fontSize: 13, marginTop: 10 }}>{error}</div>
            )}

            <div style={{ marginTop: 18 }}>
              <Btn variant="primary" fullWidth onClick={() => sendLink()} disabled={loading}>
                {loading ? "Enviando..." : "Enviar enlace de acceso"}
              </Btn>
            </div>

            <p style={{ fontSize: 12, color: B.grayText, marginTop: 14, lineHeight: 1.5 }}>
              Usa el correo que entregaste para el taller.
            </p>
          </>
        ) : (
          <>
            <h1
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: 22,
                margin: 0,
                color: B.dark,
              }}
            >
              Revisa tu correo
            </h1>
            <p style={{ fontSize: 15, color: B.dark, marginTop: 8, lineHeight: 1.5 }}>
              Te enviamos un enlace de acceso a <strong>{email}</strong>. Abre tu correo
              y toca el botón para entrar al Archipiélago.
            </p>
            <p style={{ fontSize: 13, color: B.grayText, marginTop: 10, lineHeight: 1.5 }}>
              Si no lo ves, revisa spam o promociones. Si sigue sin llegar, espera un
              minuto e intenta enviarlo nuevamente.
            </p>

            {error && (
              <div style={{ color: B.pink, fontSize: 13, marginTop: 10 }}>{error}</div>
            )}

            <div style={{ marginTop: 18 }}>
              <Btn variant="primary" fullWidth onClick={() => sendLink(email)} disabled={loading}>
                {loading ? "Enviando..." : "Reenviar enlace"}
              </Btn>
            </div>

            <div style={{ marginTop: 12, textAlign: "center" }}>
              <button
                type="button"
                onClick={() => {
                  setStage("email");
                  setError(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: B.pink,
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
                disabled={loading}
              >
                Cambiar correo
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
