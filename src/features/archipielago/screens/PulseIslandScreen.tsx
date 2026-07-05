import { useState, useRef, useEffect, useCallback } from "react";
import { B } from "../data/brand";
import type { NodeStatus, RouteNode } from "../types";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";

const PULSE_NODES: RouteNode[] = [
  { id: 'p1', title: 'El acorde de la luz: SOL', subtitle: 'Entiende el SOL como puerta a más canciones.', icon: '☀️', status: 'current', type: 'Video práctica', time: '4 min' },
  { id: 'p2', title: 'Mapa visual del SOL', subtitle: 'Refuerza el acorde SOL con apoyo visual.', icon: '🗺️', status: 'locked', type: 'Diagrama', time: '2 min' },
  { id: 'p3', title: 'Puente SOL–DO', subtitle: 'Practica un cambio cercano y controlado.', icon: '🌉', status: 'locked', type: 'Práctica BPM', time: '5 min' },
  { id: 'p4', title: 'Leer el camino de los acordes', subtitle: 'Aprende a seguir una progresión simple.', icon: '📖', status: 'locked', type: 'Video', time: '4 min' },
  { id: 'p5', title: 'La Vaca Lola en pulso', subtitle: 'Aplica DO y SOL en una canción simple.', icon: '🐮', status: 'locked', type: 'Canción guiada', time: '5 min' },
  { id: 'p6', title: 'Puente SOL–LAm', subtitle: 'Entrena una distancia mayor entre acordes.', icon: '🌉', status: 'locked', type: 'Práctica BPM', time: '5 min' },
  { id: 'p7', title: 'Puente SOL–FA', subtitle: 'Enfrenta un cambio desafiante con calma.', icon: '🌉', status: 'locked', type: 'Práctica BPM', time: '5 min' },
  { id: 'p8', title: 'No se va en pulso', subtitle: 'Toca una canción popular con cuatro acordes.', icon: '🎶', status: 'locked', type: 'Canción guiada', time: '6 min' },
  { id: 'p9', title: 'Descifra la clave americana', subtitle: 'Aprende el idioma moderno de los acordes.', icon: '🔤', status: 'locked', type: 'Video + tarjeta', time: '3 min' },
  { id: 'p10', title: 'Despacito en pulso', subtitle: 'Aplica LAm–FA–DO–SOL usando cifrado.', icon: '🎵', status: 'locked', type: 'Canción guiada', time: '6 min' },
  { id: 'p11', title: 'Calma en pulso', subtitle: 'Cierra la isla tocando con calma.', icon: '🌊', status: 'locked', type: 'Cierre de isla', time: '6 min' },
];

// Isla del Pulso activa en este carrusel.
const TERRITORIES = [
  { id: 'puerto-inicio', title: 'Puerto de Inicio', state: 'done' as const },
  { id: 'primeras-melodias', title: 'Isla de Primeras Melodías', state: 'done' as const },
  { id: 'pulso', title: 'Isla del Pulso', state: 'active' as const, progress: 0 },
  { id: 'ritmo', title: 'Isla del Ritmo', state: 'locked' as const },
];

