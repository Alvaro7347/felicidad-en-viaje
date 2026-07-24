/**
 * ArchipelagoApp
 * ──────────────────────────────────────────────────────────────────────────
 * Orquestador principal del MVP1 del Archipiélago de la Felicidad.
 *
 * Responsabilidades que CONSERVA este archivo:
 *   - Renderizado de pantallas (switch por `screen`).
 *   - Coordinación general de sesión, splash y estado local de UI.
 *   - Guardas de compuerta (loading / error / ambiguo) antes de renderizar.
 *   - Sincronización única del resultado del bootstrap con el estado local.
 *
 * Responsabilidades que YA NO viven aquí (arquitectura MVP1 congelada):
 *   - Bootstrap y clasificación de modalidad  →  hooks/useJourneyBootstrap.ts
 *   - Navegación pedagógica (goHome, openLesson, continueJourney, …)
 *                                              →  hooks/useJourneyNavigation.ts
 *   - Acceso a Supabase (parent_journeys, user_onboarding, profiles)
 *                                              →  services/journeyRepository.ts
 *   - Metadatos de islas / pantallas / orden   →  data/journeyCatalog.ts
 *   - Modalidad de experiencia (persistencia)  →  context/ExperienceModeContext
 *   - Progreso MVP1 (fuente única de verdad)   →  context/Mvp1ProgressContext
 *
 * Reglas para futuros cambios:
 *   - No reintroducir lógica de Supabase, bootstrap o navegación aquí.
 *   - Ampliar los hooks/servicios correspondientes en su lugar.
 *   - Este archivo debe seguir siendo "vista + coordinación", no negocio.
 */
import { lazy, Suspense, useEffect, useRef, useState } from "react";
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

import { useJourneyNavigation } from "./hooks/useJourneyNavigation";
import { useJourneyBootstrap } from "./hooks/useJourneyBootstrap";
import {
  getJourneyConfiguration,
  loadProfile,
  saveParentJourney,
  saveSelfOnboarding,
  updateProfileName,
} from "./services/journeyRepository";

import { AppHeader } from "./components/AppHeader";
import { DevNav, SHOW_DEV_NAV } from "./components/DevNav";
import { SplashScreen } from "./components/SplashScreen";

// ── Pantallas eager: participan en el bootstrap o en la primera pintura ────
// (Auth, Splash, Welcome/ReturnWelcome, Onboarding, Route y los dashboards
// iniciales de cada modalidad). Todo lo demás se carga bajo demanda con
// React.lazy() para reducir el JS del bundle inicial.
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { RouteScreen } from "./screens/RouteScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { ReturnWelcomeScreen } from "./screens/ReturnWelcomeScreen";
import { SelfJourneyDashboardScreen } from "./screens/SelfJourneyDashboardScreen";
import { getJourneyLearnerName } from "./utils/learnerName";
import { ParentJourneyDashboardHydrator } from "@/features/parent-journey/screens/ParentJourneyDashboardHydrator";
import { settingsRepository } from "@/features/settings/services/settingsRepository";
import type { ParentOnboardingAnswers } from "@/features/parent-journey/types";

