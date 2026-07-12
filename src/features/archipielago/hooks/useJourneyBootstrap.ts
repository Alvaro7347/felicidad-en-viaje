// Bootstrap del viaje: clasificación de modalidad + estado inicial.
//
// Este hook encapsula el `useEffect` histórico de ArchipelagoApp que, al
// iniciar sesión, decidía:
//   - si la cuenta está configurada,
//   - a qué modalidad pertenece (self / accompanied),
//   - si hay que reparar `experience_mode`,
//   - si hay que limpiar una modalidad fantasma,
//   - si el estado es ambiguo,
//   - qué pantalla inicial mostrar,
//   - qué nombres hidratar.
//
// El hook NO renderiza, NO abre modales, NO toca localStorage, NO decide la
// navegación pedagógica y NO guarda onboardings. Sólo consulta el repositorio
// y expone un resultado semántico. ArchipelagoApp sincroniza ese resultado con
// su estado local una única vez por corrida (referencia estable del resultado).

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getJourneyConfiguration,
  loadParentJourney,
  loadProfile,
  loadSelfOnboarding,
} from "../services/journeyRepository";
import type { Screen } from "../types";
import type { ParentOnboardingAnswers } from "@/features/parent-journey/types";
import type { useExperienceMode } from "../context/ExperienceModeContext";
import type { useMvp1ProgressContext } from "../context/Mvp1ProgressContext";

export type JourneyBootstrapStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error"
  | "ambiguous";

export interface JourneyBootstrapReady {
  hasOnboarding: boolean;
  initialScreen: Screen;
  userName: string;
  studentName?: string;
  parentJourneyAnswers?: ParentOnboardingAnswers | null;
  journeyOrigin: "student" | "parent";
}

export interface JourneyBootstrapResult {
  status: JourneyBootstrapStatus;
  ready: JourneyBootstrapReady | null;
  error: string | null;
  retry: () => void;
}

type ExperienceCtx = ReturnType<typeof useExperienceMode>;
type ProgressCtx = ReturnType<typeof useMvp1ProgressContext>;

interface Params {
  userId: string | null;
  experience: ExperienceCtx;
  progress: Pick<ProgressCtx, "logEvent">;
}

