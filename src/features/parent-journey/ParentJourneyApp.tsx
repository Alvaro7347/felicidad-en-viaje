import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { B } from "@/features/archipielago/data/brand";
import { AuthScreen } from "@/features/archipielago/screens/AuthScreen";
import { ParentJourneyIntroScreen } from "./screens/ParentJourneyIntroScreen";
import { ParentOnboardingScreen, type ParentOnboardingAnswers } from "./screens/ParentOnboardingScreen";
import { ParentJourneySummaryScreen } from "./screens/ParentJourneySummaryScreen";

type PScreen = "intro" | "onboarding" | "summary" | "dashboard";

const LS_KEY = "parent_journey_lucia_v1";

export function ParentJourneyApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [screen, setScreen] = useState<PScreen>("intro");
  const [answers, setAnswers] = useState<ParentOnboardingAnswers | null>(null);
  const [savedTo, setSavedTo] = useState<"supabase" | "local" | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setAuthChecking(false);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleComplete = async (ans: ParentOnboardingAnswers) => {
    setAnswers(ans);
    const uid = session?.user.id;
    let ok = false;
    if (uid) {
      try {
        const { error } = await supabase.from("parent_journeys" as never).insert({
          user_id: uid,
          student_name: "Lucía",
          parent_name: "Carolina",
          teacher_name: "Álvaro",
          plan_name: "Plan Semanal Presencial",
          status: "pilot",
          onboarding_answers: ans as unknown as Record<string, unknown>,
        } as never);
        if (!error) {
          ok = true;
          setSavedTo("supabase");
        } else {
          console.warn("[parent_journeys] fallback a localStorage:", error);
        }
      } catch (e) {
        console.warn("[parent_journeys] excepción, fallback a localStorage:", e);
      }
    }
    if (!ok) {
      try {
        window.localStorage.setItem(LS_KEY, JSON.stringify({ answers: ans, savedAt: new Date().toISOString() }));
        setSavedTo("local");
      } catch {}
    }
    setScreen("summary");
  };

  const shellStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: B.gray,
    color: B.dark,
    fontFamily: "Quicksand, Arial, sans-serif",
    padding: "16px 16px 48px",
  };

  if (authChecking) {
    return (
      <main style={{ ...shellStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 14, color: B.grayText }}>Cargando…</div>
      </main>
    );
  }

  if (!session) {
    return (
      <main style={shellStyle}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <AuthScreen />
        </div>
      </main>
    );
  }

  return (
    <main style={shellStyle}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {screen === "intro" && (
          <ParentJourneyIntroScreen onStart={() => setScreen("onboarding")} />
        )}
        {screen === "onboarding" && (
          <ParentOnboardingScreen
            onCancel={() => setScreen("intro")}
            onComplete={handleComplete}
          />
        )}
        {screen === "summary" && answers && (
          <ParentJourneySummaryScreen
            answers={answers}
            savedTo={savedTo}
            onGoJourney={() => setScreen("dashboard")}
          />
        )}
        {screen === "dashboard" && (
          <ParentJourneyIntroScreen
            variant="dashboard-placeholder"
            onStart={() => setScreen("onboarding")}
          />
        )}
      </div>
    </main>
  );
}
