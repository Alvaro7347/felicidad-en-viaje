import { B } from "../data/brand";

export function MissionIntroHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header style={{ padding: "2px 2px 4px", display: "flex", flexDirection: "column", gap: 10 }}>
      <h1 style={{
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: 800,
        fontSize: "clamp(26px, 6vw, 34px)",
        lineHeight: 1.12,
        letterSpacing: "-0.015em",
        color: B.dark,
        margin: 0,
      }}>
        {title}
      </h1>

      {subtitle && (
        <p style={{
          margin: 0,
          fontSize: 14.5,
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
