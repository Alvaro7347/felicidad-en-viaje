import { B } from "../data/brand";

export function MissionIntroHeader({
  eyebrow,
  status,
  title,
  subtitle,
}: {
  eyebrow?: string;
  status?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header style={{ padding: "4px 2px 6px", display: "flex", flexDirection: "column", gap: 10 }}>
      {eyebrow && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 22, height: 2, background: B.green, borderRadius: 999, display: "inline-block" }} />
          <span style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            color: B.grayText,
          }}>
            {eyebrow}
          </span>
        </div>
      )}

      {status && (
        <span style={{
          alignSelf: "flex-start",
          background: B.pinkLight,
          color: B.pink,
          fontWeight: 800,
          fontSize: 11,
          letterSpacing: "0.5px",
          borderRadius: 999,
          padding: "4px 11px",
        }}>
          {status}
        </span>
      )}

      <h1 style={{
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: 800,
        fontSize: "clamp(24px, 5.2vw, 32px)",
        lineHeight: 1.15,
        letterSpacing: "-0.01em",
        color: B.dark,
        margin: 0,
      }}>
        {title}
      </h1>

      {subtitle && (
        <p style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.55,
          color: B.grayText,
          maxWidth: 560,
        }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