export function PulseIslandScreen({
  onOpenStartPort,
  onOpenFirstMelodiesIsland,
  onOpenLesson,
}: {
  onOpenStartPort: () => void;
  onOpenFirstMelodiesIsland: () => void;
  onOpenLesson: (lessonId: string) => void;
}) {
  const [modal, setModal] = useState<null | { kind: 'locked-island' } | { kind: 'locked-node'; nodeId: string }>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pressedNode, setPressedNode] = useState<string | null>(null);
  const [pressedIsland, setPressedIsland] = useState<string | null>(null);
  const [focusedStageId, setFocusedStageId] = useState<string>('pulso');
  const [mounted, setMounted] = useState(false);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const recomputeFocus = useCallback(() => {
    const container = stripRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const cCenter = cRect.left + cRect.width / 2;
    let bestId = TERRITORIES[0].id;
    let bestDist = Infinity;
    for (const t of TERRITORIES) {
      const el = stageRefs.current[t.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(center - cCenter);
      if (dist < bestDist) { bestDist = dist; bestId = t.id; }
    }
    setFocusedStageId((prev) => (prev === bestId ? prev : bestId));
  }, []);

  useEffect(() => {
    const el = stageRefs.current['pulso'];
    const c = stripRef.current;
    if (el && c) {
      const target = el.offsetLeft - (c.clientWidth - el.clientWidth) / 2;
      c.scrollTo({ left: Math.max(0, target), behavior: 'auto' });
    }
    recomputeFocus();
    const onResize = () => recomputeFocus();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [recomputeFocus]);

  const nodeColors: Record<NodeStatus, { bg: string; border: string }> = {
    done: { bg: B.green, border: B.greenDark },
    current: { bg: B.green, border: B.pink },
    locked: { bg: B.grayBorder, border: B.grayBorder },
    achievement: { bg: '#FFF5E0', border: '#F5B800' },
  };

  const handleTerritory = (id: string) => {
    if (id === 'puerto-inicio') { onOpenStartPort(); return; }
    if (id === 'primeras-melodias') { onOpenFirstMelodiesIsland(); return; }
    if (id === 'pulso') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setModal('locked-island');
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 14,
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 260ms ease, transform 260ms ease',
    }}>
      {/* Carrusel negro de territorios */}
      <div style={{
        background: 'linear-gradient(135deg, #252b29 0%, #1c2220 100%)',
        borderRadius: 18,
        padding: '12px 0',
        overflow: 'hidden',
        minHeight: 108,
      }}>
        <div
          ref={stripRef}
          onScroll={recomputeFocus}
          style={{
            display: 'flex', alignItems: 'center', overflowX: 'auto',
            scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
            padding: '2px 16px', scrollbarWidth: 'none', gap: 0, minHeight: 84,
          }}
        >
          {TERRITORIES.map((t, i) => {
            const isActive = t.state === 'active';
            const isDone = t.state === 'done';
            const isFocused = focusedStageId === t.id;
            const isPress = pressedIsland === t.id;
            const focusScale = isFocused ? 1 : 0.96;
            const pressScale = isPress ? 0.97 : 1;
            const scale = `scale(${(focusScale * pressScale).toFixed(3)})`;
            const opacity = isFocused ? (isActive ? 1 : 0.85) : (isActive ? 0.78 : 0.55);
            const border = isActive
              ? '1px solid rgba(46,230,174,0.6)'
              : isDone
              ? '1px solid rgba(46,230,174,0.35)'
              : '1px solid rgba(255,255,255,0.18)';
            const bg = isActive
              ? 'rgba(46,230,174,0.14)'
              : isDone
              ? 'rgba(46,230,174,0.05)'
              : 'rgba(255,255,255,0.02)';

            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ flexShrink: 0, minHeight: 76, display: 'flex', alignItems: 'center', scrollSnapAlign: 'center' }}>
                  <div
                    ref={(el) => { stageRefs.current[t.id] = el; }}
                    onMouseDown={() => setPressedIsland(t.id)}
                    onMouseUp={() => setPressedIsland(null)}
                    onMouseLeave={() => setPressedIsland(null)}
                    onTouchStart={() => setPressedIsland(t.id)}
                    onTouchEnd={() => setPressedIsland(null)}
                    onTouchCancel={() => setPressedIsland(null)}
                    onClick={() => handleTerritory(t.id)}
                    style={{
                      background: bg, border, borderRadius: 13, padding: '8px 12px',
                      minWidth: 168, minHeight: 62, boxSizing: 'border-box',
                      display: 'flex', flexDirection: 'column', justifyContent: 'center',
                      transform: scale, transformOrigin: 'center center', opacity,
                      transition: 'transform 0.22s ease, opacity 0.22s ease, border-color 0.22s ease, background 0.22s ease',
                      cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18, opacity: isActive || isDone ? 1 : 0.55 }}>
                        {t.state === 'locked' ? '🔒' : '🏝'}
                      </span>
                      <div>
                        <div style={{
                          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12,
                          color: isActive ? B.white : isDone ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
                          lineHeight: 1.2, whiteSpace: 'nowrap',
                        }}>
                          {t.title}
                        </div>
                        <div style={{
                          fontSize: 9, marginTop: 2, letterSpacing: '0.02em',
                          color: isActive ? 'rgba(46,230,174,0.85)' : isDone ? 'rgba(46,230,174,0.75)' : 'rgba(255,255,255,0.35)',
                        }}>
                          {isActive ? 'aquí estás' : isDone ? 'completado' : 'próximamente'}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, minHeight: 18 }}>
                      {isActive && (
                        <>
                          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', width: 120 }}>
                            <div style={{ width: `${t.progress ?? 0}%`, height: '100%', background: B.green, borderRadius: 999 }} />
                          </div>
                          <div style={{ fontSize: 9, fontWeight: 800, color: B.green, marginTop: 3, opacity: 0.85 }}>
                            {t.progress ?? 0}% completado
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {i < TERRITORIES.length - 1 && (
                  <div style={{ flexShrink: 0, width: 22, textAlign: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.12)', letterSpacing: '-1px' }}>··›</span>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ flexShrink: 0, paddingLeft: 6, display: 'flex', alignItems: 'center', gap: 3, opacity: 0.22 }}>
            <span style={{ fontSize: 9, color: B.white, letterSpacing: '-0.5px' }}>···</span>
            <span style={{ fontSize: 13 }}>🌊</span>
          </div>
        </div>
      </div>

      {/* Título de sección */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 15 }}>💓</span>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15, color: B.dark, letterSpacing: '-0.01em' }}>
          Navegante, esta es tu ruta del pulso
        </span>
      </div>

      {/* Ruta vertical */}
      <div style={{ position: 'relative', paddingLeft: 30 }}>
        <div style={{
          position: 'absolute', left: 13, top: 20, bottom: 20, width: 1.5,
          background: `repeating-linear-gradient(to bottom, ${B.green} 0, ${B.green} 5px, transparent 5px, transparent 10px)`,
          opacity: 0.5, zIndex: 0,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PULSE_NODES.map((node) => {
            const s = node.status;
            const c = nodeColors[s];
            const isCurrent = s === 'current';
            const isLocked = s === 'locked';
            const isHov = hoveredNode === node.id;
            const isPress = pressedNode === node.id;
            const cardScale = isPress ? 'scale(0.98)' : isHov ? 'scale(1.02)' : 'scale(1)';
            const cardShadow = isPress
              ? 'none'
              : isCurrent
              ? '0 2px 10px rgba(46,230,174,0.15)'
              : 'none';
            const cardBorder = `1.5px solid ${isCurrent ? B.pink : B.grayBorder}`;

            return (
              <div key={node.id} style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  position: 'absolute', left: -30, top: 12,
                  width: 26, height: 26, borderRadius: 999,
                  background: c.bg, border: `2px solid ${c.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, boxShadow: isCurrent ? `0 0 0 3px ${B.pinkLight}` : 'none', zIndex: 2,
                }}>
                  {isLocked ? <span style={{ fontSize: 10 }}>🔒</span> : <span style={{ fontSize: 11 }}>{node.icon}</span>}
                </div>

                <div
                  onClick={() => {
                    if (isCurrent) setModal('coming-soon');
                    else setModal('locked-node');
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => { setHoveredNode(null); setPressedNode(null); }}
                  onMouseDown={() => setPressedNode(node.id)}
                  onMouseUp={() => setPressedNode(null)}
                  onTouchStart={() => setPressedNode(node.id)}
                  onTouchEnd={() => setPressedNode(null)}
                  onTouchCancel={() => setPressedNode(null)}
                  style={{
                    background: isCurrent ? B.green : isLocked ? B.gray : B.white,
                    border: cardBorder, borderRadius: 14, padding: '10px 14px',
                    cursor: 'pointer', transform: cardScale, boxShadow: cardShadow,
                    transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease, border-color 0.15s ease',
                    userSelect: 'none', WebkitUserSelect: 'none',
                  }}
                >
                  <div style={{
                    fontWeight: 800, fontSize: 13, color: isLocked ? B.grayText : B.dark,
                    marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                  }}>
                    {node.title}
                    {isCurrent && <span style={{ background: B.pink, color: B.white, fontSize: 9, fontWeight: 800, borderRadius: 999, padding: '1px 7px' }}>AHORA</span>}
                  </div>
                  <div style={{ fontSize: 11, lineHeight: 1.4, color: isLocked ? '#ccc' : '#999', marginBottom: 6 }}>
                    {node.subtitle}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    {node.time && (
                      <div style={{
                        fontSize: 10, color: isCurrent ? B.dark : B.grayText, fontWeight: 700,
                        background: isCurrent ? 'rgba(60,60,59,0.1)' : B.gray,
                        borderRadius: 999, padding: '2px 9px', whiteSpace: 'nowrap',
                      }}>
                        {node.type} · {node.time}
                      </div>
                    )}
                    {isCurrent && (
                      <div style={{ width: 24, height: 24, borderRadius: 999, background: B.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: B.white, paddingLeft: 1 }}>▶</div>
                    )}
                    {isLocked && (
                      <div style={{ color: B.pink, fontSize: 10, fontWeight: 800 }}>Bloqueada</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modales */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(60,60,59,0.45)', zIndex: 60,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 420 }}>
            <Card style={{ border: `1.5px solid ${modal === 'coming-soon' ? B.pink : B.grayBorder}` }}>
              <div style={{ fontSize: 18, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: B.dark, marginBottom: 8 }}>
                {modal === 'locked-island' && '🔒 Isla aún bloqueada'}
                {modal === 'locked-node' && '🔒 Unidad bloqueada'}
                {modal === 'coming-soon' && '💓 Lección en preparación'}
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: B.grayText, marginBottom: 14 }}>
                {modal === 'locked-island' && 'Para llegar aquí, primero necesitas completar las unidades anteriores. El viaje avanza una isla a la vez.'}
                {modal === 'locked-node' && 'Esta unidad se desbloqueará cuando completes los pasos anteriores. Por ahora estamos preparando la ruta de esta isla.'}
                {modal === 'coming-soon' && 'Esta será la primera lección de la Isla del Pulso. Pronto conectaremos esta unidad al flujo del curso.'}
              </div>
              <Btn onClick={() => setModal(null)} fullWidth>Entendido</Btn>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
