/**
 * URLs canónicas de la aplicación en producción.
 *
 * Motivación: los flujos de auth (reset de contraseña, magic link, confirmación
 * de email) requieren un `redirectTo` estable. Depender de
 * `window.location.origin` fue causa histórica de bucles y de correos que
 * apuntaban a URLs de preview obsoletas.
 *
 * En dev (`import.meta.env.DEV`) se acepta `window.location.origin` para no
 * romper el flujo local con `localhost`. En build de producción se fuerza la
 * URL canónica sin importar dónde esté sirviéndose el bundle.
 */

export const PROD_APP_URL = "https://soundkeleles-archipelago-journey.lovable.app";

const PASSWORD_RESET_PATH = "/restablecer-contrasena";

function getRuntimeOrigin(): string {
  if (import.meta.env.DEV && typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return PROD_APP_URL;
}

export function getPasswordResetRedirectUrl(): string {
  return `${getRuntimeOrigin()}${PASSWORD_RESET_PATH}`;
}
