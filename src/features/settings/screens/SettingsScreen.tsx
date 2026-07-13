/**
 * Centro de Ajustes MVP1.
 *
 * Un único hub con 4 sub-vistas: Perfil, Apariencia, Notificaciones, Acerca de.
 * Consume useUserSettings (bootstrap + mutaciones) y usePushRegistration.
 *
 * Diseño consciente:
 * - Sin dark mode visual completo (follow-up); la preferencia sí se persiste
 *   y se aplica sobre <html data-theme>.
 * - Push sólo se ofrece en producción real. En preview/iframe se muestra
 *   un mensaje explicativo sin ocultar la sección.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { B } from "@/features/archipielago/data/brand";
import { Card } from "@/features/archipielago/components/Card";
import { useUserSettings } from "../hooks/useUserSettings";
import { usePushRegistration } from "../hooks/usePushRegistration";
import {
  getAvatarSignedUrl,
  uploadAvatar,
} from "../services/settingsRepository";
import type { ThemePreference } from "../utils/theme";
import { APP_VERSION } from "@/features/archipielago/screens/MyProfileScreen";

type Tab = "home" | "profile" | "appearance" | "notifications" | "about";

interface Props {
  userEmail: string | null | undefined;
  onBack: () => void;
}

export function SettingsScreen({ userEmail, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("home");
  const s = useUserSettings();

  if (s.loading) {
    return <StateLine>Cargando ajustes…</StateLine>;
  }
  if (s.error || !s.data) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <BackChip onBack={onBack} />
        <Card>
          <SectionLabel>Ajustes no disponibles</SectionLabel>
          <p style={{ margin: 0, color: B.grayText, fontSize: 13.5, lineHeight: 1.55 }}>
            {s.error ?? "No pudimos cargar tus ajustes en este momento."}
          </p>
          <button type="button" onClick={s.refresh} style={secondaryCta}>
            Reintentar
          </button>
        </Card>
      </div>
    );
  }

  const goHome = () => setTab("home");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <BackChip onBack={tab === "home" ? onBack : goHome} label={tab === "home" ? "← Volver" : "← Ajustes"} />

      {tab === "home" && (
        <SettingsHome
          onOpenProfile={() => setTab("profile")}
          onOpenAppearance={() => setTab("appearance")}
          onOpenNotifications={() => setTab("notifications")}
          onOpenAbout={() => setTab("about")}
        />
      )}

      {tab === "profile" && (
        <ProfileTab
          name={s.data.profile?.name ?? ""}
          email={userEmail ?? s.data.profile?.email ?? null}
          avatarPath={s.data.settings.avatar_path}
          onNameChange={s.setName}
          onAvatarPathChange={s.setAvatarPath}
          userId={s.data.settings.user_id}
        />
      )}

      {tab === "appearance" && (
        <AppearanceTab
          value={(s.data.settings.theme ?? "system") as ThemePreference}
          onChange={(theme) => s.patchSettings({ theme })}
        />
      )}

      {tab === "notifications" && (
        <NotificationsTab settings={s.data.settings} onPatch={s.patchSettings} />
      )}

      {tab === "about" && <AboutTab />}
    </div>
  );
}

// ─────────────────────────── HOME ───────────────────────────

function SettingsHome({
  onOpenProfile,
  onOpenAppearance,
  onOpenNotifications,
  onOpenAbout,
}: {
  onOpenProfile: () => void;
  onOpenAppearance: () => void;
  onOpenNotifications: () => void;
  onOpenAbout: () => void;
}) {
  const items = [
    { key: "profile", icon: "👤", title: "Perfil", subtitle: "Foto y nombre", onClick: onOpenProfile },
    { key: "appearance", icon: "🎨", title: "Apariencia", subtitle: "Tema del sistema, claro u oscuro", onClick: onOpenAppearance },
    { key: "notifications", icon: "🔔", title: "Notificaciones", subtitle: "Recordatorios y reporte semanal", onClick: onOpenNotifications },
    { key: "about", icon: "ℹ️", title: "Acerca de", subtitle: "Versión y créditos", onClick: onOpenAbout },
  ];
  return (
    <>
      <div>
        <Chip>Ajustes</Chip>
        <h1 style={heroTitle}>Centro de ajustes</h1>
        <p style={heroSubtitle}>Personaliza tu experiencia en el Archipiélago.</p>
      </div>
      <Card>
        {items.map((it, i) => (
          <button
            key={it.key}
            type="button"
            onClick={it.onClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              width: "100%",
              background: "transparent",
              border: "none",
              padding: "12px 4px",
              cursor: "pointer",
              borderTop: i === 0 ? "none" : `1px solid ${B.grayBorder}`,
              textAlign: "left",
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 22, width: 28, textAlign: "center" }}>
              {it.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: B.dark }}>{it.title}</div>
              <div style={{ fontSize: 12.5, color: B.grayText, marginTop: 2 }}>{it.subtitle}</div>
            </div>
            <span aria-hidden="true" style={{ color: B.grayText, fontSize: 18 }}>›</span>
          </button>
        ))}
      </Card>
    </>
  );
}

// ─────────────────────────── PROFILE ───────────────────────────

function ProfileTab({
  name,
  email,
  avatarPath,
  onNameChange,
  onAvatarPathChange,
  userId,
}: {
  name: string;
  email: string | null;
  avatarPath: string | null;
  onNameChange: (n: string) => Promise<void>;
  onAvatarPathChange: (p: string | null) => Promise<void>;
  userId: string;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [draftName, setDraftName] = useState(name);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDraftName(name), [name]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = await getAvatarSignedUrl(avatarPath);
      if (!cancelled) setAvatarUrl(url);
    })();
    return () => {
      cancelled = true;
    };
  }, [avatarPath]);

  const dirty = draftName.trim() !== (name ?? "").trim() && draftName.trim().length > 0;

  const saveName = async () => {
    if (!dirty) return;
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await onNameChange(draftName.trim());
      setMsg("Nombre actualizado.");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setErr("La foto debe pesar menos de 3 MB.");
      return;
    }
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const path = await uploadAvatar(userId, file);
      await onAvatarPathChange(path);
      setMsg("Foto actualizada.");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TabTitle title="Perfil" subtitle="Cómo te vemos en tu viaje." />
      <Card>
        <SectionLabel>Foto</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: "#F1FBF5",
              border: `1px solid ${B.grayBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span aria-hidden="true" style={{ fontSize: 28 }}>🎵</span>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button type="button" onClick={() => fileRef.current?.click()} style={primaryCta} disabled={saving}>
              {avatarPath ? "Cambiar foto" : "Subir foto"}
            </button>
            {avatarPath && (
              <button
                type="button"
                onClick={() => onAvatarPathChange(null).catch((e) => setErr((e as Error).message))}
                style={ghostCta}
                disabled={saving}
              >
                Quitar
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
      </Card>

      <Card>
        <SectionLabel>Nombre</SectionLabel>
        <input
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          maxLength={80}
          style={textInput}
          placeholder="Tu nombre"
        />
        <button type="button" onClick={saveName} disabled={!dirty || saving} style={primaryCta}>
          {saving ? "Guardando…" : "Guardar nombre"}
        </button>
      </Card>

      <Card>
        <SectionLabel>Correo electrónico</SectionLabel>
        <div style={{ fontSize: 14, color: B.dark, fontWeight: 600 }}>{email ?? "—"}</div>
        <div style={{ fontSize: 12, color: B.grayText, marginTop: 4 }}>
          El correo se administra desde tu cuenta y no se puede cambiar aquí.
        </div>
      </Card>

      {msg && <Toast tone="ok">{msg}</Toast>}
      {err && <Toast tone="err">{err}</Toast>}
    </>
  );
}

// ─────────────────────────── APPEARANCE ───────────────────────────

function AppearanceTab({ value, onChange }: { value: ThemePreference; onChange: (t: ThemePreference) => Promise<void> }) {
  const options: Array<{ v: ThemePreference; label: string; hint: string }> = [
    { v: "system", label: "Sistema", hint: "Sigue la preferencia de tu dispositivo." },
    { v: "light", label: "Claro", hint: "Fondo claro, colores vivos." },
    { v: "dark", label: "Oscuro", hint: "Modo suave para la vista." },
  ];
  return (
    <>
      <TabTitle title="Apariencia" subtitle="Elige cómo se ve el Archipiélago." />
      <Card>
        {options.map((o, i) => (
          <label
            key={o.v}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 4px",
              borderTop: i === 0 ? "none" : `1px solid ${B.grayBorder}`,
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="theme"
              checked={value === o.v}
              onChange={() => onChange(o.v).catch(console.error)}
              style={{ marginTop: 4 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: B.dark, fontSize: 14.5 }}>{o.label}</div>
              <div style={{ fontSize: 12.5, color: B.grayText, marginTop: 2 }}>{o.hint}</div>
            </div>
          </label>
        ))}
      </Card>
      <p style={{ fontSize: 12, color: B.grayText, margin: "0 4px" }}>
        La preferencia se sincroniza en todos tus dispositivos.
      </p>
    </>
  );
}

// ─────────────────────────── NOTIFICATIONS ───────────────────────────

function NotificationsTab({
  settings,
  onPatch,
}: {
  settings: {
    notifications_enabled: boolean;
    weekly_report_enabled: boolean;
    inactivity_reminders_enabled: boolean;
    important_notices_enabled: boolean;
    timezone: string;
  };
  onPatch: (p: Partial<typeof settings>) => Promise<void>;
}) {
  const push = usePushRegistration();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const activate = async () => {
    setMsg(null);
    setErr(null);
    const res = await push.subscribe();
    if (res.ok) {
      await onPatch({ notifications_enabled: true }).catch(() => {});
      setMsg("Notificaciones activadas.");
    } else {
      setErr(mapPushError(res.reason));
    }
  };

  const deactivate = async () => {
    setMsg(null);
    setErr(null);
    const res = await push.unsubscribe();
    if (res.ok) {
      await onPatch({ notifications_enabled: false }).catch(() => {});
      setMsg("Notificaciones desactivadas en este dispositivo.");
    } else {
      setErr(mapPushError(res.reason));
    }
  };

  const test = async () => {
    setMsg(null);
    setErr(null);
    const res = await push.sendTest();
    if (res.ok) setMsg(`Enviamos una notificación de prueba (${res.sent}).`);
    else setErr("No se pudo enviar la prueba. Verifica que las notificaciones estén activas.");
  };

  const canToggleTypes = settings.notifications_enabled && push.status === "granted";

  return (
    <>
      <TabTitle
        title="Notificaciones"
        subtitle="Elige qué te avisamos y cuándo. Nunca compartimos tu información."
      />

      <Card>
        <SectionLabel>Estado en este dispositivo</SectionLabel>
        <PushStatusBlock status={push.status} reason={push.reason} endpoint={push.endpoint} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {push.status !== "granted" && (
            <button type="button" onClick={activate} disabled={push.busy || push.status === "blocked_preview" || push.status === "unsupported"} style={primaryCta}>
              {push.busy ? "Configurando…" : "Activar notificaciones"}
            </button>
          )}
          {push.status === "granted" && (
            <>
              <button type="button" onClick={test} disabled={push.busy} style={secondaryCta}>
                Enviar notificación de prueba
              </button>
              <button type="button" onClick={deactivate} disabled={push.busy} style={ghostCta}>
                Desactivar en este dispositivo
              </button>
            </>
          )}
        </div>
      </Card>

      <Card>
        <SectionLabel>¿Qué quieres recibir?</SectionLabel>
        <ToggleRow
          label="Reporte semanal"
          hint="Cada domingo a las 19:00, un resumen cálido de tu semana."
          checked={settings.weekly_report_enabled}
          disabled={!canToggleTypes}
          onChange={(v) => onPatch({ weekly_report_enabled: v })}
        />
        <ToggleRow
          label="Recordatorios cuando no vuelves"
          hint="Mensajes ocasionales, sin culpar, para retomar cuando quieras."
          checked={settings.inactivity_reminders_enabled}
          disabled={!canToggleTypes}
          onChange={(v) => onPatch({ inactivity_reminders_enabled: v })}
        />
        <ToggleRow
          label="Avisos importantes"
          hint="Novedades ocasionales del equipo SoundKeleles."
          checked={settings.important_notices_enabled}
          disabled={!canToggleTypes}
          onChange={(v) => onPatch({ important_notices_enabled: v })}
        />
      </Card>

      <Card>
        <SectionLabel>Zona horaria</SectionLabel>
        <div style={{ fontSize: 14, color: B.dark, fontWeight: 600 }}>{settings.timezone}</div>
        <div style={{ fontSize: 12, color: B.grayText, marginTop: 4 }}>
          Usamos esta zona horaria para enviarte el reporte semanal el domingo 19:00 hora local.
        </div>
      </Card>

      {msg && <Toast tone="ok">{msg}</Toast>}
      {err && <Toast tone="err">{err}</Toast>}
    </>
  );
}

function mapPushError(reason: string | null | undefined): string {
  if (!reason) return "No se pudo completar la acción.";
  if (reason.startsWith("permission_denied")) {
    return "El navegador bloqueó los permisos. Actívalos en la configuración del navegador.";
  }
  if (reason.startsWith("permission_")) return "Los permisos aún no fueron concedidos.";
  if (reason.includes("editor") || reason.includes("publicada")) return reason;
  return reason;
}

function PushStatusBlock({
  status,
  reason,
  endpoint,
}: {
  status: ReturnType<typeof usePushRegistration>["status"];
  reason: string | null;
  endpoint: string | null;
}) {
  const map: Record<typeof status, { tone: "ok" | "warn" | "err"; label: string }> = {
    loading: { tone: "warn", label: "Comprobando estado…" },
    unsupported: { tone: "err", label: "Este navegador no soporta notificaciones." },
    blocked_preview: { tone: "warn", label: "Disponible sólo en la app publicada." },
    denied: { tone: "err", label: "Notificaciones bloqueadas por el navegador." },
    default: { tone: "warn", label: "Aún no las has activado." },
    granted: { tone: "ok", label: "Activas en este dispositivo." },
  };
  const state = map[status];
  return (
    <div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 10px",
          borderRadius: 999,
          background:
            state.tone === "ok" ? "#EAF6F0" : state.tone === "warn" ? "#FFF6E5" : "#FBE9E9",
          color: state.tone === "ok" ? B.greenDark : state.tone === "warn" ? "#8B5A00" : "#8B1F1F",
          fontWeight: 700,
          fontSize: 12.5,
        }}
      >
        <span aria-hidden="true">●</span>
        {state.label}
      </div>
      {reason && (
        <div style={{ fontSize: 12, color: B.grayText, marginTop: 8, lineHeight: 1.55 }}>{reason}</div>
      )}
      {endpoint && (
        <div style={{ fontSize: 11, color: B.grayText, marginTop: 8, wordBreak: "break-all" }}>
          Endpoint: {endpoint.slice(0, 60)}…
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 4px",
        borderTop: `1px solid ${B.grayBorder}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 4 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: B.dark, fontSize: 14.5 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: B.grayText, marginTop: 2 }}>{hint}</div>
      </div>
    </label>
  );
}

// ─────────────────────────── ABOUT ───────────────────────────

function AboutTab() {
  const items = useMemo(
    () => [
      { k: "Versión", v: APP_VERSION },
      { k: "Equipo", v: "Equipo SoundKeleles" },
      { k: "Contacto", v: "aloha@soundkeleles.cl" },
    ],
    [],
  );
  return (
    <>
      <TabTitle title="Acerca de" subtitle="Créditos y versión de la app." />
      <Card>
        {items.map((it, i) => (
          <div
            key={it.k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderTop: i === 0 ? "none" : `1px solid ${B.grayBorder}`,
            }}
          >
            <div style={{ color: B.grayText, fontSize: 13 }}>{it.k}</div>
            <div style={{ color: B.dark, fontSize: 14, fontWeight: 600 }}>{it.v}</div>
          </div>
        ))}
      </Card>
      <p style={{ fontSize: 12, color: B.grayText, margin: "0 4px", lineHeight: 1.6 }}>
        Hecho con cariño en Chile. Toca la felicidad. 🌊🎵
      </p>
    </>
  );
}

// ─────────────────────────── COMMON UI ───────────────────────────

function TabTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <Chip>Ajustes</Chip>
      <h1 style={heroTitle}>{title}</h1>
      <p style={heroSubtitle}>{subtitle}</p>
    </div>
  );
}

function BackChip({ onBack, label = "← Volver" }: { onBack: () => void; label?: string }) {
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
      }}
    >
      {label}
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
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function Toast({ tone, children }: { tone: "ok" | "err"; children: React.ReactNode }) {
  return (
    <div
      role="status"
      style={{
        marginTop: 4,
        padding: "10px 12px",
        borderRadius: 12,
        background: tone === "ok" ? "#EAF6F0" : "#FBE9E9",
        color: tone === "ok" ? B.greenDark : "#8B1F1F",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

function StateLine({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "24px 8px", color: B.grayText, fontSize: 13.5 }}>{children}</div>
  );
}

// ─────────────────────────── STYLES ───────────────────────────

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

const primaryCta: React.CSSProperties = {
  marginTop: 12,
  width: "100%",
  border: "none",
  background: B.green,
  color: "#FFFFFF",
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 800,
  fontSize: 14,
  borderRadius: 12,
  padding: "12px 16px",
  cursor: "pointer",
};

const secondaryCta: React.CSSProperties = {
  marginTop: 8,
  width: "100%",
  border: `1px solid ${B.green}`,
  background: "#FFFFFF",
  color: B.greenDark,
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 700,
  fontSize: 13.5,
  borderRadius: 12,
  padding: "11px 16px",
  cursor: "pointer",
};

const ghostCta: React.CSSProperties = {
  marginTop: 4,
  width: "100%",
  border: `1px solid ${B.grayBorder}`,
  background: "#FFFFFF",
  color: B.grayText,
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 700,
  fontSize: 13,
  borderRadius: 12,
  padding: "10px 16px",
  cursor: "pointer",
};

const textInput: React.CSSProperties = {
  marginTop: 6,
  width: "100%",
  border: `1px solid ${B.grayBorder}`,
  background: "#FFFFFF",
  color: B.dark,
  fontSize: 15,
  padding: "12px 14px",
  borderRadius: 12,
  outline: "none",
  fontFamily: "Quicksand, sans-serif",
  boxSizing: "border-box",
};
