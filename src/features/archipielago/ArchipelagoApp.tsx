import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { B } from "./data/brand";
import { ONBOARDING_SCREENS } from "./data/screens";
import type { DiagAnswers, Screen } from "./types";
import { AuthScreen } from "./screens/AuthScreen";
import { BlockedIslandModal } from "./components/BlockedIslandModal";
import { useMvp1ProgressContext } from "./context/Mvp1ProgressContext";
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
import { UserPathSelectionScreen } from "./screens/UserPathSelectionScreen";
import { ParentJourneyIntroScreen } from "./screens/ParentJourneyIntroScreen";
import { ParentOnboardingScreen, type ParentOnboardingAnswers } from "@/features/parent-journey/screens/ParentOnboardingScreen";


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
  const [userName, setUserName] = useState(() => {
    if (typeof window === "undefined") return "Navegante";
    return window.localStorage.getItem("archipielago_user_name") || "Navegante";
  });
  const [firstMelodiesLessonId, setFirstMelodiesLessonId] = useState<string>("m1");
  const [pulseLessonId, setPulseLessonId] = useState<string>("p1");
  const [rhythmLessonId, setRhythmLessonId] = useState<string>("r1");
  const [musicLessonId, setMusicLessonId] = useState<string>("music1");
  const [joyLessonId, setJoyLessonId] = useState<string>("joy1");
  const [chordsLessonId, setChordsLessonId] = useState<string>("chords1");
  const [strummingLessonId, setStrummingLessonId] = useState<string>("strumming1");
  const [songsLessonId, setSongsLessonId] = useState<string>("songs1");

  // ── Progreso MVP1 ──────────────────────────────────────────────
  const progress = useMvp1ProgressContext();
  const [blockedModal, setBlockedModal] = useState<null | "island" | "lesson">(null);

  // ── Onboarding: leer desde Supabase (fuente de verdad) ─────────
  useEffect(() => {
    const uid = session?.user.id;
    if (!uid) {
      setHasOnboarding(null);
      return;
    }
    let cancelled = false;
    setOnboardingChecking(true);
    (async () => {
      const { data: onb } = await supabase
        .from("user_onboarding")
        .select("answers")
        .eq("user_id", uid)
        .maybeSingle();
      if (cancelled) return;
      if (onb) {
        // Recuperar nombre desde answers.name o profiles.name
        const answers = (onb.answers ?? {}) as { name?: string; answers?: DiagAnswers };
        let name = answers.name ?? "";
        if (!name) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", uid)
            .maybeSingle();
          if (cancelled) return;
          name = prof?.name ?? "Navegante";
        }
        setUserName(name || "Navegante");
        if (typeof window !== "undefined") {
          try { window.localStorage.setItem("archipielago_user_name", name || "Navegante"); } catch {}
        }
        setHasOnboarding(true);
        setScreen("return-welcome");
      } else {
        setHasOnboarding(false);
        setScreen("onboarding");
      }
      setOnboardingChecking(false);
    })();
    return () => { cancelled = true; };
  }, [session?.user.id]);

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

  const goToRoute = () => setScreen("route");
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
  if (authChecking || (session && (onboardingChecking || hasOnboarding === null))) {
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
        {screen !== "return-welcome" && (
          <AppHeader
            screen={screen}
            onHome={isOnboarding ? undefined : goToRoute}
            onOpenGuide={() => setScreen("mission-guide")}
            userName={userName}
          />
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


        {screen === "path-selection" && (
          <UserPathSelectionScreen
            onChooseLearner={() => setScreen("onboarding")}
            onChooseParent={() => setScreen("parent-journey-intro")}
          />
        )}

        {screen === "parent-journey-intro" && (
          <ParentJourneyIntroScreen
            onCreate={() => setScreen("parent-onboarding")}
            onBack={() => setScreen("path-selection")}
          />
        )}

        {screen === "parent-onboarding" && (
          <ParentOnboardingScreen
            onCancel={() => setScreen("parent-journey-intro")}
            onComplete={async (ans: ParentOnboardingAnswers) => {
              const uid = session?.user.id;
              if (uid) {
                try {
                  await supabase.from("parent_journeys" as never).insert({
                    user_id: uid,
                    student_name: ans.student.name || "Lucía",
                    parent_name: "Carolina",
                    teacher_name: "Álvaro",
                    plan_name: "Plan Semanal Presencial",
                    status: "pilot",
                    onboarding_answers: ans as unknown as Record<string, unknown>,
                  } as never);
                } catch (e) {
                  console.warn("[parent_journeys] insert failed, continuing:", e);
                }
              }
              try {
                window.localStorage.setItem(
                  "parent_journey_lucia_v1",
                  JSON.stringify({ answers: ans, savedAt: new Date().toISOString() }),
                );
              } catch {}
              setScreen("parent-journey-intro");
            }}
          />
        )}

        {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("onboarding")} />}

        {screen === "onboarding" && <OnboardingScreen onStart={() => setScreen("diagnosis")} />}

        {screen === "diagnosis" && (
          <DiagnosisScreen
            onComplete={(answers, name) => {
              setDiagAnswers(answers);
              setUserName(name);
              if (typeof window !== "undefined") {
                try { window.localStorage.setItem("archipielago_user_name", name); } catch {}
              }
              // Guardar onboarding en Supabase (fuente MVP1)
              (async () => {
                const { data: sess } = await supabase.auth.getSession();
                const uid = sess.session?.user.id;
                if (!uid) {
                  console.error("[onboarding] No hay sesión activa; no se puede guardar onboarding.");
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
        )}

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