// ── Pantallas lazy: se cargan al navegar hacia ellas. Cada import() genera
// un chunk propio; las utilidades/datos que sólo estas pantallas usan
// (lecciones, formularios largos, screens de menú) viajan con su chunk.
const CelebrationScreen = lazy(() =>
  import("./screens/CelebrationScreen").then((m) => ({ default: m.CelebrationScreen })),
);
const DiagnosisResultScreen = lazy(() =>
  import("./screens/DiagnosisResultScreen").then((m) => ({ default: m.DiagnosisResultScreen })),
);
const DiagnosisScreen = lazy(() =>
  import("./screens/DiagnosisScreen").then((m) => ({ default: m.DiagnosisScreen })),
);
const MissionEightScreen = lazy(() =>
  import("./screens/MissionEightScreen").then((m) => ({ default: m.MissionEightScreen })),
);
const FirstMelodiesIslandScreen = lazy(() =>
  import("./screens/FirstMelodiesIslandScreen").then((m) => ({
    default: m.FirstMelodiesIslandScreen,
  })),
);
const FirstMelodiesLessonScreen = lazy(() =>
  import("./screens/FirstMelodiesLessonScreen").then((m) => ({
    default: m.FirstMelodiesLessonScreen,
  })),
);
const PulseIslandScreen = lazy(() =>
  import("./screens/PulseIslandScreen").then((m) => ({ default: m.PulseIslandScreen })),
);
const RhythmIslandScreen = lazy(() =>
  import("./screens/RhythmIslandScreen").then((m) => ({ default: m.RhythmIslandScreen })),
);
const MusicIslandScreen = lazy(() =>
  import("./screens/MusicIslandScreen").then((m) => ({ default: m.MusicIslandScreen })),
);
const JoyIslandScreen = lazy(() =>
  import("./screens/JoyIslandScreen").then((m) => ({ default: m.JoyIslandScreen })),
);
const JoyLessonScreen = lazy(() =>
  import("./screens/JoyLessonScreen").then((m) => ({ default: m.JoyLessonScreen })),
);
const PulseLessonScreen = lazy(() =>
  import("./screens/PulseLessonScreen").then((m) => ({ default: m.PulseLessonScreen })),
);
const RhythmLessonScreen = lazy(() =>
  import("./screens/RhythmLessonScreen").then((m) => ({ default: m.RhythmLessonScreen })),
);
const MusicLessonScreen = lazy(() =>
  import("./screens/MusicLessonScreen").then((m) => ({ default: m.MusicLessonScreen })),
);
const ChordsIslandScreen = lazy(() =>
  import("./screens/ChordsIslandScreen").then((m) => ({ default: m.ChordsIslandScreen })),
);
const ChordsLessonScreen = lazy(() =>
  import("./screens/ChordsLessonScreen").then((m) => ({ default: m.ChordsLessonScreen })),
);
const StrummingIslandScreen = lazy(() =>
  import("./screens/StrummingIslandScreen").then((m) => ({ default: m.StrummingIslandScreen })),
);
const StrummingLessonScreen = lazy(() =>
  import("./screens/StrummingLessonScreen").then((m) => ({ default: m.StrummingLessonScreen })),
);
const SongsIslandScreen = lazy(() =>
  import("./screens/SongsIslandScreen").then((m) => ({ default: m.SongsIslandScreen })),
);
const SongsLessonScreen = lazy(() =>
  import("./screens/SongsLessonScreen").then((m) => ({ default: m.SongsLessonScreen })),
);
const MissionNineScreen = lazy(() =>
  import("./screens/MissionNineScreen").then((m) => ({ default: m.MissionNineScreen })),
);
const MissionFourScreen = lazy(() =>
  import("./screens/MissionFourScreen").then((m) => ({ default: m.MissionFourScreen })),
);
const MissionGuideScreen = lazy(() =>
  import("./screens/MissionGuideScreen").then((m) => ({ default: m.MissionGuideScreen })),
);
const MissionSevenScreen = lazy(() =>
  import("./screens/MissionSevenScreen").then((m) => ({ default: m.MissionSevenScreen })),
);
const MissionSixScreen = lazy(() =>
  import("./screens/MissionSixScreen").then((m) => ({ default: m.MissionSixScreen })),
);
const MissionThreeScreen = lazy(() =>
  import("./screens/MissionThreeScreen").then((m) => ({ default: m.MissionThreeScreen })),
);
const MissionTwoScreen = lazy(() =>
  import("./screens/MissionTwoScreen").then((m) => ({ default: m.MissionTwoScreen })),
);
const MyProfileScreen = lazy(() =>
  import("./screens/MyProfileScreen").then((m) => ({ default: m.MyProfileScreen })),
);
const HelpCenterScreen = lazy(() =>
  import("./screens/HelpCenterScreen").then((m) => ({ default: m.HelpCenterScreen })),
);
const PrivacyScreen = lazy(() =>
  import("./screens/PrivacyScreen").then((m) => ({ default: m.PrivacyScreen })),
);
const SettingsScreen = lazy(() =>
  import("@/features/settings/screens/SettingsScreen").then((m) => ({ default: m.SettingsScreen })),
);
const ParentJourneyIntroScreen = lazy(() =>
  import("./screens/ParentJourneyIntroScreen").then((m) => ({
    default: m.ParentJourneyIntroScreen,
  })),
);
const ParentJourneyCreatedScreen = lazy(() =>
  import("./screens/ParentJourneyCreatedScreen").then((m) => ({
    default: m.ParentJourneyCreatedScreen,
  })),
);
const ParentOnboardingScreen = lazy(() =>
  import("@/features/parent-journey/screens/ParentOnboardingScreen").then((m) => ({
    default: m.ParentOnboardingScreen,
  })),
);

