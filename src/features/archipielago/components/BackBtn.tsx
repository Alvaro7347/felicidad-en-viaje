import { B } from "../data/brand";

export function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      border: 'none', background: 'transparent', color: B.pink, fontWeight: 800,
      cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontSize: 14,
      padding: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: 5,
    }}>
      ← {label}
    </button>
  );
}
