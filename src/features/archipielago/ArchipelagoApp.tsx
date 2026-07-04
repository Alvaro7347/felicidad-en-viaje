import { useEffect, useState } from "react";

import { B } from "./data/brand";
import { ONBOARDING_SCREENS } from "./data/screens";
import type { DiagAnswers, Screen } from "./types";

import { AppHeader } from "./components/AppHeader";
import { DevNav, SHOW_DEV_NAV } from "./components/DevNav";
import { SplashScreen } from "./components/SplashScreen";

import { CelebrationScreen } from "./screens/CelebrationScreen";
import { DiagnosisResultScreen } from "./screens/DiagnosisResultScreen";
import { DiagnosisScreen } from "./screens/DiagnosisScreen";

import { MissionEightScreen } from "./screens/MissionEightScreen";
import { MissionFourScreen } from "./screens/MissionFourScreen";
import { MissionGuideScreen } from "./screens/MissionGuideScreen";
import { MissionScreen } from "./screens/MissionScreen";
import { MissionSevenScreen } from "./screens/MissionSevenScreen";
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
  n7: "mission-seven",
  n8: "mission-eight",
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

  // ── Estado del viaje ───────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>("welcome");
  const [diagAnswers, setDiagAnswers] = useState<DiagAnswers>({});
  const [userName, setUserName] = useState(() => {
    if (typeof window === "undefined") return "Navegante";
    return window.localStorage.getItem("archipielago_user_name") || "Navegante";
  });
  

  const goToRoute = () => setScreen("route");
  const isOnboarding = ONBOARDING_SCREENS.includes(screen);

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
      {SHOW_DEV_NAV && <DevNav current={screen} onGo={setScreen} />}

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <AppHeader screen={screen} onHome={isOnboarding ? undefined : goToRoute} />

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
          />
        )}

        {screen === "mission" && (
          <MissionScreen
            onBack={() => setScreen("route")}
            onComplete={() => setScreen("celebration")}
            emotion={emotion}
            setEmotion={setEmotion}
          />
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
        {screen === "mission-seven" && <MissionSevenScreen onBack={() => setScreen("route")} />}
        {screen === "mission-eight" && <MissionEightScreen onBack={() => setScreen("route")} />}
        {screen === "mission-guide" && <MissionGuideScreen userName={userName} onBack={() => setScreen("route")} />}

        {screen === "celebration" && <CelebrationScreen onHome={goToRoute} />}
      </div>
    </main>
  );
}
