import { useState } from "react";
import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";
import { LessonVideoCard, PurposeRow } from "../components/LessonVideoCard";
import {
  findChordsLesson,
  CHORDS_LESSONS,
  CHORDS_SUMMARY_CHIPS,
  CHORDS_CLOSURE_QUESTIONS,
  type ChordsLesson,
  type ChordsImageAsset,
} from "../data/chordsLessons";

const BACK_LABEL = "Isla de los Acordes";

function VideoBlock({ lesson }: { lesson: ChordsLesson }) {
  if (!lesson.videoId) {
    return (
      <Card style={{ background: B.pinkLight, border: `1px dashed ${B.pink}` }}>
        <p style={{ margin: 0, fontSize: 13.5, color: B.dark }}>Video pendiente de agregar.</p>
      </Card>
    );
  }
  return (
    <LessonVideoCard
      videoId={lesson.videoId}
      title={lesson.experientialTitle}
      subtitle={lesson.subtitle}
      badge={`${lesson.type} · ${lesson.estimatedTime}`}
    />
  );
}

function ImageAssetCard({ asset, placeholder }: { asset: ChordsImageAsset; placeholder: string }) {
  const [zoom, setZoom] = useState(false);
  const hasImage = Boolean(asset.src);

  return (
    <>
      <Card style={{ padding: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.greenDark, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          Acorde · {asset.label}
        </div>
        {hasImage ? (
          <button
            type="button" onClick={() => setZoom(true)}
            aria-label={`Ampliar acorde ${asset.label}`}
            style={{ display: 'block', width: '100%', padding: 0, border: 'none', background: 'transparent', cursor: 'zoom-in', borderRadius: 12, overflow: 'hidden' }}
          >
            <img src={asset.src} alt={`Acorde ${asset.label}`} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12 }} />
          </button>
        ) : (
          <div style={{
            background: B.gray, border: `1.5px dashed ${B.grayBorder}`, borderRadius: 12,
            padding: '28px 14px', textAlign: 'center', color: B.grayText,
            fontSize: 13, fontWeight: 700, lineHeight: 1.5,
          }}>
            🖼️ {placeholder}
            <div style={{ fontSize: 11, fontWeight: 600, marginTop: 6, opacity: 0.85 }}>({asset.label})</div>
          </div>
        )}
      </Card>

      {zoom && hasImage && (
        <div
          role="dialog" aria-modal="true" aria-label={`Acorde ${asset.label}`}
          onClick={() => setZoom(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 1000 }}
        >
          <img src={asset.src} alt={`Acorde ${asset.label}`} onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '100%', maxHeight: '90dvh', borderRadius: 12, background: B.white, padding: 8 }} />
        </div>
      )}
    </>
  );
}

