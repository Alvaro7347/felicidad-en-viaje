import { B } from "../data/brand";

export function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        background: 'transparent',
        color: B.grayText,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'Quicksand, sans-serif',
        fontSize: 13.5,
        padding: '0 0 4px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = B.dark; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = B.grayText; }}
    >
      <span aria-hidden="true" style={{ fontSize: 15, lineHeight: 1 }}>←</span>
      {label}
    </button>
  );
}
