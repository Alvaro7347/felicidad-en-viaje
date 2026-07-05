import { useState, useRef } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";
import {
  findRhythmLesson,
  RHYTHM_LESSONS,
  RHYTHM_SUMMARY_CHIPS,
  RHYTHM_CLOSURE_QUESTIONS,
  type RhythmLesson,
  type RhythmVideo,
} from "../data/rhythmLessons";

// ───────────────────────────────────────────────
// Video reusable card
// ───────────────────────────────────────────────
function VideoCard({
  videoId,
  title,
  subtitle,
  badge,
}: {
  videoId: string;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  const [open, setOpen] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 220, background: '#111' }}>
          <img src={thumb} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)' }} />
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, color: B.white }}>
            {badge && (
              <div style={{
                display: 'inline-block', background: 'rgba(46,230,174,0.95)', color: B.dark,
                fontWeight: 800, fontSize: 11, padding: '4px 10px', borderRadius: 999,
                letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8,
              }}>
                {badge}
              </div>
            )}
            <div style={{ fontWeight: 800, fontSize: 15, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 12, opacity: 0.92, marginTop: 2, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {subtitle}
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label={`Reproducir: ${title}`}
            onClick={() => setOpen(true)}
            style={{
              position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%, -50%)',
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', opacity: 0.9,
            }}
          >
            <svg width="76" height="54" viewBox="0 0 68 48" aria-hidden="true" style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.4))' }}>
              <rect x="0" y="0" width="68" height="48" rx="14" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M27 15 L47 24 L27 33 Z" fill="#FFFFFF" />
            </svg>
          </button>
        </div>
      </Card>

      {open && (
        <div
          role="dialog" aria-modal="true" aria-label={`Video: ${title}`}
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 12, zIndex: 1000, maxHeight: '100dvh', overflowY: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 900, background: B.white, borderRadius: 16,
              overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', maxHeight: 'calc(100dvh - 24px)',
            }}
          >
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: B.dark, lineHeight: 1.2 }}>{title}</div>
                {subtitle && (
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {subtitle}
                  </div>
                )}
              </div>
              <button
                type="button" onClick={() => setOpen(false)} aria-label="Cerrar video"
                style={{
                  background: 'transparent', border: '1px solid #ddd', borderRadius: 999,
                  padding: '6px 12px', fontSize: 12, fontWeight: 700, color: B.dark, cursor: 'pointer', flexShrink: 0,
                }}
              >
                Cerrar
              </button>
            </div>
            <div style={{ flex: '1 1 auto', minHeight: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '100%', maxHeight: '100%', aspectRatio: '16 / 9' }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ───────────────────────────────────────────────
// Video block (single)
// ───────────────────────────────────────────────
function VideoBlock({ lesson }: { lesson: RhythmLesson }) {
  if (!lesson.videoId) {
    return (
      <Card style={{ background: B.pinkLight, border: `1px dashed ${B.pink}` }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          Video pendiente
        </div>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: B.dark }}>
          Este video será agregado pronto.
        </p>
      </Card>
    );
  }
  return (
    <VideoCard
      videoId={lesson.videoId}
      title={lesson.experientialTitle}
      subtitle={lesson.subtitle}
      badge={`${lesson.type} · ${lesson.estimatedTime}`}
    />
  );
}

