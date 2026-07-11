import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { B } from "./data/brand";
import { ONBOARDING_SCREENS } from "./data/screens";
import type { DiagAnswers, Screen } from "./types";
import { AuthScreen } from "./screens/AuthScreen";
import { BlockedIslandModal } from "./components/BlockedIslandModal";
import { useMvp1ProgressContext } from "./context/Mvp1ProgressContext";
import { useExperienceMode } from "./context/ExperienceModeContext";
import { findMvp1Lesson } from "./data/mvp1Progress";

import { AppHeader } from "./components/AppHeader";
import { DevNav, SHOW_DEV_NAV } from "./components/DevNav";
import { SplashScreen } from "./components/SplashScreen";

import { CelebrationScreen } from "./screens/CelebrationScreen";
import { DiagnosisResultScreen } from "./screens/DiagnosisResultScreen";
import { DiagnosisScreen } from "./screens/DiagnosisScreen";

import { MissionEightScreen } from "./screens/MissionEightScreen";
import { FirstMelodiesIslandScreen } from "./screens/FirstMelodiesIslandScreen";
import { FirstMelodiesLessonScreen } from "./screens/FirstMelodiesLessonScreen";
import { PulseIslandScreen } from "./screens/PulseIslandScreen";
import { RhythmIslandScreen } from "./screens/RhythmIslandScreen";
import { MusicIslandScreen } from "./screens/MusicIslandScreen";
import { JoyIslandScreen } from "./screens/JoyIslandScreen";
import { JoyLessonScreen } from "./screens/JoyLessonScreen";
import { PulseLessonScreen } from "./screens/PulseLessonScreen";
import { RhythmLessonScreen } from "./screens/RhythmLessonScreen";
import { MusicLessonScreen } from "./screens/MusicLessonScreen";
import { ChordsIslandScreen } from "./screens/ChordsIslandScreen";
import { ChordsLessonScreen } from "./screens/ChordsLessonScreen";
import { StrummingIslandScreen } from "./screens/StrummingIslandScreen";
import { StrummingLessonScreen } from "./screens/StrummingLessonScreen";
import { SongsIslandScreen } from "./screens/SongsIslandScreen";
import { SongsLessonScreen } from "./screens/SongsLessonScreen";
import { MissionNineScreen } from "./screens/MissionNineScreen";
import { MissionFourScreen } from "./screens/MissionFourScreen";
import { MissionGuideScreen } from "./screens/MissionGuideScreen";
import { MissionScreen } from "./screens/MissionScreen";
import { MissionSevenScreen } from "./screens/MissionSevenScreen";
import { MissionSixScreen } from "./screens/MissionSixScreen";
import { MissionThreeScreen } from "./screens/MissionThreeScreen";
import { MissionTwoScreen } from "./screens/MissionTwoScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { RouteScreen } from "./screens/RouteScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { ReturnWelcomeScreen } from "./screens/ReturnWelcomeScreen";

import { ParentJourneyIntroScreen } from "./screens/ParentJourneyIntroScreen";
import { ParentJourneyCreatedScreen } from "./screens/ParentJourneyCreatedScreen";
import { ParentJourneyDashboardScreen } from "@/features/parent-journey/screens/ParentJourneyDashboardScreen";
import { ParentOnboardingScreen, type ParentOnboardingAnswers } from "@/features/parent-journey/screens/ParentOnboardingScreen";
import { ParentJourneyDashboardHydrator } from "@/features/parent-journey/screens/ParentJourneyDashboardHydrator";


// Nodo de la ruta → pantalla de revisión. Explícito y fácil de extender.
const REVIEW_MISSION_BY_NODE: Record<string, Screen> = {
  n1: "mission-guide",
  n2: "mission-two",
  n3: "mission-three",
  n4: "mission-four",
  n5: "mission",
  n6: "mission-six",
  n7: "mission-seven",
  n8: "mission-eight",
  n9: "mission-nine",
};

const SPLASH_FADE_MS = 1050;
const SPLASH_HIDE_MS = 1350;

