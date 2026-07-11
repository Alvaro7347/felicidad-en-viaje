import type { ExperienceMode } from "../context/ExperienceModeContext";

/**
 * Retorna el nombre del protagonista del viaje pedagógico.
 * - self_learning: el usuario autenticado (profile.name).
 * - accompanied_learning: el estudiante (studentName). Fallback a profile.name
 *   sólo si aún no se ha hidratado el nombre del estudiante.
 *
 * Usar siempre que un texto se dirija AL ESTUDIANTE o hable de "tu ruta",
 * "tu viaje", "tus clases". Para textos dirigidos al adulto (Mi perfil,
 * Cerrar sesión, saludos de la cuenta), seguir usando profile.name.
 */
export function getJourneyLearnerName(
  mode: ExperienceMode | null,
  profileName: string | null | undefined,
  studentName: string | null | undefined,
): string {
  const profile = (profileName ?? "").trim();
  const student = (studentName ?? "").trim();
  if (mode === "accompanied_learning") {
    return student || profile;
  }
  return profile;
}