// ───────────────────────────────────────────────
// Multi video block (vertical stack)
// ───────────────────────────────────────────────
function MultiVideoBlock({ lesson }: { lesson: RhythmLesson }) {
  const videos: RhythmVideo[] = lesson.videos ?? [];
  if (videos.length === 0) {
    return (
      <Card style={{ background: B.pinkLight, border: `1px dashed ${B.pink}` }}>
        <p style={{ margin: 0, fontSize: 13.5, color: B.dark }}>Videos pendientes de agregar.</p>
      </Card>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {videos.map((v, i) => (
        <VideoCard
          key={`${v.videoId}-${i}`}
          videoId={v.videoId}
          title={v.title}
          subtitle={lesson.subtitle}
          badge={`${v.label} · ${lesson.estimatedTime}`}
        />
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────
// Community block (no backend)
// ───────────────────────────────────────────────
function CommunityBlock({ lesson }: { lesson: RhythmLesson }) {
  const [file, setFile] = useState<File | null>(null);
  const [ready, setReady] = useState(false);
  const [skip, setSkip] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Card>
      <div style={{ fontSize: 11, fontWeight: 800, color: B.greenDark, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>
        Comunidad · {lesson.estimatedTime}
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 13.5, lineHeight: 1.6, color: B.dark }}>
        {lesson.description}
      </p>
      <p style={{ margin: '0 0 14px', fontSize: 12.5, lineHeight: 1.55, color: B.grayText }}>
        Este paso es <strong>opcional</strong>. En esta versión prototipo tu video no se sube realmente: solo lo dejamos listo para cuando activemos la comunidad.
      </p>

      {!skip && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              width: '100%',
              background: B.white,
              border: `1.5px dashed ${B.grayBorder}`,
              borderRadius: 12,
              padding: '14px 12px',
              fontWeight: 700,
              fontSize: 13,
              color: B.dark,
              cursor: 'pointer',
              marginBottom: 10,
            }}
          >
            {file ? `🎥 ${file.name}` : '📁 Selecciona un video de tu dispositivo'}
          </button>

          {file && !ready && (
            <Btn onClick={() => setReady(true)} fullWidth>Dejar listo para enviar</Btn>
          )}

          {ready && (
            <Card style={{ background: B.greenLight, border: `1.5px solid ${B.green}`, marginTop: 10 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: B.dark }}>
                ✓ Listo para enviar cuando activemos la comunidad.
              </div>
              <div style={{ fontSize: 11.5, color: B.grayText, marginTop: 4 }}>
                Guardado solo en tu dispositivo. No se sube nada por ahora.
              </div>
            </Card>
          )}

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setSkip(true)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 12.5, fontWeight: 700, color: B.grayText, textDecoration: 'underline',
              }}
            >
              Lo haré más adelante
            </button>
          </div>
        </>
      )}

      {skip && (
        <Card style={{ background: B.gray, border: `1px solid ${B.grayBorder}` }}>
          <div style={{ fontSize: 13, color: B.dark, fontWeight: 700 }}>
            Sin problema, este paso queda abierto para cuando quieras volver.
          </div>
        </Card>
      )}
    </Card>
  );
}