function DiagramBlock({ lesson }: { lesson: ChordsLesson }) {
  const assets = lesson.diagramAssets ?? [];
  const placeholder = lesson.diagramPlaceholder ?? 'Imágenes de acordes pendientes de adjuntar';
  if (assets.length === 0) {
    return (
      <Card style={{ background: B.pinkLight, border: `1px dashed ${B.pink}` }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.pink, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
          Diagrama pendiente
        </div>
        <p style={{ margin: 0, fontSize: 13.5, color: B.dark }}>{placeholder}</p>
      </Card>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {assets.map((a, i) => (
        <ImageAssetCard key={`${a.label}-${i}`} asset={a} placeholder={placeholder} />
      ))}
    </div>
  );
}

function QuestionBlock({ question, options, value, onChange, disabled }: {
  question: string; options: string[]; value: string | null; onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <Card>
      <div style={{ fontWeight: 800, fontSize: 13.5, color: B.dark, marginBottom: 10 }}>{question}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map((o) => {
          const active = value === o;
          return (
            <button key={o} type="button" onClick={() => !disabled && onChange(o)}
              style={{
                background: active ? B.dark : B.white, color: active ? B.white : B.dark,
                border: `1.5px solid ${active ? B.dark : B.grayBorder}`,
                borderRadius: 999, padding: '7px 14px', fontWeight: 700, fontSize: 12.5,
                cursor: disabled ? 'default' : 'pointer',
              }}>{o}</button>
          );
        })}
      </div>
    </Card>
  );
}

function ClosureBlock({ lesson }: { lesson: ChordsLesson }) {
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
          'archipielago_chords_closure',
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
          Lo que ya conquistaste en la Isla de los Acordes
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CHORDS_SUMMARY_CHIPS.map((chip) => (
            <span key={chip} style={{
              background: B.greenLight, color: B.dark, fontWeight: 700,
              fontSize: 12, padding: '5px 10px', borderRadius: 999,
              border: `1px solid ${B.grayBorder}`,
            }}>✓ {chip}</span>
          ))}
        </div>
      </Card>

      <QuestionBlock
        question={CHORDS_CLOSURE_QUESTIONS.feeling.question}
        options={CHORDS_CLOSURE_QUESTIONS.feeling.options}
        value={feeling} onChange={setFeeling} disabled={done}
      />
      <QuestionBlock
        question={CHORDS_CLOSURE_QUESTIONS.hardest.question}
        options={CHORDS_CLOSURE_QUESTIONS.hardest.options}
        value={hardest} onChange={setHardest} disabled={done}
      />

      <Card>
        <div style={{ fontWeight: 800, fontSize: 13.5, color: B.dark, marginBottom: 10 }}>
          {CHORDS_CLOSURE_QUESTIONS.readiness.question}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CHORDS_CLOSURE_QUESTIONS.readiness.labels.map((label, i) => {
            const value = i + 1;
            const active = readiness === value;
            return (
              <button key={value} type="button" onClick={() => !done && setReadiness(value)}
                style={{
                  flex: '1 1 90px', background: active ? B.green : B.white,
                  color: active ? B.dark : B.grayText,
                  border: `1.5px solid ${active ? B.greenDark : B.grayBorder}`,
                  borderRadius: 12, padding: '8px 6px', fontWeight: 800, fontSize: 12,
                  cursor: done ? 'default' : 'pointer',
                }}>
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
                Insignia: Guardián de los Acordes
              </div>
            </div>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 13.5, lineHeight: 1.6, color: B.dark }}>
            Tu mapa de acordes creció: familias mayores, menores, sostenidos, séptimas, cejillo y transporte.
          </p>
          <div style={{ fontSize: 12, color: B.greenDark, fontWeight: 700 }}>
            Microvictoria desbloqueada: empezaste a hablar el idioma de la armonía.
          </div>
        </Card>
      )}
    </div>
  );
}

export function ChordsLessonScreen({
  lessonId,
  onBackToIsland,
}: {
  lessonId: string;
  onBackToIsland: () => void;
}) {
  const lesson = findChordsLesson(lessonId);

  if (!lesson) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BackBtn label={BACK_LABEL} onClick={onBackToIsland} />
        <Card>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: B.dark, marginBottom: 8 }}>
            No encontramos esta lección
          </div>
          <p style={{ margin: '0 0 12px', color: B.grayText, fontSize: 13.5, lineHeight: 1.6 }}>
            Puede que aún no esté disponible o que el enlace haya cambiado.
          </p>
          <Btn onClick={onBackToIsland} fullWidth>Volver a {BACK_LABEL}</Btn>
        </Card>
      </div>
    );
  }

  const total = CHORDS_LESSONS.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label={BACK_LABEL} onClick={onBackToIsland} />

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
      {lesson.kind === 'diagram' && <DiagramBlock lesson={lesson} />}
      {lesson.kind === 'closure' && <ClosureBlock lesson={lesson} />}

      <Btn onClick={onBackToIsland} fullWidth variant="ghost">
        Volver a {BACK_LABEL}
      </Btn>
    </div>
  );
}
