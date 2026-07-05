import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";
import { LessonVideoCard, PurposeRow } from "../components/LessonVideoCard";
import { findSongsLesson, SONGS_LESSONS } from "../data/songsLessons";

const BACK_LABEL = "Isla de las Canciones";

export function SongsLessonScreen({
  lessonId,
  onBackToIsland,
}: {
  lessonId: string;
  onBackToIsland: () => void;
}) {
  const lesson = findSongsLesson(lessonId);

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

  const total = SONGS_LESSONS.length;

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

      <LessonVideoCard
        videoId={lesson.videoId}
        title={lesson.experientialTitle}
        subtitle={lesson.subtitle}
        badge={`${lesson.type} · ${lesson.estimatedTime}`}
      />

      <Btn onClick={onBackToIsland} fullWidth variant="ghost">
        Volver a {BACK_LABEL}
      </Btn>
    </div>
  );
}
