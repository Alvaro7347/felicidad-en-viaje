import { useCallback, useEffect, useState } from "react";
import { loadParentJourney } from "@/features/archipielago/services/journeyRepository";
import { ParentJourneyDashboardScreen } from "./ParentJourneyDashboardScreen";
import type { ParentOnboardingAnswers } from "./ParentOnboardingScreen";

type Status = "ready" | "loading" | "error" | "missing";

type Props = {
  userId: string;
  initialStudentName?: string;
  initialParentName?: string;
  onOpenJourney: (studentName: string) => void;
  onHydrated: (data: {
    studentName: string;
    parentName?: string;
    answers?: ParentOnboardingAnswers | null;
  }) => void;
  onMissing: () => void;
};

function readLocalCache(): { studentName?: string; parentName?: string; answers?: ParentOnboardingAnswers } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("archipielago_parent_journey_lucia");
    if (!raw) return null;
    const saved = JSON.parse(raw) as {
      answers?: ParentOnboardingAnswers & {
        student?: { name?: string };
        parent?: { name?: string };
      };
    };
    return {
      studentName: saved.answers?.student?.name,
      parentName: saved.answers?.parent?.name,
      answers: saved.answers as ParentOnboardingAnswers | undefined,
    };
  } catch {
    return null;
  }
}

export function ParentJourneyDashboardHydrator({
  userId,
  initialStudentName,
  initialParentName,
  onOpenJourney,
  onHydrated,
  onMissing,
}: Props) {
  const [studentName, setStudentName] = useState<string | undefined>(initialStudentName);
  const [parentName, setParentName] = useState<string | undefined>(initialParentName);
  const [status, setStatus] = useState<Status>(initialStudentName ? "ready" : "loading");
  const [attempt, setAttempt] = useState(0);

  const hydrate = useCallback(async () => {
    // 1) Intento local (sólo mismo user_id ya validado por effect superior).
    const cached = readLocalCache();
    if (cached?.studentName) {
      setStudentName((prev) => prev ?? cached.studentName);
      setParentName((prev) => prev ?? cached.parentName);
      onHydrated({
        studentName: cached.studentName,
        parentName: cached.parentName,
        answers: cached.answers ?? null,
      });
      setStatus("ready");
      return;
    }

    // 2) Supabase.
    try {
      const { data, error } = await supabase
        .from("parent_journeys")
        .select("student_name, parent_name, onboarding_answers")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) {
        setStatus("error");
        return;
      }
      if (!data) {
        setStatus("missing");
        onMissing();
        return;
      }
      const answers = (data.onboarding_answers ?? null) as ParentOnboardingAnswers | null;
      const s = data.student_name ?? answers?.student?.name ?? "";
      const p = data.parent_name ?? answers?.parent?.name ?? "";
      if (!s) {
        setStatus("missing");
        onMissing();
        return;
      }
      setStudentName(s);
      setParentName(p);
      onHydrated({ studentName: s, parentName: p, answers });
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [userId, onHydrated, onMissing]);

  useEffect(() => {
    if (status !== "loading") return;
    void hydrate();
  }, [status, hydrate, attempt]);

  if (status === "ready" && studentName) {
    return (
      <ParentJourneyDashboardScreen
        studentName={studentName}
        parentName={parentName}
        onOpenJourney={() => onOpenJourney(studentName)}
      />
    );
  }

  if (status === "error") {
    return (
      <CenteredMessage
        title="No pudimos cargar tu viaje."
        subtitle="Revisa tu conexión e inténtalo de nuevo."
        actionLabel="Reintentar"
        onAction={() => {
          setStatus("loading");
          setAttempt((n) => n + 1);
        }}
      />
    );
  }

  // loading / missing (missing dispara onMissing pero mientras tanto mostramos loader)
  return <CenteredMessage title="Cargando tu viaje musical…" spinner />;
}

function CenteredMessage({
  title,
  subtitle,
  actionLabel,
  onAction,
  spinner,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  spinner?: boolean;
}) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: 24,
        textAlign: "center",
      }}
    >
      {spinner && (
        <div
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "3px solid rgba(0,0,0,0.1)",
            borderTopColor: "#2EE6AE",
            animation: "pj-spin 0.9s linear infinite",
          }}
        />
      )}
      <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 18, color: "#1a1a1a" }}>
        {title}
      </div>
      {subtitle && <div style={{ fontSize: 14, color: "#6f6f6d" }}>{subtitle}</div>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            marginTop: 6,
            border: "none",
            background: "#2EE6AE",
            color: "#1a1a1a",
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: 15,
            borderRadius: 12,
            padding: "12px 22px",
            cursor: "pointer",
          }}
        >
          {actionLabel}
        </button>
      )}
      <style>{`@keyframes pj-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
