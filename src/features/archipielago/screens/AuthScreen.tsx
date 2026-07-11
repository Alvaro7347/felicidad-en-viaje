import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";

type Mode = "signin" | "signup" | "forgot";

const RESET_REDIRECT_PATH = "/restablecer-contrasena";

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

function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Correo o contraseña incorrectos.";
  if (m.includes("email not confirmed")) return "Debes confirmar tu correo antes de iniciar sesión.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Ese correo ya está registrado. Inicia sesión.";
  if (m.includes("password") && m.includes("6")) return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("pwned") || m.includes("compromised") || m.includes("leaked"))
    return "Esa contraseña aparece en filtraciones conocidas. Usa una diferente.";
  if (m.includes("rate") || m.includes("seconds")) return "Muchos intentos. Espera un momento e intenta de nuevo.";
  if (m.includes("network") || m.includes("fetch")) return "Sin conexión. Revisa tu internet.";
  return "No pudimos completar la acción. Intenta nuevamente.";
}

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const requestReset = async () => {
    setError(null);
    setInfo(null);
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      setError("Ingresa un correo válido.");
      return;
    }
    setLoading(true);
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}${RESET_REDIRECT_PATH}`
        : RESET_REDIRECT_PATH;
    const { error: err } = await supabase.auth.resetPasswordForEmail(clean, {
      redirectTo,
    });
    setLoading(false);
    // Mensaje neutral aunque haya error, para no revelar existencia de la cuenta.
    if (err) {
      logEvent("auth_reset_error", { message: err.message });
    } else {
      logEvent("auth_reset_requested", { email: clean });
    }
    setResetSent(true);
  };

  const submit = async () => {
    setError(null);
    setInfo(null);
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      setError("Ingresa un correo válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    if (mode === "signin") {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: clean,
        password,
      });
      setLoading(false);
      if (err) {
        setError(translateError(err.message));
        logEvent("auth_signin_error", { message: err.message });
        return;
      }
      logEvent("auth_signin_ok", { email: clean });
      // onAuthStateChange en ArchipelagoApp toma la sesión.
    } else {
      const { data, error: err } = await supabase.auth.signUp({
        email: clean,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      setLoading(false);
      if (err) {
        setError(translateError(err.message));
        logEvent("auth_signup_error", { message: err.message });
        return;
      }
      logEvent("auth_signup_ok", { email: clean });
      if (data.session) {
        // auto-confirm activo → sesión inmediata
        return;
      }
      // Fallback: si el proyecto exige confirmación
      setInfo("Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.");
      setMode("signin");
    }
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

  const isSignup = mode === "signup";

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
              style={{ width: "72%", height: "72%", objectFit: "contain", display: "block" }}
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

        <div
          style={{
            background: B.white,
            borderRadius: 22,
            padding: "20px 20px 18px",
            boxShadow: "0 20px 50px -20px rgba(28, 196, 142, 0.35)",
            border: "1px solid rgba(46, 230, 174, 0.18)",
          }}
        >
          {/* Toggle Login / Signup */}
          <div
            style={{
              display: "flex",
              gap: 6,
              background: "rgba(46, 230, 174, 0.10)",
              padding: 4,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            {(["signin", "signup"] as Mode[]).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    if (loading) return;
                    setMode(m);
                    setError(null);
                    setInfo(null);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    background: active ? B.white : "transparent",
                    color: active ? B.dark : B.greenDark,
                    boxShadow: active ? "0 4px 12px -6px rgba(28, 196, 142, 0.5)" : "none",
                  }}
                >
                  {m === "signin" ? "Iniciar sesión" : "Crear cuenta"}
                </button>
              );
            })}
          </div>

          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: 20,
              margin: 0,
              color: B.dark,
            }}
          >
            {isSignup ? "Crea tu cuenta" : "Bienvenido de vuelta"}
          </h2>
          <p style={{ fontSize: 14, color: B.dark, marginTop: 8, lineHeight: 1.5 }}>
            {isSignup
              ? "Usa tu correo y una contraseña de al menos 6 caracteres."
              : "Ingresa con tu correo y contraseña."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) submit();
            }}
          >
            <div style={{ marginTop: 16 }}>
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

            <div style={{ marginTop: 14 }}>
              <label htmlFor="password" style={labelStyle}>
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  style={{ ...inputStyle, paddingRight: 68 }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 10,
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: B.greenDark,
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    padding: "6px 8px",
                  }}
                  tabIndex={-1}
                >
                  {showPass ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ color: B.pink, fontSize: 13, marginTop: 10 }}>{error}</div>
            )}
            {info && (
              <div style={{ color: B.greenDark, fontSize: 13, marginTop: 10 }}>{info}</div>
            )}

            <div style={{ marginTop: 18 }}>
              <Btn type="submit" variant="primary" fullWidth disabled={loading}>
                {loading
                  ? isSignup
                    ? "Creando cuenta..."
                    : "Ingresando..."
                  : isSignup
                    ? "Crear cuenta"
                    : "Entrar al Archipiélago"}
              </Btn>
            </div>
          </form>

          <div style={{ marginTop: 10, textAlign: "center" }}>
            <button
              type="button"
              onClick={() => {
                if (loading) return;
                setMode(isSignup ? "signin" : "signup");
                setError(null);
                setInfo(null);
              }}
              style={linkBtn}
            >
              {isSignup ? "¿Ya tienes cuenta? Inicia sesión" : "¿Nuevo? Crea tu cuenta"}
            </button>
          </div>
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
