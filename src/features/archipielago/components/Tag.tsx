import { B } from "../data/brand";

export function Tag({ children, color = 'green' }: { children: React.ReactNode; color?: 'green' | 'pink' | 'gray' }) {
  const map = {
    green: { bg: B.greenLight, text: B.greenDark },
    pink: { bg: B.pinkLight, text: B.pink },
    gray: { bg: B.gray, text: B.grayText },
  };
  return (
    <span style={{
      display: 'inline-block', background: map[color].bg, color: map[color].text,
      fontWeight: 800, fontSize: 11, borderRadius: 999, padding: '4px 11px', letterSpacing: '0.5px',
    }}>
      {children}
    </span>
  );
}