// ───────────────────────────────────────────────
// Closure block
// ───────────────────────────────────────────────
function ClosureBlock({ lesson }: { lesson: RhythmLesson }) {
  const [feeling, setFeeling] = useState<string | null>(null);
  const [hardest, setHardest] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const complete = feeling && hardest && readiness !== null;

  const finish = () => {
    setDone(true);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          'archipielago_rhythm_closure',
          JSON.stringify({ feeling, hardest, readiness, at: Date.now() }),
        );
      } catch {
        // localStorage no disponible
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <VideoBlock lesson={lesson} />

      <Card>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.greenDark, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>
          Lo que ya conquistaste en el Ritmo
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {RHYTHM_SUMMARY_CHIPS.map((chip) => (
            <span key={chip} style={{
              background: B.greenLight, color: B.dark, fontWeight: 700,
              fontSize: 12, padding: '5px 10px', borderRadius: 999,
              border: `1px solid ${B.grayBorder}`,
            }}>
              ✓ {chip}
            </span>
          ))}
        </div>
      </Card>

      <QuestionBlock
        question={RHYTHM_CLOSURE_QUESTIONS.feeling.question}
        options={RHYTHM_CLOSURE_QUESTIONS.feeling.options}
        value={feeling} onChange={setFeeling} disabled={done}
      />
      <QuestionBlock
        question={RHYTHM_CLOSURE_QUESTIONS.hardest.question}
        options={RHYTHM_CLOSURE_QUESTIONS.hardest.options}
        value={hardest} onChange={setHardest} disabled={done}
      />

      <Card>
        <div style={{ fontWeight: 800, fontSize: 13.5, color: B.dark, marginBottom: 10 }}>
          {RHYTHM_CLOSURE_QUESTIONS.readiness.question}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {RHYTHM_CLOSURE_QUESTIONS.readiness.labels.map((label, i) => {
            const value = i + 1;
            const active = readiness === value;
            return (
              <button
                key={value} type="button"
                onClick={() => !done && setReadiness(value)}
                style={{
                  flex: '1 1 90px',
                  background: active ? B.green : B.white,
                  color: active ? B.dark : B.grayText,
                  border: `1.5px solid ${active ? B.greenDark : B.grayBorder}`,
                  borderRadius: 12, padding: '8px 6px', fontWeight: 800, fontSize: 12,
                  cursor: done ? 'default' : 'pointer',
                }}
              >
                <div style={{ fontSize: 14 }}>{value}</div>
                <div style={{ fontSize: 10, marginTop: 2, opacity: 0.9 }}>{label}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {!done && (
        <Btn onClick={finish} fullWidth disabled={!complete}>
          {complete ? 'Cerrar isla y recibir premio' : 'Completa las 3 preguntas'}
        </Btn>
      )}

      {done && (
        <Card style={{ background: B.greenLight, border: `2px solid ${B.green}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 28 }}>🏆</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: B.greenDark, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                Isla completada
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: B.dark }}>
                Insignia: Guardián del Ritmo
              </div>
            </div>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 13.5, lineHeight: 1.6, color: B.dark }}>
            Ya no solo cambias acordes: ahora puedes sostener un rasgueo, acompañar canciones y sentir el pulso de tu música.
          </p>
          <div style={{ fontSize: 12, color: B.greenDark, fontWeight: 700 }}>
            Microvictoria desbloqueada: tu música ya tiene ritmo.
          </div>
        </Card>
      )}
    </div>
  );
}

function QuestionBlock({
  question, options, value, onChange, disabled,
}: {
  question: string; options: string[]; value: string | null;
  onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <Card>
      <div style={{ fontWeight: 800, fontSize: 13.5, color: B.dark, marginBottom: 10 }}>{question}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o} type="button"
              onClick={() => !disabled && onChange(o)}
              style={{
                background: active ? B.dark : B.white,
                color: active ? B.white : B.dark,
                border: `1.5px solid ${active ? B.dark : B.grayBorder}`,
                borderRadius: 999, padding: '7px 14px', fontWeight: 700, fontSize: 12.5,
                cursor: disabled ? 'default' : 'pointer',
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function PurposeRow({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 800, color, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: B.dark }}>{text}</div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Screen renderer
// ───────────────────────────────────────────────
export function RhythmLessonScreen({
  lessonId,
  onBackToIsland,
}: {
  lessonId: string;
  onBackToIsland: () => void;
}) {
  const lesson = findRhythmLesson(lessonId);

  if (!lesson) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BackBtn label="Isla del Ritmo" onClick={onBackToIsland} />
        <Card>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: B.dark, marginBottom: 8 }}>
            No encontramos esta lección
          </div>
          <p style={{ margin: '0 0 12px', color: B.grayText, fontSize: 13.5, lineHeight: 1.6 }}>
            Puede que aún no esté disponible o que el enlace haya cambiado.
          </p>
          <Btn onClick={onBackToIsland} fullWidth>Volver a Isla del Ritmo</Btn>
        </Card>
      </div>
    );
  }

  const total = RHYTHM_LESSONS.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Isla del Ritmo" onClick={onBackToIsland} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: '1.4px', textTransform: 'uppercase' }}>
          Lección {lesson.order} de {total} · {lesson.type} · {lesson.estimatedTime}
        </div>
        <MissionIntroHeader title={lesson.experientialTitle} subtitle={lesson.subtitle} />
      </div>

      <Card>
        <div style={{ display: 'grid', gap: 10, fontSize: 13, lineHeight: 1.6 }}>
          <PurposeRow label="Objetivo" text={lesson.objective} color={B.greenDark} />
          <PurposeRow label="Microvictoria" text={lesson.microVictory} color={B.pink} />
          <PurposeRow label="Sin prisa" text={lesson.antiFrustrationCopy} color={B.grayText} />
        </div>
      </Card>

      {lesson.kind === 'video' && <VideoBlock lesson={lesson} />}
      {lesson.kind === 'multiVideo' && <MultiVideoBlock lesson={lesson} />}
      {lesson.kind === 'community' && <CommunityBlock lesson={lesson} />}
      {lesson.kind === 'closure' && <ClosureBlock lesson={lesson} />}

      <Btn onClick={onBackToIsland} fullWidth variant="ghost">
        Volver a Isla del Ritmo
      </Btn>
    </div>
  );
}
