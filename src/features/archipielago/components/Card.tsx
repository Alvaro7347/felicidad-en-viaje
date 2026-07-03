import { B } from "../data/brand";

export function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: B.white, borderRadius: 24, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: `1px solid ${B.grayBorder}`, ...style }}>
      {children}
    </div>
  );
}
