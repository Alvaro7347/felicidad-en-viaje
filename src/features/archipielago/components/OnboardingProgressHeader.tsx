import { B } from "../data/brand";

interface OnboardingProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
  completed?: boolean;
}

/**
 * Shared onboarding header — same visual language as DiagnosisProgress
 * (Alejandra's diagnosis flow). Generic so it works for María José,
 * George, and any future profile onboarding.
 */
export function OnboardingProgressHeader({
  currentStep,
  totalSteps,
  label = "Perfil",
  completed = false,
}: OnboardingProgressHeaderProps) {
  const pct = completed
    ? 100
    : Math.max(0, Math.min(100, Math.round((currentStep / totalSteps) * 100)));

  const statusText = completed ? `${label} completo ✓` : `${label}: ${pct}%`;

  const ringColor = completed ? B.greenDark : B.green;
  const size = 44;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep}
      aria-label={`Paso ${currentStep} de ${totalSteps}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "14px 4px 4px",
        marginBottom: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={B.grayBorder}
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={ringColor}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
              style={{ transition: "stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1)" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: 11,
              color: B.dark,
              letterSpacing: "-0.02em",
            }}
          >
            {pct}%
          </div>
        </div>

        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: completed ? B.greenDark : B.dark,
            letterSpacing: "0.01em",
          }}
        >
          {statusText}
        </div>
      </div>

      <div
        style={{
          height: 3,
          background: B.grayBorder,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: ringColor,
            borderRadius: 999,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isDone = completed || stepNum < currentStep;
          const isCurrent = !completed && stepNum === currentStep;
          return (
            <div
              key={i}
              style={{
                height: 5,
                width: isCurrent ? 18 : 5,
                borderRadius: 999,
                background: isDone
                  ? B.greenDark
                  : isCurrent
                    ? B.green
                    : B.grayBorder,
                transition: "all 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