// Fallback compartido durante la carga de un chunk de pantalla lazy.
// Reutiliza los tokens de marca — sin crear un nuevo loader visual.
function LazyScreenFallback() {
  return (
    <div
      style={{
        minHeight: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Quicksand, Arial, sans-serif",
        fontSize: 14,
        color: B.grayText,
      }}
    >
      Cargando…
    </div>
  );
}

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
  const [parentJourneyAnswers, setParentJourneyAnswers] = useState<ParentOnboardingAnswers | null>(
    null,
  );
  const [journeyOrigin, setJourneyOrigin] = useState<"student" | "parent">("student");
  const [routeStudentName, setRouteStudentName] = useState<string | undefined>(undefined);

  // ── Progreso MVP1 + Modo de experiencia ────────────────────────
  const progress = useMvp1ProgressContext();
  const experience = useExperienceMode();
  const [blockedModal, setBlockedModal] = useState<null | "island" | "lesson">(null);
  const [parentJourneyLoadError, setParentJourneyLoadError] = useState<string | null>(null);

  // Nombre del protagonista pedagógico. Se usa para textos dirigidos al ESTUDIANTE
  // (ruta, misiones, saludos de lección). Los textos dirigidos al adulto siguen
  // usando `userName` (Mi perfil, Cerrar sesión, saludo de la cuenta).
  const learnerName = getJourneyLearnerName(experience.mode, userName, routeStudentName);
  const [ambiguousMode, setAmbiguousMode] = useState(false);
  // Selección temporal en memoria — NO consolida modalidad hasta que el onboarding
  // correspondiente se guarde correctamente en Supabase.
  const [pendingExperienceMode, setPendingExperienceMode] = useState<
    "self_learning" | "accompanied_learning" | null
  >(null);
  // Guardado transaccional del diagnóstico de Alejandra.
  const [savingDiagnosis, setSavingDiagnosis] = useState(false);
  const [diagnosisSaveError, setDiagnosisSaveError] = useState<string | null>(null);
  const [pendingDiagnosis, setPendingDiagnosis] = useState<{
    answers: DiagAnswers;
    name: string;
  } | null>(null);

  // ── Aislamiento entre sesiones: al cambiar user_id, limpiar estado local
  //    para que la nueva cuenta nunca vea datos de la anterior.
  const lastUidRef = useRef<string | null>(null);
  // Telemetría: `app_opened` se registra una vez por usuario. Se declara aquí
  // (antes del effect de cambio de UID) para reiniciarlo en logout/login.
  const appOpenedLoggedRef = useRef(false);

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
      setSavingDiagnosis(false);
      setDiagnosisSaveError(null);
      setPendingDiagnosis(null);
      setScreen("welcome");
      // Reiniciar telemetría por cuenta: app_opened debe registrarse una vez
      // por usuario, incluso tras logout + login con otra cuenta.
      appOpenedLoggedRef.current = false;
    }
  }, [session?.user.id]);

  // ── Bootstrap del viaje (extraído a useJourneyBootstrap) ──────
  // Determina modalidad, repara experience_mode y elige la pantalla inicial.
  const bootstrap = useJourneyBootstrap({
    userId: session?.user.id ?? null,
    experience,
    progress,
  });

  // Sincronización una única vez por corrida del bootstrap: cuando `ready`
  // cambia de identidad, seedeamos el estado local. Evita loops porque el
  // hook produce una nueva referencia SÓLO al terminar cada corrida.
  const lastReadyRef = useRef<typeof bootstrap.ready>(null);
  useEffect(() => {
    if (bootstrap.status === "ambiguous") {
      lastReadyRef.current = null;
      setAmbiguousMode(true);
      setParentJourneyLoadError(null);
      return;
    }
    if (bootstrap.status === "error") {
      lastReadyRef.current = null;
      setParentJourneyLoadError(bootstrap.error);
      return;
    }
    if (bootstrap.status !== "ready" || !bootstrap.ready) return;
    if (lastReadyRef.current === bootstrap.ready) return;
    lastReadyRef.current = bootstrap.ready;
    const r = bootstrap.ready;
    setAmbiguousMode(false);
    setParentJourneyLoadError(null);
    setHasOnboarding(r.hasOnboarding);
    setUserName(r.userName);
    setJourneyOrigin(r.journeyOrigin);
    setRouteStudentName(r.studentName);
    if (r.parentJourneyAnswers !== undefined) {
      setParentJourneyAnswers(r.parentJourneyAnswers);
    }
    setScreen(r.initialScreen);
  }, [bootstrap.status, bootstrap.ready, bootstrap.error]);

  // Fuente semántica de carga: sólo bloquea si el bootstrap aún no terminó.
  // En estado "error" NO bloqueamos; dejamos que la app renderice el banner
  // de error con su botón Reintentar (línea ~458). En "ambiguous" ya hay una
  // pantalla dedicada arriba.
  const bootstrapChecking =
    !!session && (bootstrap.status === "idle" || bootstrap.status === "loading");

  // ── Medición: app_opened + return_visit (una vez por carga con sesión) ──
  // `appOpenedLoggedRef` se declara arriba (junto a `lastUidRef`) para
  // reiniciarse cuando cambia el usuario.

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
    // Marca actividad para el sistema de reactivación (settings.last_active_at).
    // Fire-and-forget: no bloquea render y no rompe si el usuario aún no tiene
    // user_settings (el server fn hace upsert).
    settingsRepository.recordActivity("app_opened").catch(() => {});
    if (hasOnboarding && cur && cur !== "n1") {
      progress.logEvent("return_visit", {
        current_lesson_id: cur,
        current_island_id,
      });
    }
  }, [session?.user.id, progress.loading, hasOnboarding, progress]);

  // ── Navegación pedagógica (extraída a useJourneyNavigation) ────
  const {
    goHome,
    goToRoute,
    openMission,
    openLesson,
    continueJourney,
    openIsland,
    openLockedIsland,
  } = useJourneyNavigation({
    progress,
    experienceMode: experience.mode,
    setScreen,
    setBlockedModal,
    setJourneyOrigin,
    setRouteStudentName,
    lessonSetters: {
      "first-melodies": setFirstMelodiesLessonId,
      pulse: setPulseLessonId,
      rhythm: setRhythmLessonId,
      music: setMusicLessonId,
      joy: setJoyLessonId,
      chords: setChordsLessonId,
      strumming: setStrummingLessonId,
      songs: setSongsLessonId,
    },
  });

  const isOnboarding = ONBOARDING_SCREENS.includes(screen);

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
        <div
          style={{
            maxWidth: 420,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: B.dark,
            }}
          >
            Estamos revisando tu acceso
          </div>
          <div style={{ fontSize: 14, color: B.grayText, lineHeight: 1.55 }}>
            Encontramos más de una configuración asociada a esta cuenta. Estamos revisando tu acceso
            para no mezclar información. Reintenta en unos segundos o vuelve a iniciar sesión.
          </div>
          <button
            type="button"
            onClick={() => {
              setAmbiguousMode(false);
              bootstrap.retry();
            }}
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
            onClick={() => {
              void experience.signOutAndClear();
            }}
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
  // Compuerta bloqueante: si el bootstrap falló, no dejar pasar ninguna
  // pantalla normal detrás (Welcome, Onboarding, etc.). Reutiliza el estilo
  // del estado ambiguo.
  if (session && bootstrap.status === "error") {
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
        <div
          style={{
            maxWidth: 420,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: B.dark,
            }}
          >
            No pudimos preparar tu viaje
          </div>
          <div style={{ fontSize: 14, color: B.grayText, lineHeight: 1.55 }}>
            {bootstrap.error ?? "Ocurrió un problema al cargar tu configuración."}
          </div>
          <button
            type="button"
            onClick={() => bootstrap.retry()}
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
            onClick={() => {
              void experience.signOutAndClear();
            }}
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

  if (authChecking || experience.loading || (session && bootstrapChecking)) {
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
            if (entry.lessonGroup === "first-melodies" && entry.lessonId) {
              setFirstMelodiesLessonId(entry.lessonId);
            } else if (entry.lessonGroup === "pulse" && entry.lessonId) {
              setPulseLessonId(entry.lessonId);
            } else if (entry.lessonGroup === "rhythm" && entry.lessonId) {
              setRhythmLessonId(entry.lessonId);
            } else if (entry.lessonGroup === "music" && entry.lessonId) {
              setMusicLessonId(entry.lessonId);
            } else if (entry.lessonGroup === "joy" && entry.lessonId) {
              setJoyLessonId(entry.lessonId);
            } else if (entry.lessonGroup === "chords" && entry.lessonId) {
              setChordsLessonId(entry.lessonId);
            } else if (entry.lessonGroup === "strumming" && entry.lessonId) {
              setStrummingLessonId(entry.lessonId);
            } else if (entry.lessonGroup === "songs" && entry.lessonId) {
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
            onOpenProfile={() => setScreen("my-profile")}
            onOpenSettings={() => setScreen("settings")}
            onOpenHelp={() => setScreen("help-center")}
            onOpenPrivacy={() => setScreen("privacy")}
            userName={userName}
            studentName={routeStudentName}
          />
        )}
        {parentJourneyLoadError && (
          <div
            style={{
              margin: "8px 0",
              padding: 12,
              borderRadius: 12,
              background: "#FDE7EA",
              color: B.dark,
              fontSize: 13,
            }}
          >
            {parentJourneyLoadError}{" "}
            <button
              type="button"
              onClick={() => {
                setParentJourneyLoadError(null);
                bootstrap.retry();
              }}
              style={{
                background: "transparent",
                border: "none",
                color: B.dark,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        <Suspense fallback={<LazyScreenFallback />}>
          {screen === "return-welcome" && (
            <ReturnWelcomeScreen
              userName={userName}
              loading={progress.loading}
              ctaLabel={(() => {
                if (progress.loading) return "Preparando tu viaje…";
                const cur = progress.getCurrentLessonId();
                const island = cur ? findMvp1Lesson(cur)?.islandId : null;
                if (island === "first-melodies") return "Continuar en Primeras Melodías";
                if (island === "pulse") return "Continuar en Isla del Pulso";
                return "Entrar a mi Archipiélago";
              })()}
              onEnter={() => {
                if (progress.loading) return;
                const cur = progress.getCurrentLessonId();
                // cur === null → completó todo MVP1 (hasta p11). Mostrar Isla del Pulso.
                if (!cur) {
                  openIsland("pulse");
                  return;
                }
                const island = findMvp1Lesson(cur)?.islandId;
                if (!island) {
                  openIsland("start-port");
                  return;
                }
                openIsland(island);
              }}
            />
          )}

          {screen === "parent-journey-intro" &&
            (() => {
              // Protección: si la cuenta ya declaró modalidad personal, no debería
              // ver esta pantalla. Redirigir al retorno de Alejandra.
              if (experience.mode === "self_learning") {
                setTimeout(() => setScreen("return-welcome"), 0);
                return null;
              }
              return <ParentJourneyIntroScreen onCreate={() => setScreen("parent-onboarding")} />;
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

                // Upsert en parent_journeys (una cuenta = un viaje).
                try {
                  await saveParentJourney(uid, ans);
                } catch (e) {
                  console.warn("[parent_journeys] upsert failed:", e);
                  throw new Error("No pudimos guardar el viaje musical. Intenta nuevamente.");
                }

                // Éxito parent_journeys → consolidar modalidad accompanied_learning.
                // Si esta consolidación falla, NO mostramos éxito; el usuario puede
                // reintentar y el upsert es idempotente (mismo user_id, mismo payload).
                if (experience.mode !== "accompanied_learning") {
                  try {
                    await experience.setMode("accompanied_learning");
                  } catch (e) {
                    console.error("[experience_mode] setMode post-upsert falló:", e);
                    throw new Error("No pudimos guardar el viaje musical. Intenta nuevamente.");
                  }
                }
                setParentJourneyAnswers(ans);
                setRouteStudentName(studentName);
                setJourneyOrigin("parent");
                setHasOnboarding(true);
                setPendingExperienceMode(null);
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

          {screen === "parent-journey-dashboard" &&
            (() => {
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

          {screen === "onboarding" &&
            (() => {
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

          {screen === "diagnosis" &&
            (() => {
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
              const submitDiagnosis = async (answers: DiagAnswers, name: string) => {
                if (savingDiagnosis) return;
                setSavingDiagnosis(true);
                setDiagnosisSaveError(null);
                try {
                  const { data: sess } = await supabase.auth.getSession();
                  const uid = sess.session?.user.id;
                  if (!uid) throw new Error("No hay sesión activa.");

                  // Doble verificación server-side: cuenta acompañada no debe escribir onboarding/name.
                  const [prof, cfg] = await Promise.all([
                    loadProfile(uid),
                    getJourneyConfiguration(uid),
                  ]);
                  if (prof?.experience_mode === "accompanied_learning" || cfg.hasParentJourney) {
                    progress.logEvent("diagnosis_blocked_by_mode", {
                      persisted_mode: prof?.experience_mode ?? null,
                      has_parent_journey: cfg.hasParentJourney,
                    });
                    setPendingDiagnosis(null);
                    setScreen("parent-journey-dashboard");
                    return;
                  }

                  // 1) Guardar user_onboarding.
                  await saveSelfOnboarding(uid, name, answers);

                  // 2) Consolidar modalidad self_learning (crítico).
                  await experience.setMode("self_learning");

                  // 3) profiles.name: no crítico. El nombre ya vive en user_onboarding.answers.
                  try {
                    await updateProfileName(uid, name);
                  } catch (profError) {
                    console.warn("[onboarding] profiles.name warning (no bloqueante):", profError);
                  }

                  // 4) Éxito: hidratar estado local y navegar.
                  setDiagAnswers(answers);
                  setUserName(name);
                  setHasOnboarding(true);
                  setPendingExperienceMode(null);
                  setPendingDiagnosis(null);
                  progress.logEvent("onboarding_completed", { source: "diagnosis" });
                  setScreen("diagnosis-result");
                } catch (e) {
                  console.error("[onboarding] save failed:", e);
                  setPendingDiagnosis({ answers, name });
                  setDiagnosisSaveError("No pudimos guardar tu viaje musical. Intenta nuevamente.");
                } finally {
                  setSavingDiagnosis(false);
                }
              };
              return (
                <>
                  <DiagnosisScreen
                    onComplete={(answers, name) => {
                      void submitDiagnosis(answers, name);
                    }}
                  />
                  {(savingDiagnosis || diagnosisSaveError) && (
                    <div
                      style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(15,20,25,0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9000,
                        padding: 24,
                      }}
                    >
                      <div
                        style={{
                          maxWidth: 380,
                          width: "100%",
                          background: B.white,
                          borderRadius: 16,
                          padding: 20,
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                          fontFamily: "Quicksand, sans-serif",
                          color: B.dark,
                          textAlign: "center",
                        }}
                      >
                        {savingDiagnosis && (
                          <div style={{ fontSize: 14, fontWeight: 700 }}>
                            Guardando tu viaje musical…
                          </div>
                        )}
                        {!savingDiagnosis && diagnosisSaveError && (
                          <>
                            <div
                              style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontWeight: 800,
                                fontSize: 16,
                              }}
                            >
                              Algo salió mal
                            </div>
                            <div style={{ fontSize: 13, color: B.grayText, lineHeight: 1.5 }}>
                              {diagnosisSaveError}
                            </div>
                            <button
                              type="button"
                              disabled={savingDiagnosis}
                              onClick={() => {
                                if (!pendingDiagnosis) {
                                  setDiagnosisSaveError(null);
                                  return;
                                }
                                void submitDiagnosis(
                                  pendingDiagnosis.answers,
                                  pendingDiagnosis.name,
                                );
                              }}
                              style={{
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
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

          {screen === "diagnosis-result" && (
            <DiagnosisResultScreen answers={diagAnswers} userName={userName} onEnter={goToRoute} />
          )}

          {screen === "self-journey" &&
            (() => {
              // Solo para Alejandra. María José tiene su propio dashboard.
              if (experience.mode === "accompanied_learning") {
                setTimeout(() => setScreen("parent-journey-dashboard"), 0);
                return null;
              }
              return (
                <SelfJourneyDashboardScreen
                  userName={userName}
                  onContinue={(lessonId) => continueJourney(lessonId)}
                  onReview={() => setScreen("route")}
                />
              );
            })()}

          {screen === "route" && (
            <RouteScreen
              userName={userName}
              onStartMission={(id) => openMission(id)}
              onReviewMission={(id) => openMission(id)}
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
                journeyOrigin === "parent" ? () => setScreen("parent-journey-dashboard") : undefined
              }
            />
          )}


          {screen === "mission-two" && (
            <MissionTwoScreen
              userName={userName}
              learnerName={learnerName}
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
              onOpenLesson={(lessonId) => openLesson(lessonId)}
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
              onOpenLesson={(lessonId) => openLesson(lessonId)}
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
          {screen === "mission-guide" && (
            <MissionGuideScreen
              userName={userName}
              learnerName={learnerName}
              onBack={() => setScreen("route")}
            />
          )}

          {screen === "celebration" && <CelebrationScreen onHome={goToRoute} />}

          {screen === "my-profile" && (
            <MyProfileScreen
              mode={experience.mode}
              userName={userName}
              userEmail={session?.user.email ?? null}
              studentName={routeStudentName}
              parentAnswers={parentJourneyAnswers}
              onBack={goHome}
            />
          )}

          {screen === "help-center" && (
            <HelpCenterScreen
              mode={experience.mode}
              onBack={goHome}
              onOpenPrivacy={() => setScreen("privacy")}
            />
          )}

          {screen === "privacy" && <PrivacyScreen onBack={goHome} />}

          {screen === "settings" && (
            <SettingsScreen userEmail={session?.user.email ?? null} onBack={goHome} />
          )}
        </Suspense>
      </div>

      <BlockedIslandModal
        open={blockedModal !== null}
        variant={blockedModal === "lesson" ? "lesson" : "island"}
        onClose={() => setBlockedModal(null)}
      />
    </main>
  );
}
