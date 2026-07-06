import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { B } from "../data/brand";
import { Card } from "../components/Card";
import { Btn } from "../components/Btn";

type Stage = "email" | "code";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function logEvent(name: string, data?: Record<string, unknown>) {
  try {
    const { data: sess } = await supabase.auth.getSession();
    await supabase.from("app_events").insert({
      user_id: sess.session?.user.id ?? null,
      event_name: name,
      event_data: data ?? null,
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

  const sendCode = async () => {
    setError(null);
    setInfo(null);
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      setError("Ingresa un correo válido.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      setError("No pudimos enviar el código. Intenta nuevamente.");
      logEvent("auth_login_error", { step: "send", message: error.message });
      return;
    }
    setEmail(clean);
    setStage("code");
    setInfo("Te enviamos un código. Puede tardar un minuto en llegar.");
    logEvent("auth_code_requested", { email: clean });
  };

  const verifyCode = async () => {
    setError(null);
    setInfo(null);
    const token = code.trim();
    if (token.length < 4) {
      setError("El código no es válido o expiró. Revisa tu correo e intenta otra vez.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError("El código no es válido o expiró. Revisa tu correo e intenta otra vez.");
      logEvent("auth_login_error", { step: "verify", message: error.message });
      return;
    }
    logEvent("auth_login_success", { email });
    // La app reaccionará vía onAuthStateChange.
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
              Escribe tu correo para recibir un código de acceso.
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
              <Btn variant="primary" fullWidth onClick={sendCode} disabled={loading}>
                {loading ? "Enviando..." : "Enviar código"}
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
              Te enviamos un código de acceso a <strong>{email}</strong>. Escríbelo aquí
              para entrar a tu viaje musical.
            </p>

            <div style={{ marginTop: 18 }}>
              <label htmlFor="code" style={labelStyle}>
                Código de acceso
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\s+/g, ""))}
                placeholder="123456"
                style={{ ...inputStyle, letterSpacing: 4, textAlign: "center", fontWeight: 700 }}
                disabled={loading}
              />
            </div>

            {info && !error && (
              <div style={{ color: B.greenDark, fontSize: 13, marginTop: 10 }}>{info}</div>
            )}
            {error && (
              <div style={{ color: B.pink, fontSize: 13, marginTop: 10 }}>{error}</div>
            )}

            <div style={{ marginTop: 18 }}>
              <Btn variant="primary" fullWidth onClick={verifyCode} disabled={loading}>
                {loading ? "Verificando..." : "Entrar a mi viaje"}
              </Btn>
            </div>

            <div style={{ marginTop: 12, textAlign: "center" }}>
              <button
                type="button"
                onClick={() => {
                  setStage("email");
                  setCode("");
                  setError(null);
                  setInfo(null);
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

            <div
              style={{
                marginTop: 16,
                padding: 14,
                background: B.gray,
                borderRadius: 14,
                fontSize: 12,
                color: B.dark,
                lineHeight: 1.5,
              }}
            >
              <strong>¿No llegó tu código?</strong>
              <br />
              Revisa spam o promociones. Si sigue sin llegar, espera un minuto e intenta
              reenviarlo. Si el problema continúa, avísale a tu profesor.
              <div style={{ marginTop: 10 }}>
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={loading}
                  style={{
                    background: "transparent",
                    border: `1.5px solid ${B.grayBorder}`,
                    borderRadius: 999,
                    padding: "6px 14px",
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: B.dark,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  Reenviar código
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