export function ArchipelagoApp() {
  // ── Splash inicial ─────────────────────────────────────────────
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setSplashFading(true), SPLASH_FADE_MS);
    const hide = setTimeout(() => setShowSplash(false), SPLASH_HIDE_MS);
    return () => {
      clearTimeout(fade);
      clearTimeout(hide);
    };
  }, []);

  // ── Sesión (Supabase Auth OTP) ─────────────────────────────────
  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [onboardingChecking, setOnboardingChecking] = useState(false);
  const [hasOnboarding, setHasOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setAuthChecking(false);
      if (s?.user) {
        supabase
          .from("profiles")
          .upsert(
            {
              id: s.user.id,
              email: s.user.email ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" },
          )
          .then(() => {});
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);


  // ── Estado del viaje ───────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>("welcome");
  const [diagAnswers, setDiagAnswers] = useState<DiagAnswers>({});
  // Nombre: no leer de localStorage global (podría pertenecer a otra cuenta).
  const [userName, setUserName] = useState<string>("Navegante");
  const [firstMelodiesLessonId, setFirstMelodiesLessonId] = useState<string>("m1");
  const [pulseLessonId, setPulseLessonId] = useState<string>("p1");
  const [rhythmLessonId, setRhythmLessonId] = useState<string>("r1");
  const [musicLessonId, setMusicLessonId] = useState<string>("music1");
  const [joyLessonId, setJoyLessonId] = useState<string>("joy1");
  const [chordsLessonId, setChordsLessonId] = useState<string>("chords1");
  const [strummingLessonId, setStrummingLessonId] = useState<string>("strumming1");
  const [songsLessonId, setSongsLessonId] = useState<string>("songs1");
  const [parentJourneyAnswers, setParentJourneyAnswers] = useState<ParentOnboardingAnswers | null>(null);
  const [journeyOrigin, setJourneyOrigin] = useState<"student" | "parent">("student");
  const [routeStudentName, setRouteStudentName] = useState<string | undefined>(undefined);

  // ── Progreso MVP1 + Modo de experiencia ────────────────────────
  const progress = useMvp1ProgressContext();
  const experience = useExperienceMode();
  const [blockedModal, setBlockedModal] = useState<null | "island" | "lesson">(null);
  const [parentJourneyLoadError, setParentJourneyLoadError] = useState<string | null>(null);
  const [ambiguousMode, setAmbiguousMode] = useState(false);
  // Selección temporal en memoria — NO consolida modalidad hasta que el onboarding
  // correspondiente se guarde correctamente en Supabase.
  const [pendingExperienceMode, setPendingExperienceMode] = useState<
    "self_learning" | "accompanied_learning" | null
  >(null);

  // ── Aislamiento entre sesiones: al cambiar user_id, limpiar estado local
  //    para que la nueva cuenta nunca vea datos de la anterior.
  const lastUidRef = useRef<string | null>(null);
  useEffect(() => {
    const uid = session?.user.id ?? null;
    if (lastUidRef.current !== uid) {
      lastUidRef.current = uid;
      setHasOnboarding(null);
      setUserName("Navegante");
      setParentJourneyAnswers(null);
      setRouteStudentName(undefined);
      setJourneyOrigin("student");
      setDiagAnswers({});
      setAmbiguousMode(false);
      setParentJourneyLoadError(null);
      setPendingExperienceMode(null);
      setScreen("welcome");
    }
  }, [session?.user.id]);


  // ── Detección de modalidad + estado inicial (Supabase como fuente) ─
  // Regla:
  //  1) Si profiles.experience_mode tiene valor → respetarlo SIEMPRE.
  //  2) Si es null → inferir usando SOLO parent_journeys/user_onboarding del
  //     MISMO user_id. Nunca usar cachés globales de otra cuenta.
  //  3) Caso ambiguo (ambas tablas + mode=null) → estado neutro, no elegir.
  useEffect(() => {
    const uid = session?.user.id;
    if (!uid) {
      setHasOnboarding(null);
      return;
    }
    if (experience.loading) return;
    let cancelled = false;
    setOnboardingChecking(true);
    setParentJourneyLoadError(null);
    setAmbiguousMode(false);

    (async () => {
      // Consultar SIEMPRE ambas tablas: la existencia real de datos manda
      // sobre profiles.experience_mode.
      const [pjRes, onbRes] = await Promise.all([
        supabase.from("parent_journeys").select("user_id").eq("user_id", uid).maybeSingle(),
        supabase.from("user_onboarding").select("user_id").eq("user_id", uid).maybeSingle(),
      ]);
      if (cancelled) return;
      if (pjRes.error || onbRes.error) {
        setParentJourneyLoadError("No pudimos cargar tu viaje. Revisa tu conexión y reintenta.");
        setOnboardingChecking(false);
        return;
      }

      const hasPJ = !!pjRes.data;
      const hasOnb = !!onbRes.data;
      const persisted = experience.mode;

      // Caso C: ninguna tabla real → cuenta no configurada.
      // Si hay un experience_mode "fantasma", limpiarlo y volver al selector.
      if (!hasPJ && !hasOnb) {
        if (persisted) {
          progress.logEvent("experience_mode_cleared_phantom", {
            user_id: uid,
            persisted_mode: persisted,
            event_reason: "no_real_onboarding_data",
          });
          try { await experience.clearMode(); } catch (e) {
            console.warn("[experience_mode] clearMode falló:", e);
          }
        }
        setHasOnboarding(false);
        setScreen("onboarding");
        setOnboardingChecking(false);
        return;
      }

      // Caso D: ambas tablas → ambiguo. Respetar persisted si es válido; si no, bloquear.
      let mode: typeof persisted = persisted;
      if (hasPJ && hasOnb) {
        progress.logEvent("experience_mode_ambiguous", {
          user_id: uid,
          persisted_mode: persisted,
          has_parent_journey: true,
          has_user_onboarding: true,
        });
        if (!persisted) {
          setAmbiguousMode(true);
          setOnboardingChecking(false);
          return;
        }
        // mode = persisted (respetar)
      } else if (hasPJ) {
        // Caso B: sólo parent_journeys → accompanied_learning.
        mode = "accompanied_learning";
        if (persisted !== "accompanied_learning") {
          try {
            await experience.setMode("accompanied_learning", { allowOverride: true });
            progress.logEvent("experience_mode_repaired", {
              user_id: uid,
              resolved_mode: "accompanied_learning",
              event_reason: "inferred_from_parent_journeys",
            });
          } catch (e) { console.warn("[experience_mode] repair falló:", e); }
        }
      } else if (hasOnb) {
        // Caso A: sólo user_onboarding → self_learning.
        mode = "self_learning";
        if (persisted !== "self_learning") {
          try {
            await experience.setMode("self_learning", { allowOverride: true });
            progress.logEvent("experience_mode_repaired", {
              user_id: uid,
              resolved_mode: "self_learning",
              event_reason: "inferred_from_user_onboarding",
            });
          } catch (e) { console.warn("[experience_mode] repair falló:", e); }
        }
      }
      if (cancelled) return;

      // ── Modalidad ACOMPAÑADA (María José) ─────────────────────
      if (mode === "accompanied_learning") {
        const { data: pj, error } = await supabase
          .from("parent_journeys")
          .select("student_name, parent_name, teacher_name, plan_name, status, onboarding_answers")
          .eq("user_id", uid)
          .maybeSingle();
        if (cancelled) return;
        if (error) {
          setParentJourneyLoadError("No pudimos cargar el viaje de acompañamiento. Intenta recargar.");
          setOnboardingChecking(false);
          return;
        }
        if (pj) {
          const answers = (pj.onboarding_answers ?? null) as ParentOnboardingAnswers | null;
          if (answers) setParentJourneyAnswers(answers);
          const studentName = pj.student_name ?? answers?.student.name ?? "Lucía";
          const parentName = pj.parent_name ?? answers?.parent.name ?? "";
          setRouteStudentName(studentName);
          setUserName(parentName || "Navegante");
          setJourneyOrigin("parent");
          setHasOnboarding(true);
          setScreen("parent-journey-dashboard");
        } else {
          setHasOnboarding(false);
          setScreen("parent-journey-intro");
        }
        setOnboardingChecking(false);
        return;
      }

      // ── Modalidad PERSONAL (Alejandra) ───────────────────────
      const { data: onb, error: onbError } = await supabase
        .from("user_onboarding")
        .select("answers")
        .eq("user_id", uid)
        .maybeSingle();
      if (cancelled) return;
      if (onbError) {
        setParentJourneyLoadError("No pudimos cargar tu viaje. Revisa tu conexión y reintenta.");
        setOnboardingChecking(false);
        return;
      }
      if (onb) {
        const answers = (onb.answers ?? {}) as { name?: string; answers?: DiagAnswers };
        let name = answers.name ?? "";
        if (!name) {
          const { data: prof } = await supabase
            .from("profiles").select("name").eq("id", uid).maybeSingle();
          if (cancelled) return;
          name = prof?.name ?? "Navegante";
        }
        setUserName(name || "Navegante");
        setJourneyOrigin("student");
        setHasOnboarding(true);
        setScreen("return-welcome");
      } else {
        setHasOnboarding(false);
        setScreen("diagnosis");
      }
      setOnboardingChecking(false);
    })();
    return () => { cancelled = true; };
  }, [session?.user.id, experience.loading, experience.mode]);


  // ── Medición: app_opened + return_visit (una vez por carga con sesión) ──
  const appOpenedLoggedRef = useRef(false);
  useEffect(() => {
    if (appOpenedLoggedRef.current) return;
    if (!session?.user.id) return;
    if (progress.loading) return;
    if (hasOnboarding === null) return;
    appOpenedLoggedRef.current = true;
    const cur = progress.getCurrentLessonId();
    const entry = cur ? findMvp1Lesson(cur) : null;
    const current_island_id = entry?.islandId ?? null;
    progress.logEvent("app_opened", {
      current_lesson_id: cur,
      current_island_id,
      has_onboarding: !!hasOnboarding,
    });
    if (hasOnboarding && cur && cur !== "n1") {
      progress.logEvent("return_visit", {
        current_lesson_id: cur,
        current_island_id,
      });
    }
  }, [session?.user.id, progress.loading, hasOnboarding, progress]);

  const goToRoute = () => {
    // Preservar contexto de acompañamiento en modalidad María José.
    if (experience.mode === "accompanied_learning") {
      setJourneyOrigin("parent");
      // routeStudentName se mantiene tal como fue hidratado desde parent_journeys.
    } else {
      setJourneyOrigin("student");
      setRouteStudentName(undefined);
    }
    setScreen("route");
  };
  const goHome = () => {
    if (experience.mode === "accompanied_learning") {
      setScreen("parent-journey-dashboard");
    } else {
      goToRoute();
    }
  };
  const isOnboarding = ONBOARDING_SCREENS.includes(screen);

  // Intento de abrir isla bloqueada (Ritmo en adelante durante MVP1)
  const openLockedIsland = (islandId: string) => {
    setBlockedModal("island");
    progress.logEvent("blocked_island_clicked", { island_id: islandId });
  };

  // Intento de abrir lección: valida contra el progreso MVP1
  const openLessonGuarded = (
    lessonId: string,
    lessonScreen: Screen,
    setLessonId: (id: string) => void,
  ) => {
    if (progress.loading) return; // Esperar a tener progreso real antes de decidir.
    if (!progress.isLessonUnlocked(lessonId)) {
      setBlockedModal("lesson");
      progress.logEvent("blocked_lesson_clicked", { lesson_id: lessonId });
      return;
    }
    setLessonId(lessonId);
    setScreen(lessonScreen);
    progress.logEvent("lesson_opened", { lesson_id: lessonId });
  };

  // Ir a la pantalla de una misión (Puerto) sólo si está desbloqueada.
  const openMissionGuarded = (lessonId: string) => {
    if (progress.loading) return;
    const entry = findMvp1Lesson(lessonId);
    if (!entry) return;
    if (!progress.isLessonUnlocked(lessonId)) {
      setBlockedModal("lesson");
      progress.logEvent("blocked_lesson_clicked", { lesson_id: lessonId });
      return;
    }
    setScreen(entry.screen);
    progress.logEvent("lesson_opened", { lesson_id: lessonId });
  };


  // ── Compuerta de sesión ────────────────────────────────────────
  if (session && ambiguousMode) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: B.gray,
          color: B.dark,
          fontFamily: "Quicksand, Arial, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 20, color: B.dark }}>
            Estamos revisando tu acceso
          </div>
          <div style={{ fontSize: 14, color: B.grayText, lineHeight: 1.55 }}>
            Encontramos más de una configuración asociada a esta cuenta. Estamos revisando tu acceso para no mezclar información. Reintenta en unos segundos o vuelve a iniciar sesión.
          </div>
          <button
            type="button"
            onClick={() => { setAmbiguousMode(false); void experience.refresh(); }}
            style={{
              alignSelf: "center",
              border: "none",
              background: B.green,
              color: B.dark,
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: 14,
              borderRadius: 12,
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
          <button
            type="button"
            onClick={() => { void experience.signOutAndClear(); }}
            style={{
              alignSelf: "center",
              border: "none",
              background: "transparent",
              color: B.grayText,
              fontSize: 13,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </main>
    );
  }
  if (authChecking || experience.loading || (session && (onboardingChecking || hasOnboarding === null))) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: B.gray,
          color: B.dark,
          fontFamily: "Quicksand, Arial, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showSplash && <SplashScreen fading={splashFading} />}
        <div style={{ fontSize: 14, color: B.grayText }}>
          {session ? "Preparando tu viaje…" : "Cargando…"}
        </div>
      </main>
    );
  }


  if (!session) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: B.gray,
          color: B.dark,
          fontFamily: "Quicksand, Arial, sans-serif",
          padding: "16px 16px 48px",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <AuthScreen />
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: B.gray,
        color: B.dark,
        fontFamily: "Quicksand, Arial, sans-serif",
        padding: "16px 16px 48px",
      }}
    >
      {showSplash && <SplashScreen fading={splashFading} />}

      {/* Panel de navegación interna — solo visible en desarrollo */}
      {SHOW_DEV_NAV && (
        <DevNav
          current={screen}
          onGo={(entry) => {
            if (entry.lessonGroup === 'first-melodies' && entry.lessonId) {
              setFirstMelodiesLessonId(entry.lessonId);
            } else if (entry.lessonGroup === 'pulse' && entry.lessonId) {
              setPulseLessonId(entry.lessonId);
            } else if (entry.lessonGroup === 'rhythm' && entry.lessonId) {
              setRhythmLessonId(entry.lessonId);
            } else if (entry.lessonGroup === 'music' && entry.lessonId) {
              setMusicLessonId(entry.lessonId);
            } else if (entry.lessonGroup === 'joy' && entry.lessonId) {
              setJoyLessonId(entry.lessonId);
            } else if (entry.lessonGroup === 'chords' && entry.lessonId) {
              setChordsLessonId(entry.lessonId);
            } else if (entry.lessonGroup === 'strumming' && entry.lessonId) {
              setStrummingLessonId(entry.lessonId);
            } else if (entry.lessonGroup === 'songs' && entry.lessonId) {
              setSongsLessonId(entry.lessonId);
            }
            setScreen(entry.screen);
          }}
        />
      )}

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {screen !== "return-welcome" && !isOnboarding && (
          <AppHeader
            screen={screen}
            onHome={isOnboarding ? undefined : goHome}
            onOpenGuide={() => setScreen("mission-guide")}
            userName={userName}
          />
        )}
        {parentJourneyLoadError && (
          <div style={{ margin: "8px 0", padding: 12, borderRadius: 12, background: "#FDE7EA", color: B.dark, fontSize: 13 }}>
            {parentJourneyLoadError}{" "}
            <button
              type="button"
              onClick={() => { void experience.refresh(); }}
              style={{ background: "transparent", border: "none", color: B.dark, textDecoration: "underline", cursor: "pointer" }}
            >
              Reintentar
            </button>
          </div>
        )}

        {screen === "return-welcome" && (
          <ReturnWelcomeScreen
            userName={userName}
            loading={progress.loading}
            ctaLabel={(() => {
              if (progress.loading) return "Preparando tu viaje…";
              const cur = progress.getCurrentLessonId();
              if (cur?.startsWith("m")) return "Continuar en Primeras Melodías";
              if (cur?.startsWith("p")) return "Continuar en Isla del Pulso";
              return "Entrar a mi Archipiélago";
            })()}
            onEnter={() => {
              if (progress.loading) return;
              const cur = progress.getCurrentLessonId();
              // cur === null → completó todo MVP1 (hasta p11). Mostrar Isla del Pulso.
              if (!cur) { setScreen("pulse-island"); return; }
              if (cur.startsWith("m")) { setScreen("first-melodies-island"); return; }
              if (cur.startsWith("p")) { setScreen("pulse-island"); return; }
              // n1..n9 o cualquier otro caso → Puerto / RouteScreen.
              setScreen("route");
            }}
          />
        )}


        {screen === "parent-journey-intro" && (() => {
          // Protección: si la cuenta ya declaró modalidad personal, no debería
          // ver esta pantalla. Redirigir al retorno de Alejandra.
          if (experience.mode === "self_learning") {
            setTimeout(() => setScreen("return-welcome"), 0);
            return null;
          }
          return (
            <ParentJourneyIntroScreen
              onCreate={() => setScreen("parent-onboarding")}
              onOpenDashboard={
                hasOnboarding ? () => setScreen("parent-journey-dashboard") : undefined
              }
            />
          );
        })()}

        {screen === "parent-onboarding" && (
          <ParentOnboardingScreen
            onCancel={() => setScreen("parent-journey-intro")}
            onComplete={async (ans: ParentOnboardingAnswers) => {
              const uid = session?.user.id;
              if (!uid) {
                throw new Error("No pudimos guardar el viaje musical. Intenta nuevamente.");
              }
              const studentName = ans.student.name.trim();
              const parentName = ans.parent.name.trim();
              const planName = ans.practice.planName?.trim() || "Plan Semanal Presencial";

              // Upsert en parent_journeys (una cuenta = un viaje).
              try {
                const { error } = await supabase.from("parent_journeys").upsert(
                  {
                    user_id: uid,
                    student_name: studentName || "",
                    parent_name: parentName || "",
                    teacher_name: "Álvaro",
                    plan_name: planName,
                    status: "pilot",
                    onboarding_answers: ans as unknown as never,
                  },
                  { onConflict: "user_id" },
                );
                if (error) {
                  console.warn("[parent_journeys] upsert failed:", error);
                  throw new Error("No pudimos guardar el viaje musical. Intenta nuevamente.");
                }
              } catch (e) {
                if (e instanceof Error && e.message.startsWith("No pudimos")) throw e;
                console.warn("[parent_journeys] upsert threw:", e);
                throw new Error("No pudimos guardar el viaje musical. Intenta nuevamente.");
              }

              // Éxito: persistir modalidad (sólo si aún no está consolidada) + cache y navegar.
              if (experience.mode !== "accompanied_learning") {
                try {
                  await experience.setMode("accompanied_learning");
                } catch (e) {
                  console.warn("[experience_mode] setMode post-upsert falló:", e);
                }
              }
              try {
                window.localStorage.setItem(
                  "archipielago_parent_journey_lucia",
                  JSON.stringify({ answers: ans, savedAt: new Date().toISOString() }),
                );
              } catch { /* noop */ }
              setParentJourneyAnswers(ans);
              setRouteStudentName(studentName);
              setJourneyOrigin("parent");
              setHasOnboarding(true);
              setScreen("parent-journey-created");
            }}


          />
        )}

        {screen === "parent-journey-created" && (
          <ParentJourneyCreatedScreen
            onContinue={() => setScreen("parent-journey-dashboard")}
            studentName={parentJourneyAnswers?.student.name}
            parentName={parentJourneyAnswers?.parent.name}
            relationship={parentJourneyAnswers?.parent.relationship}
            planName={parentJourneyAnswers?.practice.planName}
            experience={parentJourneyAnswers?.student.experience}
          />
        )}

        {screen === "parent-journey-dashboard" && (() => {
          const uid = session?.user.id;
          if (!uid) return null;
          const initStudent = parentJourneyAnswers?.student.name;
          const initParent = parentJourneyAnswers?.parent.name;
          return (
            <ParentJourneyDashboardHydrator
              userId={uid}
              initialStudentName={initStudent}
              initialParentName={initParent}
              onHydrated={({ studentName, parentName, answers }) => {
                if (answers) setParentJourneyAnswers(answers);
                setRouteStudentName(studentName);
                if (parentName) setUserName(parentName);
                setJourneyOrigin("parent");
                setHasOnboarding(true);
              }}
              onMissing={() => {
                // Solo Supabase confirmó que NO existe fila → recién ahora al onboarding.
                setHasOnboarding(false);
                setScreen("parent-journey-intro");
              }}
              onOpenJourney={(studentName) => {
                setJourneyOrigin("parent");
                setRouteStudentName(studentName);
                setScreen("route");
              }}
            />
          );
        })()}

        {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("onboarding")} />}

        {screen === "onboarding" && (() => {
          // Protección: si la cuenta ya tiene modalidad consolidada, no permitir
          // que se muestre el selector de experiencia. Redirigir al destino real.
          if (experience.mode === "accompanied_learning") {
            setTimeout(() => setScreen("parent-journey-dashboard"), 0);
            return null;
          }
          if (experience.mode === "self_learning") {
            setTimeout(() => setScreen("return-welcome"), 0);
            return null;
          }
          return (
            <OnboardingScreen
              onStart={() => setScreen("diagnosis")}
              onSelectProfile={(id) => {
                if (id === "empezar") {
                  // Selección temporal — NO consolida modalidad hasta guardar user_onboarding.
                  setPendingExperienceMode("self_learning");
                  setJourneyOrigin("student");
                  setScreen("diagnosis");
                } else if (id === "acompanar") {
                  // Selección temporal — NO consolida modalidad hasta guardar parent_journeys.
                  setPendingExperienceMode("accompanied_learning");
                  setJourneyOrigin("parent");
                  setScreen("parent-journey-intro");
                }
              }}
            />

          );
        })()}

        {screen === "diagnosis" && (() => {
          // Protección: el diagnóstico de Alejandra no debe ejecutarse ni
          // sobrescribir profiles.name cuando la cuenta ya está en modalidad
          // acompañada. Redirigir al panel de acompañamiento.
          if (experience.mode === "accompanied_learning") {
            progress.logEvent("diagnosis_blocked_by_mode", {
              persisted_mode: "accompanied_learning",
            });
            setTimeout(() => setScreen("parent-journey-dashboard"), 0);
            return null;
          }
          return (
            <DiagnosisScreen
              onComplete={(answers, name) => {
                setDiagAnswers(answers);
                setUserName(name);

                // Guardar onboarding en Supabase (fuente MVP1)
                (async () => {
                  const { data: sess } = await supabase.auth.getSession();
                  const uid = sess.session?.user.id;
                  if (!uid) {
                    console.error("[onboarding] No hay sesión activa; no se puede guardar onboarding.");
                    return;
                  }
                  // Doble verificación server-side: si la cuenta ya es acompañada
                  // o tiene un parent_journeys, no escribir onboarding ni name.
                  const [{ data: prof }, { data: pj }] = await Promise.all([
                    supabase.from("profiles").select("experience_mode").eq("id", uid).maybeSingle(),
                    supabase.from("parent_journeys").select("user_id").eq("user_id", uid).maybeSingle(),
                  ]);
                  if (prof?.experience_mode === "accompanied_learning" || pj) {
                    console.warn("[diagnosis] Bloqueado: cuenta ya configurada como acompañada.");
                    progress.logEvent("diagnosis_blocked_by_mode", {
                      persisted_mode: prof?.experience_mode ?? null,
                      has_parent_journey: !!pj,
                    });
                    setScreen("parent-journey-dashboard");
                    return;
                  }
                  const payload = { name, answers } as unknown as never;
                  const { error: onbError } = await supabase.from("user_onboarding").upsert(
                    {
                      user_id: uid,
                      answers: payload,
                      updated_at: new Date().toISOString(),
                    },
                    { onConflict: "user_id" },
                  );
                  if (onbError) {
                    console.error("[onboarding] Error al guardar user_onboarding:", onbError);
                    return;
                  }
                  setHasOnboarding(true);
                  progress.logEvent("onboarding_completed", { source: "diagnosis" });
                  const { error: profError } = await supabase
                    .from("profiles")
                    .upsert(
                      { id: uid, name, updated_at: new Date().toISOString() },
                      { onConflict: "id" },
                    );
                  if (profError) {
                    console.error("[onboarding] Error al guardar profiles.name:", profError);
                  }
                })();
                setScreen("diagnosis-result");
              }}
            />
          );
        })()}

        {screen === "diagnosis-result" && (
          <DiagnosisResultScreen
            answers={diagAnswers}
            userName={userName}
            onEnter={goToRoute}
          />
        )}



        {screen === "route" && (
          <RouteScreen
            userName={userName}
            onStartMission={(id) => openMissionGuarded(id)}
            onReviewMission={(id) => openMissionGuarded(id)}
            onOpenFirstMelodiesIsland={() => setScreen("first-melodies-island")}
            onOpenPulseIsland={() => setScreen("pulse-island")}
            onOpenRhythmIsland={() => openLockedIsland("rhythm")}
            onOpenMusicIsland={() => openLockedIsland("music")}
            onOpenJoyIsland={() => openLockedIsland("joy")}
            onOpenChordsIsland={() => openLockedIsland("chords")}
            onOpenStrummingIsland={() => openLockedIsland("strumming")}
            onOpenSongsIsland={() => openLockedIsland("songs")}
            journeyOrigin={journeyOrigin}
            studentName={routeStudentName}
            onBackToParentDashboard={
              journeyOrigin === "parent"
                ? () => setScreen("parent-journey-dashboard")
                : undefined
            }
          />
        )}

        {screen === "mission" && (
          <MissionScreen onBack={() => setScreen("route")} />
        )}

        {screen === "mission-two" && (
          <MissionTwoScreen
            userName={userName}
            onBack={() => setScreen("route")}
            onNext={() => setScreen("mission-three")}
          />
        )}

        {screen === "mission-three" && <MissionThreeScreen onBack={() => setScreen("route")} />}
        {screen === "mission-four" && <MissionFourScreen onBack={() => setScreen("route")} />}
        {screen === "mission-six" && <MissionSixScreen onBack={() => setScreen("route")} />}
        {screen === "mission-seven" && <MissionSevenScreen onBack={() => setScreen("route")} />}
        {screen === "mission-eight" && <MissionEightScreen onBack={() => setScreen("route")} />}
        {screen === "mission-nine" && <MissionNineScreen onBack={() => setScreen("route")} />}
        {screen === "first-melodies-island" && (
          <FirstMelodiesIslandScreen
            onBack={() => setScreen("route")}
            onOpenLesson={(lessonId) =>
              openLessonGuarded(lessonId, "first-melodies-lesson", setFirstMelodiesLessonId)
            }
            onOpenPulseIsland={() => setScreen("pulse-island")}
            onOpenRhythmIsland={() => openLockedIsland("rhythm")}
            onOpenMusicIsland={() => openLockedIsland("music")}
            onOpenJoyIsland={() => openLockedIsland("joy")}
            onOpenChordsIsland={() => openLockedIsland("chords")}
            onOpenStrummingIsland={() => openLockedIsland("strumming")}
            onOpenSongsIsland={() => openLockedIsland("songs")}
          />
        )}
        {screen === "pulse-island" && (
          <PulseIslandScreen
            onOpenStartPort={() => setScreen("route")}
            onOpenFirstMelodiesIsland={() => setScreen("first-melodies-island")}
            onOpenRhythmIsland={() => openLockedIsland("rhythm")}
            onOpenMusicIsland={() => openLockedIsland("music")}
            onOpenJoyIsland={() => openLockedIsland("joy")}
            onOpenChordsIsland={() => openLockedIsland("chords")}
            onOpenStrummingIsland={() => openLockedIsland("strumming")}
            onOpenSongsIsland={() => openLockedIsland("songs")}
            onOpenLesson={(lessonId) =>
              openLessonGuarded(lessonId, "pulse-lesson", setPulseLessonId)
            }
          />
        )}
        {screen === "rhythm-island" && (
          <RhythmIslandScreen
            onOpenStartPort={() => setScreen("route")}
            onOpenFirstMelodiesIsland={() => setScreen("first-melodies-island")}
            onOpenPulseIsland={() => setScreen("pulse-island")}
            onOpenMusicIsland={() => setScreen("music-island")}
            onOpenJoyIsland={() => setScreen("joy-island")}
            onOpenChordsIsland={() => setScreen("chords-island")}
            onOpenStrummingIsland={() => setScreen("strumming-island")}
            onOpenSongsIsland={() => setScreen("songs-island")}
            onOpenLesson={(lessonId) => {
              setRhythmLessonId(lessonId);
              setScreen("rhythm-lesson");
            }}
          />
        )}
        {screen === "music-island" && (
          <MusicIslandScreen
            onOpenStartPort={() => setScreen("route")}
            onOpenFirstMelodiesIsland={() => setScreen("first-melodies-island")}
            onOpenPulseIsland={() => setScreen("pulse-island")}
            onOpenRhythmIsland={() => setScreen("rhythm-island")}
            onOpenJoyIsland={() => setScreen("joy-island")}
            onOpenChordsIsland={() => setScreen("chords-island")}
            onOpenStrummingIsland={() => setScreen("strumming-island")}
            onOpenSongsIsland={() => setScreen("songs-island")}
            onOpenLesson={(lessonId) => {
              setMusicLessonId(lessonId);
              setScreen("music-lesson");
            }}
          />
        )}
        {screen === "joy-island" && (
          <JoyIslandScreen
            onOpenStartPort={() => setScreen("route")}
            onOpenFirstMelodiesIsland={() => setScreen("first-melodies-island")}
            onOpenPulseIsland={() => setScreen("pulse-island")}
            onOpenRhythmIsland={() => setScreen("rhythm-island")}
            onOpenMusicIsland={() => setScreen("music-island")}
            onOpenChordsIsland={() => setScreen("chords-island")}
            onOpenStrummingIsland={() => setScreen("strumming-island")}
            onOpenSongsIsland={() => setScreen("songs-island")}
            onOpenLesson={(lessonId) => {
              setJoyLessonId(lessonId);
              setScreen("joy-lesson");
            }}
          />
        )}
        {screen === "chords-island" && (
          <ChordsIslandScreen
            onOpenStartPort={() => setScreen("route")}
            onOpenFirstMelodiesIsland={() => setScreen("first-melodies-island")}
            onOpenPulseIsland={() => setScreen("pulse-island")}
            onOpenRhythmIsland={() => setScreen("rhythm-island")}
            onOpenMusicIsland={() => setScreen("music-island")}
            onOpenJoyIsland={() => setScreen("joy-island")}
            onOpenStrummingIsland={() => setScreen("strumming-island")}
            onOpenSongsIsland={() => setScreen("songs-island")}
            onOpenLesson={(lessonId) => {
              setChordsLessonId(lessonId);
              setScreen("chords-lesson");
            }}
          />
        )}
        {screen === "strumming-island" && (
          <StrummingIslandScreen
            onOpenStartPort={() => setScreen("route")}
            onOpenFirstMelodiesIsland={() => setScreen("first-melodies-island")}
            onOpenPulseIsland={() => setScreen("pulse-island")}
            onOpenRhythmIsland={() => setScreen("rhythm-island")}
            onOpenMusicIsland={() => setScreen("music-island")}
            onOpenJoyIsland={() => setScreen("joy-island")}
            onOpenChordsIsland={() => setScreen("chords-island")}
            onOpenSongsIsland={() => setScreen("songs-island")}
            onOpenLesson={(lessonId) => {
              setStrummingLessonId(lessonId);
              setScreen("strumming-lesson");
            }}
          />
        )}
        {screen === "songs-island" && (
          <SongsIslandScreen
            onOpenStartPort={() => setScreen("route")}
            onOpenFirstMelodiesIsland={() => setScreen("first-melodies-island")}
            onOpenPulseIsland={() => setScreen("pulse-island")}
            onOpenRhythmIsland={() => setScreen("rhythm-island")}
            onOpenMusicIsland={() => setScreen("music-island")}
            onOpenJoyIsland={() => setScreen("joy-island")}
            onOpenChordsIsland={() => setScreen("chords-island")}
            onOpenStrummingIsland={() => setScreen("strumming-island")}
            onOpenLesson={(lessonId) => {
              setSongsLessonId(lessonId);
              setScreen("songs-lesson");
            }}
          />
        )}
        {screen === "chords-lesson" && (
          <ChordsLessonScreen
            lessonId={chordsLessonId}
            onBackToIsland={() => setScreen("chords-island")}
          />
        )}
        {screen === "strumming-lesson" && (
          <StrummingLessonScreen
            lessonId={strummingLessonId}
            onBackToIsland={() => setScreen("strumming-island")}
          />
        )}
        {screen === "songs-lesson" && (
          <SongsLessonScreen
            lessonId={songsLessonId}
            onBackToIsland={() => setScreen("songs-island")}
          />
        )}
        {screen === "joy-lesson" && (
          <JoyLessonScreen
            lessonId={joyLessonId}
            onBackToIsland={() => setScreen("joy-island")}
          />
        )}
        {screen === "music-lesson" && (
          <MusicLessonScreen
            lessonId={musicLessonId}
            onBackToIsland={() => setScreen("music-island")}
          />
        )}
        {screen === "rhythm-lesson" && (
          <RhythmLessonScreen
            lessonId={rhythmLessonId}
            onBackToIsland={() => setScreen("rhythm-island")}
          />
        )}
        {screen === "pulse-lesson" && (
          <PulseLessonScreen
            lessonId={pulseLessonId}
            onBackToIsland={() => setScreen("pulse-island")}
          />
        )}
        {screen === "first-melodies-lesson" && (
          <FirstMelodiesLessonScreen
            lessonId={firstMelodiesLessonId}
            onBackToIsland={() => setScreen("first-melodies-island")}
          />
        )}
        {screen === "mission-guide" && <MissionGuideScreen userName={userName} onBack={() => setScreen("route")} />}

        {screen === "celebration" && <CelebrationScreen onHome={goToRoute} />}
      </div>
      <BlockedIslandModal
        open={blockedModal !== null}
        variant={blockedModal === "lesson" ? "lesson" : "island"}
        onClose={() => setBlockedModal(null)}
      />
    </main>
  );
}
