import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";

type Stage = "email" | "code";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const sendCode = async (targetEmail?: string) => {
    setError(null);
    setInfo(null);
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
    // signInWithOtp SIN emailRedirectTo → Supabase envía el código OTP en el correo.
    const { error: err } = await supabase.auth.signInWithOtp({
      email: clean,
      options: {
        shouldCreateUser: true,
      },
    });
    setLoading(false);
    if (err) {
      const msg = err.message?.toLowerCase() ?? "";
      if (msg.includes("rate") || msg.includes("seconds")) {
        setError("Espera un momento antes de pedir otro código.");
      } else {
        setError("No pudimos enviar el código. Intenta nuevamente.");
      }
      logEvent("auth_otp_send_error", { message: err.message });
      return;
    }
    setEmail(clean);
    setCode("");
    setStage("code");
    logEvent("auth_otp_requested", { email: clean });
  };

  const verifyCode = async () => {
    setError(null);
    setInfo(null);
    const token = code.trim().replace(/\s+/g, "");
    if (!/^\d{6}$/.test(token)) {
      setError("Ingresa el código de 6 dígitos.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    setLoading(false);
    if (err) {
      const msg = err.message?.toLowerCase() ?? "";
      if (msg.includes("expired")) {
        setError("Código vencido. Pide uno nuevo.");
      } else if (msg.includes("invalid") || msg.includes("token")) {
        setError("Código incorrecto. Revisa tu correo.");
      } else {
        setError("No pudimos verificar el código. Intenta nuevamente.");
      }
      logEvent("auth_otp_verify_error", { message: err.message });
      return;
    }
    logEvent("auth_otp_verified", { email });
    // onAuthStateChange en el resto de la app tomará la sesión.
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
  const codeInputStyle: React.CSSProperties = {
    ...inputStyle,
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8,
    fontFamily: "Space Grotesk, sans-serif",
    fontWeight: 700,
  };
  const linkBtn: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: B.pink,
    fontFamily: "Quicksand, sans-serif",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    padding: "6px 10px",
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        margin: "-24px -20px",
        padding: "20px 20px 24px",
        background:
          "radial-gradient(circle at 20% 0%, #C7F7E7 0%, transparent 55%), radial-gradient(circle at 90% 100%, #FFE1EE 0%, transparent 50%), linear-gradient(180deg, #E9FFF7 0%, #FFFFFF 100%)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 200,
          height: 200,
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
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(239, 87, 161, 0.18)",
          filter: "blur(10px)",
        }}
      />

      <div style={{ position: "relative", maxWidth: 420, margin: "0 auto" }}>
        {/* Logo + header */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              width: 104,
              height: 104,
              margin: "0 auto 12px",
              borderRadius: "50%",
              background: B.white,
              boxShadow: "0 12px 28px -10px rgba(46, 230, 174, 0.55)",
              border: "1px solid rgba(46, 230, 174, 0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={LOGO_SRC}
              alt="Archipiélago de la Felicidad"
              style={{
                width: "72%",
                height: "72%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
          <h1
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: 24,
              color: B.dark,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Archipiélago de la Felicidad
          </h1>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontSize: 14,
              color: B.greenDark,
              marginTop: 6,
              fontWeight: 600,
            }}
          >
            Tu viaje musical comienza aquí
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: B.white,
            borderRadius: 22,
            padding: "20px 20px 18px",
            boxShadow: "0 20px 50px -20px rgba(28, 196, 142, 0.35)",
            border: "1px solid rgba(46, 230, 174, 0.18)",
          }}
        >
          {stage === "email" ? (
            <>
              <h2
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  margin: 0,
                  color: B.dark,
                }}
              >
                Ingresa al Archipiélago
              </h2>
              <p style={{ fontSize: 14, color: B.dark, marginTop: 8, lineHeight: 1.5 }}>
                Escribe tu correo y te enviaremos un código de acceso.
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
                <Btn variant="primary" fullWidth onClick={() => sendCode()} disabled={loading}>
                  {loading ? "Enviando código..." : "Enviar código de acceso"}
                </Btn>
              </div>

              <p style={{ fontSize: 12, color: B.grayText, marginTop: 14, lineHeight: 1.5 }}>
                Usa el mismo correo con el que participarás en el taller.
              </p>
            </>
          ) : (
            <>
              <h2
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  margin: 0,
                  color: B.dark,
                }}
              >
                Revisa tu correo 💌
              </h2>
              <p style={{ fontSize: 14, color: B.dark, marginTop: 8, lineHeight: 1.5 }}>
                Te enviamos un código de acceso a <strong>{email}</strong>.
              </p>

              <div style={{ marginTop: 18 }}>
                <label htmlFor="code" style={labelStyle}>
                  Código de acceso
                </label>
                <input
                  id="code"
                  type="text"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  style={codeInputStyle}
                  disabled={loading}
                />
              </div>

              {error && (
                <div style={{ color: B.pink, fontSize: 13, marginTop: 10 }}>{error}</div>
              )}
              {info && (
                <div style={{ color: B.greenDark, fontSize: 13, marginTop: 10 }}>{info}</div>
              )}

              <div style={{ marginTop: 18 }}>
                <Btn variant="primary" fullWidth onClick={verifyCode} disabled={loading}>
                  {loading ? "Verificando..." : "Entrar al Archipiélago"}
                </Btn>
              </div>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={async () => {
                    if (loading) return;
                    await sendCode(email);
                    setInfo("Te enviamos un nuevo código.");
                  }}
                  style={linkBtn}
                  disabled={loading}
                >
                  Reenviar código
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (loading) return;
                    setStage("email");
                    setCode("");
                    setError(null);
                    setInfo(null);
                  }}
                  style={linkBtn}
                  disabled={loading}
                >
                  Cambiar correo
                </button>
              </div>
            </>
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            fontFamily: "Quicksand, sans-serif",
            fontSize: 12,
            color: B.greenDark,
            marginTop: 12,
            lineHeight: 1.5,
            fontWeight: 600,
          }}
        >
          🎸 Tu ukelele te espera al otro lado.
        </p>
      </div>
    </div>
  );
}
