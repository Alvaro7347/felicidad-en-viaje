import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { B } from "@/features/archipielago/data/brand";
import { Btn } from "@/features/archipielago/components/Btn";

export const Route = createFileRoute("/restablecer-contrasena")({
  head: () => ({
    meta: [
      { title: "Restablecer contraseña | Archipiélago de la Felicidad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

type Status = "waiting" | "ready" | "invalid" | "saving" | "success" | "error";

function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("session") || m.includes("expired") || m.includes("invalid"))
    return "El enlace ya no es válido. Solicita uno nuevo.";
  if (m.includes("same") && m.includes("password"))
    return "La nueva contraseña no puede ser igual a la anterior.";
  if (m.includes("pwned") || m.includes("compromised") || m.includes("leaked"))
    return "Esa contraseña aparece en filtraciones conocidas. Usa una diferente.";
  if (m.includes("network") || m.includes("fetch")) return "Sin conexión. Revisa tu internet.";
  return "No pudimos actualizar la contraseña. Intenta nuevamente.";
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("waiting");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let recovered = false;
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        recovered = true;
        setStatus("ready");
      } else if (event === "SIGNED_IN" && session && !recovered) {
        // Ya hay sesión activa: permitir cambio de contraseña igualmente.
        setStatus((s) => (s === "waiting" ? "ready" : s));
      }
    });

    // Fallback: si en ~2s no llegó PASSWORD_RECOVERY, verificar sesión.
    const timer = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setStatus((s) => (s === "waiting" ? "ready" : s));
      } else {
        setStatus((s) => (s === "waiting" ? "invalid" : s));
      }
    }, 2000);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setStatus("saving");
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setStatus("ready");
      setError(translateError(err.message));
      return;
    }
    // Cerrar la sesión de recuperación para forzar re-login con la nueva contraseña.
    await supabase.auth.signOut();
    setStatus("success");
  };

  const goToLogin = async () => {
    await supabase.auth.signOut().catch(() => {});
    navigate({ to: "/" });
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
        minHeight: "100vh",
        padding: "24px 20px",
        background:
          "radial-gradient(circle at 20% 0%, #C7F7E7 0%, transparent 55%), radial-gradient(circle at 90% 100%, #FFE1EE 0%, transparent 50%), linear-gradient(180deg, #E9FFF7 0%, #FFFFFF 100%)",
      }}
    >
      <div style={{ maxWidth: 420, margin: "40px auto 0" }}>
        <div
          style={{
            background: B.white,
            borderRadius: 22,
            padding: "24px 22px",
            boxShadow: "0 20px 50px -20px rgba(28, 196, 142, 0.35)",
            border: "1px solid rgba(46, 230, 174, 0.18)",
          }}
        >
          {status === "waiting" && (
            <>
              <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, margin: 0, color: B.dark }}>
                Verificando enlace...
              </h1>
              <p style={{ fontSize: 14, color: B.dark, marginTop: 10 }}>
                Un momento, estamos preparando tu recuperación.
              </p>
            </>
          )}

          {status === "invalid" && (
            <>
              <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, margin: 0, color: B.dark }}>
                Enlace no válido
              </h1>
              <p style={{ fontSize: 14, color: B.dark, marginTop: 10, lineHeight: 1.5 }}>
                El enlace ya no es válido. Solicita uno nuevo desde “¿Olvidaste tu contraseña?”.
              </p>
              <div style={{ marginTop: 18 }}>
                <Btn variant="primary" fullWidth onClick={goToLogin}>
                  Volver a iniciar sesión
                </Btn>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, margin: 0, color: B.dark }}>
                Contraseña actualizada correctamente
              </h1>
              <p style={{ fontSize: 14, color: B.dark, marginTop: 10, lineHeight: 1.5 }}>
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <div style={{ marginTop: 18 }}>
                <Btn variant="primary" fullWidth onClick={goToLogin}>
                  Volver a iniciar sesión
                </Btn>
              </div>
            </>
          )}

          {(status === "ready" || status === "saving") && (
            <>
              <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, margin: 0, color: B.dark }}>
                Crea tu nueva contraseña
              </h1>
              <p style={{ fontSize: 14, color: B.dark, marginTop: 8, lineHeight: 1.5 }}>
                Debe tener al menos 8 caracteres.
              </p>
              <form onSubmit={submit}>
                <div style={{ marginTop: 16 }}>
                  <label htmlFor="new-pass" style={labelStyle}>Nueva contraseña</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="new-pass"
                      type={showPass ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      style={{ ...inputStyle, paddingRight: 68 }}
                      disabled={status === "saving"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      style={{
                        position: "absolute", top: "50%", right: 10, transform: "translateY(-50%)",
                        background: "transparent", border: "none", color: B.greenDark,
                        fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 12,
                        cursor: "pointer", padding: "6px 8px",
                      }}
                      tabIndex={-1}
                    >
                      {showPass ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <label htmlFor="confirm-pass" style={labelStyle}>Confirmar nueva contraseña</label>
                  <input
                    id="confirm-pass"
                    type={showPass ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repite la contraseña"
                    style={inputStyle}
                    disabled={status === "saving"}
                  />
                </div>

                {error && (
                  <div style={{ color: B.pink, fontSize: 13, marginTop: 10 }}>{error}</div>
                )}

                <div style={{ marginTop: 18 }}>
                  <Btn type="submit" variant="primary" fullWidth disabled={status === "saving"}>
                    {status === "saving" ? "Actualizando..." : "Actualizar contraseña"}
                  </Btn>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
