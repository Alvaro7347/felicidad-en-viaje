export function SplashScreen({ fading }: { fading: boolean }) {
  return (
    <>
      <style>{`
        @keyframes sk-breathe {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 4px rgba(255,255,255,0.1));
          }
          50% {
            transform: scale(1.08);
            filter: drop-shadow(0 0 36px rgba(255,255,255,0.55));
          }
        }
        @keyframes sk-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#2EE6AE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'sk-fadein 0.35s ease forwards',
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.5s ease' : 'none',
        pointerEvents: 'none',
      }}>
        <img
          src="/logo-soundkeleles-nobg.png"
          alt="SoundKeleles"
          style={{
            width: 'min(240px, 60vw)',
            display: 'block',
            animation: 'sk-breathe 2.8s ease-in-out infinite',
          }}
        />
      </div>
    </>
  );
}
