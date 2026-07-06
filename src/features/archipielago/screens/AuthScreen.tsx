import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";

type Stage = "email" | "sent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// No usar window.location.origin aquí: en preview puede redirigir a lovable.dev.
const AUTH_REDIRECT_URL = "https://soundkeleles-archipielago-journey.lovable.app";

const LOGO_SRC = "/isologo-soundkeleles.jpg";

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
        emailRedirectTo: AUTH_REDIRECT_URL,
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
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        margin: "-24px -20px",
        padding: "40px 20px 32px",
        background:
          "radial-gradient(circle at 20% 0%, #C7F7E7 0%, transparent 55%), radial-gradient(circle at 90% 100%, #FFE1EE 0%, transparent 50%), linear-gradient(180deg, #E9FFF7 0%, #FFFFFF 100%)",
        overflow: "hidden",
      }}
    >
      {/* decorative blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(46, 230, 174, 0.25)",
          filter: "blur(8px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -80,
          left: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "rgba(239, 87, 161, 0.18)",
          filter: "blur(10px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "40%",
          left: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(46, 230, 174, 0.18)",
          filter: "blur(6px)",
        }}
      />

      <div style={{ position: "relative", maxWidth: 420, margin: "0 auto" }}>
        {/* Logo + header */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            style={{
              width: 200,
              height: 100,
              margin: "0 auto 14px",
              borderRadius: 24,
              background: B.white,
              boxShadow: "0 10px 30px -12px rgba(46, 230, 174, 0.55)",
              border: "1px solid rgba(46, 230, 174, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 12,
              boxSizing: "border-box",
            }}
          >
            <img
              src={LOGO_SRC}
              alt="SoundKeleles — Archipiélago de la Felicidad"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: 26,
              color: B.dark,
              lineHeight: 1.15,
            }}
          >
            Archipiélago
            <br />
            de la Felicidad
          </div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontSize: 15,
              color: B.greenDark,
              marginTop: 8,
              fontWeight: 600,
            }}
          >
            Tu viaje musical comienza aquí 🌊🎶
          </div>
          <div style={{ fontSize: 13, color: B.grayText, marginTop: 4 }}>
            Toca la felicidad, paso a paso.
          </div>
        </div>

        {/* Login card */}
        <div
          style={{
            background: B.white,
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 50px -20px rgba(28, 196, 142, 0.35)",
            border: "1px solid rgba(46, 230, 174, 0.18)",
          }}
        >
          {stage === "email" ? (
            <>
              <h1
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  margin: 0,
                  color: B.dark,
                }}
              >
                Ingresa al Archipiélago
              </h1>
              <p style={{ fontSize: 14, color: B.dark, marginTop: 8, lineHeight: 1.5 }}>
                Escribe tu correo y te enviaremos un enlace mágico para entrar a tu viaje musical.
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
                  {loading ? "Enviando enlace..." : "Enviar enlace de acceso ✨"}
                </Btn>
              </div>

              <p style={{ fontSize: 12, color: B.grayText, marginTop: 14, lineHeight: 1.5 }}>
                Usa el mismo correo con el que participarás en el taller.
              </p>
            </>
          ) : (
            <>
              <h1
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  margin: 0,
                  color: B.dark,
                }}
              >
                Revisa tu correo 💌
              </h1>
              <p style={{ fontSize: 14, color: B.dark, marginTop: 8, lineHeight: 1.5 }}>
                Te enviamos un enlace mágico a <strong>{email}</strong>. Ábrelo y toca el
                botón para entrar al Archipiélago.
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
        </div>

        {/* Emotional microcopy */}
        <p
          style={{
            textAlign: "center",
            fontFamily: "Quicksand, sans-serif",
            fontSize: 13,
            color: B.greenDark,
            marginTop: 18,
            lineHeight: 1.5,
            fontWeight: 600,
          }}
        >
          🎸 Tu ukelele te espera al otro lado.
        </p>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: B.grayText,
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          Guarda este viaje en tu celular y vuelve a practicar durante la semana.
        </p>
      </div>
    </div>
  );
}
