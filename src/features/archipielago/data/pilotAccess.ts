// Correos autorizados para acceder a la Ruta María José (piloto privado).
// TODO: Agregar aquí el correo real de Carolina cuando esté definido.
export const MARIA_JOSE_PILOT_EMAILS: string[] = [
  "contacto@re-cuerda.cl",
];

export function isMariaJosePilotEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return MARIA_JOSE_PILOT_EMAILS.includes(email.trim().toLowerCase());
}
