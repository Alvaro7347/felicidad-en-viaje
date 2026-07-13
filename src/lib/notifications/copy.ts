/**
 * Copy de notificaciones (puro, isomórfico, sin dependencias de Supabase).
 * Toda la voz de marca vive aquí para que product review sea trivial.
 *
 * Reglas:
 * - Nunca culpabilizar.
 * - Nunca "rachas / rankings / comparaciones / minutos con cero".
 * - accompanied_learning siempre habla EN TERCERA PERSONA del estudiante.
 * - self_learning habla directo al usuario.
 */

export type Mode = "self_learning" | "accompanied_learning";

export interface WeeklyStats {
  lessonsCompleted: number;
  currentIslandTitle: string | null;
  currentIslandPct: number; // 0-100
  activeDays: number;
  nextLessonTitle: string | null;
}

/** Mensaje de reporte semanal. Cuando no hubo actividad, retorna copy alternativo (sin ceros). */
export function buildWeeklyReport(params: {
  mode: Mode;
  firstName: string; // para self: el user; para accompanied: el estudiante
  stats: WeeklyStats;
}): { title: string; body: string; url: string } {
  const { mode, firstName, stats } = params;
  const isAccompanied = mode === "accompanied_learning";
  const url = isAccompanied ? "/" : "/";
  const hadActivity = stats.lessonsCompleted > 0 || stats.activeDays > 0;

  if (!hadActivity) {
    if (isAccompanied) {
      return {
        title: `El viaje de ${firstName} sigue esperándolos`,
        body: "Esta semana no registramos nuevas actividades. Pueden continuar cuando quieran.",
        url,
      };
    }
    return {
      title: "Tu viaje sigue esperándote",
      body: "Esta semana no registramos nuevas clases, pero puedes volver cuando quieras.",
      url,
    };
  }

  const isla = stats.currentIslandTitle ?? "tu isla actual";
  const clases = stats.lessonsCompleted;
  const pct = Math.max(0, Math.min(100, Math.round(stats.currentIslandPct)));
  const dias = stats.activeDays;
  const next = stats.nextLessonTitle;

  if (isAccompanied) {
    const title = `Esta semana ${firstName} avanzó en ${isla}`;
    const parts = [
      `${firstName} completó ${clases === 1 ? "1 clase" : `${clases} clases`} en ${dias === 1 ? "1 día" : `${dias} días`} de actividad`,
      `Lleva ${pct}% de ${isla}.`,
      next ? `Próxima clase sugerida: ${next}.` : null,
    ].filter(Boolean);
    return { title, body: parts.join(". ").replace(/\.\.$/, "."), url };
  }

  const title = `Esta semana avanzaste en ${isla}`;
  const parts = [
    `Completaste ${clases === 1 ? "1 clase" : `${clases} clases`} en ${dias === 1 ? "1 día" : `${dias} días`} de actividad`,
    `Llevas ${pct}% de ${isla}.`,
    next ? `Próxima clase sugerida: ${next}.` : null,
  ].filter(Boolean);
  return { title, body: parts.join(". ").replace(/\.\.$/, "."), url };
}

/** Stage: días exactos desde última actividad significativa. */
export type ReactivationStage = 3 | 7 | 14 | 30;

export const REACTIVATION_STAGES: ReactivationStage[] = [3, 7, 14, 30];

export function buildReactivation(params: {
  mode: Mode;
  firstName: string; // self: usuario; accompanied: estudiante
  stage: ReactivationStage;
}): { title: string; body: string; url: string } {
  const { mode, firstName, stage } = params;
  const isAccompanied = mode === "accompanied_learning";
  const url = "/";

  if (isAccompanied) {
    switch (stage) {
      case 3:
        return {
          title: `${firstName} tiene un viaje esperando`,
          body: `Cuando quieran retomar, la próxima clase de ${firstName} sigue lista.`,
          url,
        };
      case 7:
        return {
          title: `Una semana sin novedades del viaje de ${firstName}`,
          body: "No hay presión. Cuando puedan sentarse juntos, seguimos donde lo dejaron.",
          url,
        };
      case 14:
        return {
          title: `El ukelele de ${firstName} los espera`,
          body: "Un rato corto basta para volver a tomar el ritmo. Estamos aquí para acompañarlos.",
          url,
        };
      case 30:
      default:
        return {
          title: `El viaje de ${firstName} sigue abierto`,
          body: "Volver es simple: mismo puerto, mismo mapa. Sin apuros y a su ritmo.",
          url,
        };
    }
  }

  switch (stage) {
    case 3:
      return {
        title: "Tu ukelele te espera",
        body: "Cuando tengas un momento, la próxima clase está lista para ti.",
        url,
      };
    case 7:
      return {
        title: "Una semana sin vernos por aquí",
        body: "Sin presión. Cuando quieras retomar, seguimos justo donde lo dejaste.",
        url,
      };
    case 14:
      return {
        title: "Un rato corto basta para volver",
        body: "Un pequeño paso hoy vale más que muchas metas grandes. Estamos aquí.",
        url,
      };
    case 30:
    default:
      return {
        title: "Tu viaje sigue abierto",
        body: "Mismo puerto, mismo mapa, sin apuros. Vuelve cuando quieras.",
        url,
      };
  }
}