export function useJourneyBootstrap({
  userId,
  experience,
  progress,
}: Params): JourneyBootstrapResult {
  const [status, setStatus] = useState<JourneyBootstrapStatus>("idle");
  const [ready, setReady] = useState<JourneyBootstrapReady | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  // Referencias estables a experience / progress para no re-disparar el effect
  // cuando el proveedor cambia la identidad del objeto por rerender ajeno.
  const experienceRef = useRef(experience);
  experienceRef.current = experience;
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const retry = useCallback(() => {
    setRetryToken((n) => n + 1);
  }, []);

  useEffect(() => {
    // Sin sesión: reset a idle. No mostrar datos heredados.
    if (!userId) {
      setStatus("idle");
      setReady(null);
      setError(null);
      return;
    }
    // Esperar a que el contexto de modalidad termine de cargar profiles.experience_mode.
    if (experienceRef.current.loading) return;

    let cancelled = false;
    setStatus("loading");
    setReady(null);
    setError(null);

    (async () => {
      const exp = experienceRef.current;
      const log = progressRef.current.logEvent;

      let cfg;
      try {
        cfg = await getJourneyConfiguration(userId);
      } catch {
        if (cancelled) return;
        setError("No pudimos cargar tu viaje. Revisa tu conexión y reintenta.");
        setStatus("error");
        return;
      }
      if (cancelled) return;

      const hasPJ = cfg.hasParentJourney;
      const hasOnb = cfg.hasUserOnboarding;
      const persisted = exp.mode;

      // Caso C: ninguna tabla real → cuenta no configurada.
      // Si hay experience_mode "fantasma", limpiarlo y volver al selector.
      if (!hasPJ && !hasOnb) {
        if (persisted) {
          log("experience_mode_cleared_phantom", {
            user_id: userId,
            persisted_mode: persisted,
            event_reason: "no_real_onboarding_data",
          });
          try {
            await exp.clearMode();
          } catch (e) {
            console.error("[experience_mode] clearMode falló:", e);
            if (cancelled) return;
            setError("No pudimos actualizar tu configuración. Intenta nuevamente.");
            setStatus("error");
            return;
          }
        }
        if (cancelled) return;
        setReady({
          hasOnboarding: false,
          initialScreen: "onboarding",
          userName: "Navegante",
          journeyOrigin: "student",
        });
        setStatus("ready");
        return;
      }

      // Caso D: ambas tablas → ambiguo si no hay persisted; si hay, respetarlo.
      let mode: typeof persisted = persisted;
      if (hasPJ && hasOnb) {
        log("experience_mode_ambiguous", {
          user_id: userId,
          persisted_mode: persisted,
          has_parent_journey: true,
          has_user_onboarding: true,
        });
        if (!persisted) {
          if (cancelled) return;
          setStatus("ambiguous");
          return;
        }
      } else if (hasPJ) {
        mode = "accompanied_learning";
        if (persisted !== "accompanied_learning") {
          try {
            await exp.setMode("accompanied_learning", { allowOverride: true });
            log("experience_mode_repaired", {
              user_id: userId,
              resolved_mode: "accompanied_learning",
              event_reason: "inferred_from_parent_journeys",
            });
          } catch (e) {
            console.error("[experience_mode] repair accompanied falló:", e);
            if (cancelled) return;
            setError("No pudimos actualizar tu configuración. Intenta nuevamente.");
            setStatus("error");
            return;
          }
        }
      } else if (hasOnb) {
        mode = "self_learning";
        if (persisted !== "self_learning") {
          try {
            await exp.setMode("self_learning", { allowOverride: true });
            log("experience_mode_repaired", {
              user_id: userId,
              resolved_mode: "self_learning",
              event_reason: "inferred_from_user_onboarding",
            });
          } catch (e) {
            console.error("[experience_mode] repair self falló:", e);
            if (cancelled) return;
            setError("No pudimos actualizar tu configuración. Intenta nuevamente.");
            setStatus("error");
            return;
          }
        }
      }
      if (cancelled) return;

      // ── Modalidad ACOMPAÑADA (María José) ─────────────────────
      if (mode === "accompanied_learning") {
        let pj;
        try {
          pj = await loadParentJourney(userId);
        } catch {
          if (cancelled) return;
          setError("No pudimos cargar el viaje de acompañamiento. Intenta recargar.");
          setStatus("error");
          return;
        }
        if (cancelled) return;
        if (pj) {
          const answers = pj.onboarding_answers;
          const studentName = pj.student_name ?? answers?.student.name ?? "tu estudiante";
          const parentName = pj.parent_name ?? answers?.parent.name ?? "";
          setReady({
            hasOnboarding: true,
            initialScreen: "parent-journey-dashboard",
            userName: parentName || "Navegante",
            studentName,
            parentJourneyAnswers: answers ?? null,
            journeyOrigin: "parent",
          });
        } else {
          setReady({
            hasOnboarding: false,
            initialScreen: "parent-journey-intro",
            userName: "Navegante",
            journeyOrigin: "parent",
          });
        }
        setStatus("ready");
        return;
      }

      // ── Modalidad PERSONAL (Alejandra) ───────────────────────
      let onb;
      try {
        onb = await loadSelfOnboarding(userId);
      } catch {
        if (cancelled) return;
        setError("No pudimos cargar tu viaje. Revisa tu conexión y reintenta.");
        setStatus("error");
        return;
      }
      if (cancelled) return;
      if (onb) {
        let name = onb.name ?? "";
        if (!name) {
          try {
            const prof = await loadProfile(userId);
            if (cancelled) return;
            name = prof?.name ?? "Navegante";
          } catch {
            if (cancelled) return;
            name = "Navegante";
          }
        }
        setReady({
          hasOnboarding: true,
          initialScreen: "return-welcome",
          userName: name || "Navegante",
          journeyOrigin: "student",
        });
      } else {
        setReady({
          hasOnboarding: false,
          initialScreen: "diagnosis",
          userName: "Navegante",
          journeyOrigin: "student",
        });
      }
      setStatus("ready");
    })();

    return () => {
      cancelled = true;
    };
    // Dependencias intencionalmente mínimas: sólo re-ejecuta si cambia la
    // identidad de la sesión, si el contexto termina de cargar, si la modalidad
    // persistida cambia, o si el consumidor pide un retry. `experience` y
    // `progress` se leen por ref para evitar loops por rerenders ajenos.
  }, [userId, experience.loading, experience.mode, retryToken]);

  return { status, ready, error, retry };
}
