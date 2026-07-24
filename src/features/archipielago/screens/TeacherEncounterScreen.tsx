import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { LessonCompletionBox } from "../components/LessonCompletionBox";

// TODO: integrar aquí el sistema de Agenda de Citas de Google Calendar.
// Por ahora la función queda preparada como punto de extensión.
function handleScheduleMeeting() {
  // eslint-disable-next-line no-console
  console.log("[TeacherEncounter] handleScheduleMeeting: integración de Google Calendar pendiente.");
}

function StepCard({
  emoji,
  title,
  body,
}: {
  emoji: string;
  title: string;
  body: string;
}) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 28, lineHeight: 1 }}>{emoji}</div>
      <div style={{
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: 800,
        fontSize: 16,
        color: B.dark,
      }}>
        {title}
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "#555" }}>
        {body}
      </div>
    </Card>
  );
}

function TimelineStep({
  index,
  text,
  isLast,
}: {
  index: number;
  text: string;
  isLast?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 999,
          background: B.green, color: B.dark,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 14,
        }}>
          {index}
        </div>
        {!isLast && (
          <div style={{ width: 2, flex: 1, minHeight: 26, background: B.grayBorder, marginTop: 4 }} />
        )}
      </div>
      <div style={{
        paddingTop: 6, paddingBottom: isLast ? 0 : 18,
        fontSize: 14, lineHeight: 1.55, color: B.dark,
      }}>
        {text}
      </div>
    </div>
  );
}

export function TeacherEncounterScreen({
  onBackToIsland,
}: {
  onBackToIsland: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <BackBtn label="Isla del Pulso" onClick={onBackToIsland} />

      {/* Encabezado — hito celebratorio */}
      <Card style={{
        background: `linear-gradient(160deg, ${B.greenLight} 0%, ${B.white} 60%, ${B.pinkLight} 100%)`,
        border: `1.5px solid ${B.green}`,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: B.pink,
          letterSpacing: "1.4px", textTransform: "uppercase",
        }}>
          Hito desbloqueado
        </div>
        <h1 style={{
          margin: 0,
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(26px, 6vw, 32px)",
          lineHeight: 1.15,
          letterSpacing: "-0.015em",
          color: B.dark,
        }}>
          🌺 Encuentro con tu profesor
        </h1>
        <div style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 700, fontSize: 16, color: B.greenDark,
        }}>
          ¡Lo lograste!
        </div>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: B.dark, maxWidth: 560 }}>
          Completaste la Isla del Pulso y ahora llegó el momento de conocernos.
        </p>
      </Card>

      {/* Sección 1 — ¿Qué ocurrirá? */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: B.greenDark,
          letterSpacing: "1.2px", textTransform: "uppercase",
        }}>
          ¿Qué ocurrirá en este encuentro?
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}>
          <StepCard
            emoji="🎵"
            title="Tocaremos juntos"
            body="Podrás mostrarme cómo vas y tocar algunas canciones conmigo."
          />
          <StepCard
            emoji="💬"
            title="Resolveremos tus dudas"
            body="Conversaremos sobre todo aquello que todavía te cuesta para ayudarte a avanzar con mayor confianza."
          />
          <StepCard
            emoji="🚀"
            title="Prepararemos tu siguiente etapa"
            body="Terminaremos el encuentro con un plan claro para continuar disfrutando del ukelele."
          />
        </div>
      </section>

      {/* Sección 2 — ¿Cómo funciona? */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: B.greenDark,
          letterSpacing: "1.2px", textTransform: "uppercase",
        }}>
          ¿Cómo funciona?
        </div>
        <Card>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <TimelineStep index={1} text="Elige un horario." />
            <TimelineStep index={2} text="Recibirás una invitación por correo." />
            <TimelineStep index={3} text="Nos conectaremos mediante Google Meet." />
            <TimelineStep index={4} text="Seguimos viajando juntos." isLast />
          </div>
        </Card>
      </section>

      {/* Sección 3 — Mensaje del profesor */}
      <Card style={{
        background: B.pinkLight,
        border: `1.5px solid ${B.pink}`,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: B.pink,
          letterSpacing: "1.2px", textTransform: "uppercase",
        }}>
          Un mensaje para ti
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.7, color: B.dark, whiteSpace: "pre-line" }}>
          {`Hola.

Si llegaste hasta aquí quiero felicitarte.

Significa que no abandonaste cuando aparecieron las primeras dificultades.

Ahora quiero conocerte, escuchar cómo ha sido tu experiencia y ayudarte personalmente a seguir disfrutando del ukelele.

Estoy muy feliz de que formes parte de esta comunidad.

Nos vemos muy pronto.`}
        </div>
        <div style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800, fontSize: 15, color: B.dark, marginTop: 4,
        }}>
          — Álvaro
        </div>
      </Card>

      {/* Botón principal */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={handleScheduleMeeting} fullWidth>
          Elegir mi horario
        </Btn>
        <div style={{ fontSize: 12, color: B.grayText, textAlign: "center" }}>
          Muy pronto podrás reservar tu horario directamente desde aquí.
        </div>
      </div>

      {/* Progreso — se mantiene el sistema existente */}
      <LessonCompletionBox
        lessonId="p11"
        islandId="pulse"
        onCompleted={onBackToIsland}
      />
    </div>
  );
}
