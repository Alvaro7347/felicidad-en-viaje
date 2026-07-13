/**
 * Aplica el tema (system / light / dark) sobre <html data-theme>.
 * Los estilos concretos del tema oscuro son follow-up: esta capa
 * garantiza persistencia y detección de preferencia del sistema.
 */

export type ThemePreference = "system" | "light" | "dark";

function resolveActual(pref: ThemePreference): "light" | "dark" {
  if (pref === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return pref;
}

export function applyTheme(pref: ThemePreference): void {
  if (typeof document === "undefined") return;
  const actual = resolveActual(pref);
  document.documentElement.dataset.theme = actual;
  document.documentElement.dataset.themePref = pref;
}

/** Reacciona a cambios del sistema mientras el usuario prefiera "system". */
export function watchSystemTheme(getPref: () => ThemePreference): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    if (getPref() === "system") applyTheme("system");
  };
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}
