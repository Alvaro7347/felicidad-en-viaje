import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { B } from "./data/brand";
import { ONBOARDING_SCREENS } from "./data/screens";
import type { DiagAnswers, Screen } from "./types";
import { AuthScreen } from "./screens/AuthScreen";
import { BlockedIslandModal } from "./components/BlockedIslandModal";
import { useMvp1Progress } from "./hooks/useMvp1Progress";
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
  
  
  
  

  const goToRoute = () => setScreen("route");
  const isOnboarding = ONBOARDING_SCREENS.includes(screen);

  // ── Compuerta de sesión ────────────────────────────────────────
  if (authChecking) {
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
        <div style={{ fontSize: 14, color: B.grayText }}>Cargando…</div>
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
        <AppHeader
          screen={screen}
          onHome={isOnboarding ? undefined : goToRoute}
          onOpenGuide={() => setScreen("mission-guide")}
          userName={userName}
        />

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
            onStartMission={() => setScreen("mission")}
            onReviewMission={(id) => setScreen(REVIEW_MISSION_BY_NODE[id] ?? "mission-two")}
            onOpenFirstMelodiesIsland={() => setScreen("first-melodies-island")}
            onOpenPulseIsland={() => setScreen("pulse-island")}
            onOpenRhythmIsland={() => setScreen("rhythm-island")}
            onOpenMusicIsland={() => setScreen("music-island")}
            onOpenJoyIsland={() => setScreen("joy-island")}
            onOpenChordsIsland={() => setScreen("chords-island")}
            onOpenStrummingIsland={() => setScreen("strumming-island")}
            onOpenSongsIsland={() => setScreen("songs-island")}
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
            onOpenLesson={(lessonId) => {
              setFirstMelodiesLessonId(lessonId);
              setScreen("first-melodies-lesson");
            }}
            onOpenPulseIsland={() => setScreen("pulse-island")}
            onOpenRhythmIsland={() => setScreen("rhythm-island")}
            onOpenMusicIsland={() => setScreen("music-island")}
            onOpenJoyIsland={() => setScreen("joy-island")}
            onOpenChordsIsland={() => setScreen("chords-island")}
            onOpenStrummingIsland={() => setScreen("strumming-island")}
            onOpenSongsIsland={() => setScreen("songs-island")}
          />
        )}
        {screen === "pulse-island" && (
          <PulseIslandScreen
            onOpenStartPort={() => setScreen("route")}
            onOpenFirstMelodiesIsland={() => setScreen("first-melodies-island")}
            onOpenRhythmIsland={() => setScreen("rhythm-island")}
            onOpenMusicIsland={() => setScreen("music-island")}
            onOpenJoyIsland={() => setScreen("joy-island")}
            onOpenChordsIsland={() => setScreen("chords-island")}
            onOpenStrummingIsland={() => setScreen("strumming-island")}
            onOpenSongsIsland={() => setScreen("songs-island")}
            onOpenLesson={(lessonId) => {
              setPulseLessonId(lessonId);
              setScreen("pulse-lesson");
            }}
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
    </main>
  );
}
