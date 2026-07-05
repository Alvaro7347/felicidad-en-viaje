import { useState, useRef, useEffect, useCallback } from "react";
import { B } from "../data/brand";
import { START_PORT_NODES, ROUTE_STAGES } from "../data/islands";

import type { NodeStatus } from "../types";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { touchLastVisit } from "../data/musicalFuel";

export function RouteScreen({ onStartMission, onReviewMission, onOpenFirstMelodiesIsland, onOpenPulseIsland, onOpenRhythmIsland, onOpenMusicIsland, userName }: { onStartMission: () => void; onReviewMission: (id: string) => void; onOpenFirstMelodiesIsland: () => void; onOpenPulseIsland: () => void; onOpenRhythmIsland: () => void; onOpenMusicIsland: () => void; userName: string }) {
  const firstName = (userName ?? '').trim().split(/\s+/)[0] ?? '';
  const routeTitle = firstName ? `${firstName}, esta es tu ruta` : 'Esta es tu ruta';
  // Mantenemos el registro de última visita para futuros usos del combustible musical
  // (celebraciones, perfil), pero ya no lo mostramos como tarjeta permanente en la ruta.
  useEffect(() => { touchLastVisit(); }, []);

  const [exploringNode, setExploringNode] = useState<string | null>(null);
  const [showLockedIsland, setShowLockedIsland] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pressedNode, setPressedNode] = useState<string | null>(null);
  const [pressedIsland, setPressedIsland] = useState<string | null>(null);
  const [focusedStageId, setFocusedStageId] = useState<string>(ROUTE_STAGES[0].id);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const recomputeFocus = useCallback(() => {
    const container = stripRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const cCenter = cRect.left + cRect.width / 2;
    let bestId = ROUTE_STAGES[0].id;
    let bestDist = Infinity;
    for (const stage of ROUTE_STAGES) {
      const el = stageRefs.current[stage.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(center - cCenter);
      if (dist < bestDist) { bestDist = dist; bestId = stage.id; }
    }
    setFocusedStageId((prev) => (prev === bestId ? prev : bestId));
  }, []);

  useEffect(() => {
    recomputeFocus();
    const onResize = () => recomputeFocus();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [recomputeFocus]);
  const nodeColors: Record<NodeStatus, { bg: string; border: string; icon: string; text: string }> = {
    done: { bg: B.green, border: B.greenDark, icon: B.dark, text: B.dark },
    current: { bg: B.green, border: B.pink, icon: B.dark, text: B.dark },
    locked: { bg: B.grayBorder, border: B.grayBorder, icon: B.grayText, text: B.grayText },
    achievement: { bg: '#FFF5E0', border: '#F5B800', icon: '#F5B800', text: B.dark },
  };

  return (
    <div>


      {/* ── Island journey strip ── */}
      <div style={{
        background: 'linear-gradient(135deg, #252b29 0%, #1c2220 100%)',
        borderRadius: 18,
        padding: '12px 0',
        marginBottom: 20,
        overflow: 'hidden',
        minHeight: 108,
      }}>
        <div
          ref={stripRef}
          onScroll={recomputeFocus}
          style={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          padding: '2px 16px',
          scrollbarWidth: 'none',
          gap: 0,
          minHeight: 84,
        }}>
          {ROUTE_STAGES.map((isl, i) => {
            const isActive = isl.status === 'active';
            const isFocused = focusedStageId === isl.id;
            const isIslPress = pressedIsland === isl.id;

            const focusScale = isFocused ? 1 : 0.96;
            const pressScale = isIslPress ? 0.97 : 1;
            const islScale = `scale(${(focusScale * pressScale).toFixed(3)})`;
            const islOpacity = isFocused
              ? (isActive ? 1 : 0.85)
              : (isActive ? 0.78 : 0.55);
            const islShadow = isFocused && !isIslPress
              ? isActive
                ? '0 6px 20px rgba(46,230,174,0.22)'
                : '0 4px 14px rgba(0,0,0,0.22)'
              : 'none';
            const islBorder = isFocused
              ? isActive
                ? '1px solid rgba(46,230,174,0.6)'
                : '1px solid rgba(255,255,255,0.28)'
              : isActive
              ? '1px solid rgba(46,230,174,0.25)'
              : '1px solid rgba(255,255,255,0.1)';
            const islBg = isFocused && isActive
              ? 'rgba(46,230,174,0.14)'
              : isActive
              ? 'rgba(46,230,174,0.08)'
              : 'rgba(255,255,255,0.02)';

            return (
              <div key={isl.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {/* Stable wrapper — reserves fixed space so scaling doesn't shift layout */}
                <div style={{
                  flexShrink: 0,
                  minHeight: 76,
                  display: 'flex',
                  alignItems: 'center',
                  scrollSnapAlign: 'center',
                }}>
                  {/* Island chip */}
                  <div
                    ref={(el) => { stageRefs.current[isl.id] = el; }}
                    onMouseDown={() => setPressedIsland(isl.id)}
                    onMouseUp={() => setPressedIsland(null)}
                    onMouseLeave={() => setPressedIsland(null)}
                    onTouchStart={() => setPressedIsland(isl.id)}
                    onTouchEnd={() => setPressedIsland(null)}
                    onTouchCancel={() => setPressedIsland(null)}
                    onClick={() => {
                      if (isl.id === 'puerto-inicio') return;
                      if (isl.id === 'primeras-melodias') { onOpenFirstMelodiesIsland(); return; }
                      if (isl.id === 'pulso') { onOpenPulseIsland(); return; }
                      if (isl.id === 'ritmo') { onOpenRhythmIsland(); return; }
                      if (isl.id === 'musical') { onOpenMusicIsland(); return; }
                      setShowLockedIsland(true);
                    }}
                    style={{
                    background: islBg,
                    border: islBorder,
                    borderRadius: 13,
                    padding: '8px 12px',
                    minWidth: 168,
                    minHeight: 62,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transform: islScale,
                    transformOrigin: 'center center',
                    opacity: islOpacity,
                    boxShadow: islShadow,
                    transition: 'transform 0.22s ease, opacity 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease',
                    cursor: 'pointer',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 18,
                        opacity: isActive ? 1 : 0.55,
                        filter: isActive ? 'none' : 'grayscale(0.4)',
                      }}>🏝</span>
                      <div>
                        <div style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 800,
                          fontSize: 12,
                          color: isActive ? B.white : (isFocused ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.45)'),
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                          transition: 'color 0.22s ease',
                        }}>
                          {isl.title}
                        </div>
                        {!isActive && (() => {
                          const isPrototype = isl.id === 'primeras-melodias' || isl.id === 'pulso' || isl.id === 'ritmo';
                          return (
                            <div style={{ fontSize: 9, color: isPrototype ? 'rgba(46,230,174,0.85)' : (isFocused ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.25)'), marginTop: 2, letterSpacing: '0.02em' }}>
                              {isPrototype ? 'disponible prototipo' : 'próximamente'}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Reserved bottom area — keeps active and locked cards the same structural size */}
                    <div style={{ marginTop: 8, minHeight: 18 }}>
                      {isActive ? (
                        <>
                          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', width: 120 }}>
                            <div style={{ width: `${isl.progress}%`, height: '100%', background: B.green, borderRadius: 999 }} />
                          </div>
                          <div style={{ fontSize: 9, fontWeight: 800, color: B.green, marginTop: 3, opacity: 0.85 }}>
                            {isl.progress}% completado
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>

                </div>


                {/* Connector */}
                {i < ROUTE_STAGES.length - 1 && (
                  <div style={{ flexShrink: 0, width: 22, textAlign: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.12)', letterSpacing: '-1px' }}>··›</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Horizon hint */}
          <div style={{ flexShrink: 0, paddingLeft: 6, display: 'flex', alignItems: 'center', gap: 3, opacity: 0.22 }}>
            <span style={{ fontSize: 9, color: B.white, letterSpacing: '-0.5px' }}>···</span>
            <span style={{ fontSize: 13 }}>🌊</span>
          </div>
        </div>
      </div>

      {exploringNode && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(60,60,59,0.45)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <Card style={{ width: '100%', maxWidth: 460, border: `1.5px solid ${B.pink}` }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 6 }}>
              Modo exploración
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: B.dark, marginBottom: 14 }}>
              Esta misión aún no está desbloqueada en tu viaje, pero puedes explorarla para conocer cómo será la experiencia.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn onClick={() => setExploringNode(null)} fullWidth>
                Entendido
              </Btn>
              <Btn variant="ghost" onClick={() => setExploringNode(null)} fullWidth>
                Volver a la ruta
              </Btn>
            </div>
          </Card>
        </div>
      )}

      {showLockedIsland && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(60,60,59,0.45)', zIndex: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <Card style={{ width: '100%', maxWidth: 420, border: `1.5px solid ${B.grayBorder}` }}>
            <div style={{ fontSize: 18, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: B.dark, marginBottom: 8 }}>
              🔒 Isla aún bloqueada
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: B.grayText, marginBottom: 14 }}>
              Para llegar aquí, primero necesitas completar las unidades anteriores. El viaje avanza una isla a la vez.
            </div>
            <Btn onClick={() => setShowLockedIsland(false)} fullWidth>Entendido</Btn>
          </Card>
        </div>
      )}

      {/* ── Section title ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 15 }}>✨</span>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15, color: B.dark, letterSpacing: '-0.01em' }}>
          {routeTitle}
        </span>
      </div>


      {/* ── Node path ── */}
      <div style={{ position: 'relative', paddingLeft: 30 }}>
        {/* Vertical connector line — thinner, subtler */}
        <div style={{
          position: 'absolute', left: 13, top: 20, bottom: 20, width: 1.5,
          background: `repeating-linear-gradient(to bottom, ${B.green} 0, ${B.green} 5px, transparent 5px, transparent 10px)`,
          opacity: 0.5,
          zIndex: 0,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {START_PORT_NODES.map((node) => {
            const s = node.status;
            const c = nodeColors[s];
            const isCurrent = s === 'current';
            const isLocked = s === 'locked';
            const isAchievement = s === 'achievement';
            const isInteractive = isCurrent || isLocked || s === 'done';
            const isHov = hoveredNode === node.id;
            const isPress = pressedNode === node.id;

            const cardScale = isPress
              ? 'scale(0.98)'
              : isHov && isInteractive ? 'scale(1.02)' : 'scale(1)';

            const cardShadow = isPress
              ? 'none'
              : isHov && isInteractive
              ? isCurrent
                ? `0 6px 20px rgba(46,230,174,0.28)`
                : s === 'done'
                ? `0 4px 14px rgba(46,230,174,0.16)`
                : `0 4px 12px rgba(0,0,0,0.08)`
              : isCurrent
              ? `0 2px 10px rgba(46,230,174,0.15)`
              : 'none';

            const cardBorder = isHov && isInteractive && !isPress
              ? isCurrent ? `1.5px solid ${B.pink}` : s === 'done' ? `1.5px solid ${B.green}` : `1.5px solid ${B.grayText}`
              : `1.5px solid ${isCurrent ? B.pink : isAchievement ? '#F5B800' : B.grayBorder}`;

            return (
              <div key={node.id} style={{ position: 'relative', zIndex: 1 }}>
                {/* Node dot — smaller */}
                <div style={{
                  position: 'absolute',
                  left: -30,
                  top: 12,
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: c.bg,
                  border: `2px solid ${c.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  boxShadow: isCurrent ? `0 0 0 3px ${B.pinkLight}` : 'none',
                  zIndex: 2,
                  transition: 'transform 0.18s ease',
                  transform: isPress ? 'scale(0.9)' : isHov && isCurrent ? 'scale(1.1)' : 'scale(1)',
                }}>
                  {s === 'done'
                    ? <span style={{ color: B.dark, fontWeight: 900, fontSize: 11 }}>✓</span>
                    : s === 'locked'
                    ? <span style={{ fontSize: 10 }}>🔒</span>
                    : <span style={{ fontSize: 11 }}>{node.icon}</span>}
                </div>

                {/* Node card */}
                <div
                  onClick={() => {
                    if (isCurrent) onStartMission();
                    else if (isLocked) setExploringNode(node.id);
                    else if (s === 'done') onReviewMission(node.id);
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => { setHoveredNode(null); setPressedNode(null); }}
                  onMouseDown={() => isInteractive && setPressedNode(node.id)}
                  onMouseUp={() => setPressedNode(null)}
                  onTouchStart={() => isInteractive && setPressedNode(node.id)}
                  onTouchEnd={() => setPressedNode(null)}
                  onTouchCancel={() => setPressedNode(null)}
                  style={{
                    background: isCurrent ? B.green : isAchievement ? '#FFF9EC' : isLocked ? B.gray : B.white,
                    border: cardBorder,
                    borderRadius: 14,
                    padding: '10px 14px',
                    cursor: isInteractive ? 'pointer' : 'default',
                    transform: cardScale,
                    boxShadow: cardShadow,
                    transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease, border-color 0.15s ease',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                >
                  {/* Title row */}
                  <div style={{
                    fontWeight: 800,
                    fontSize: 13,
                    color: isLocked ? B.grayText : B.dark,
                    marginBottom: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexWrap: 'wrap',
                  }}>
                    {node.title}
                    {isCurrent && <span style={{ background: B.pink, color: B.white, fontSize: 9, fontWeight: 800, borderRadius: 999, padding: '1px 7px' }}>AHORA</span>}
                    {isAchievement && <span style={{ background: '#F5B800', color: B.white, fontSize: 9, fontWeight: 800, borderRadius: 999, padding: '1px 7px' }}>LOGRO</span>}
                  </div>

                  {/* Subtitle */}
                  <div style={{ fontSize: 11, lineHeight: 1.4, color: isLocked ? '#ccc' : '#999', marginBottom: 6 }}>
                    {node.subtitle}
                  </div>

                  {/* Meta row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    {node.time && (
                      <div style={{ fontSize: 10, color: isCurrent ? B.dark : B.grayText, fontWeight: 700, background: isCurrent ? 'rgba(60,60,59,0.1)' : B.gray, borderRadius: 999, padding: '2px 9px', whiteSpace: 'nowrap' }}>
                        {node.type} · {node.time}
                      </div>
                    )}
                    {isCurrent && (
                      <div style={{ width: 24, height: 24, borderRadius: 999, background: B.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: B.white, paddingLeft: 1 }}>▶</div>
                    )}
                    {s === 'done' && (
                      <div style={{ color: B.greenDark, fontSize: 10, fontWeight: 800 }}>
                        Revisar →
                      </div>
                    )}
                    {isLocked && (
                      <div style={{ color: B.pink, fontSize: 10, fontWeight: 800 }}>
                        Explorar →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Mission ──────────────────────────────────────────────────────────
