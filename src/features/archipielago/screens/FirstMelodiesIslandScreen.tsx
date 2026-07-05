import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";

const EXPERIENCES = [
  { icon: "🎸", text: "Despertarás tus manos con tu primer acorde: DO." },
  { icon: "🗺️", text: "Aprenderás a reconocer diagramas de acordes." },
  { icon: "✨", text: "Sumarás nuevos acordes: LAm y FA." },
  { icon: "🎶", text: "Practicarás tus primeras canciones guiadas." },
  { icon: "🏝️", text: "Cerrarás la isla mirando todo lo que ya lograste." },
];

const MILESTONES: { title: string; desc: string }[] = [
  { title: "Tu primer acorde: DO", desc: "Despierta tu mano izquierda y toca tu primer acorde." },
  { title: "Mapa visual del DO", desc: "Aprende a reconocer el acorde DO al verlo." },
  { title: "Dos nuevos amigos: LAm y FA", desc: "Suma dos acordes nuevos sin abrumarte." },
  { title: "Mapas visuales LAm y FA", desc: "Refuerza los acordes con apoyo visual." },
  { title: "Tu primera estrofa: Tren al Sur", desc: "Usa DO, LAm y FA para sentir música real." },
  { title: "Stay With Me en acordes", desc: "Consolida tus primeros acordes en una canción conocida." },
  { title: "Karaoke Stay With Me", desc: "Practica cambios de acordes con guía temporal." },
  { title: "Comparte tu primer logro", desc: "Podrás subir tu video de forma opcional para recibir feedback." },
  { title: "Dedos despiertos", desc: "Entrena coordinación y digitación desde cero." },
  { title: "Lo que ya conquistaste", desc: "Revisa acordes, conceptos y logros aprendidos." },
  { title: "Tu mapa de Primeras Melodías", desc: "Visualiza el recorrido de esta isla." },
  { title: "¿Cómo viviste esta isla?", desc: "Cierra con una medición breve de emoción y experiencia." },
];

export function FirstMelodiesIslandScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />

      <MissionIntroHeader
        title="Isla de Primeras Melodías"
        subtitle="Ahora tu viaje empieza a sonar."
      />

      {/* Hero */}
      <Card
        style={{
          background: `linear-gradient(135deg, ${B.greenLight} 0%, ${B.white} 100%)`,
          border: `1px solid ${B.grayBorder}`,
        }}
      >
        <div style={{ fontSize: 30, marginBottom: 8 }}>🏝️ 🎶 ⛵</div>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: B.dark }}>
          Llegaste a la isla donde tus primeros acordes comienzan a convertirse en música real.
          Aquí no buscamos perfección: buscamos que tus manos despierten, que reconozcas tus
          primeros acordes y que vivas la emoción de acompañar tus primeras canciones.
        </p>
      </Card>

      {/* Qué vivirás */}
      <Card>
        <h2 style={{ margin: "0 0 14px", fontSize: 18, fontFamily: "Space Grotesk, sans-serif", color: B.dark }}>
          Qué vivirás en esta isla
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {EXPERIENCES.map((e, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "10px 12px",
                background: B.gray,
                borderRadius: 14,
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1.2 }}>{e.icon}</span>
              <span style={{ fontSize: 14.5, lineHeight: 1.5, color: B.dark }}>{e.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Ruta de la isla */}
      <Card>
        <h2 style={{ margin: "0 0 4px", fontSize: 18, fontFamily: "Space Grotesk, sans-serif", color: B.dark }}>
          Ruta de la isla
        </h2>
        <p style={{ margin: "0 0 14px", fontSize: 13, color: B.grayText }}>
          12 pasos pequeños. Uno a la vez.
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {MILESTONES.map((m, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 12,
                padding: 12,
                border: `1px solid ${B.grayBorder}`,
                borderRadius: 14,
                background: B.white,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: B.greenLight,
                  color: B.dark,
                  fontWeight: 800,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                {i + 1}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: B.dark }}>{m.title}</div>
                <div style={{ fontSize: 13, color: B.grayText, lineHeight: 1.45 }}>{m.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {/* Promesa */}
      <Card style={{ background: B.pinkLight, border: `1px solid ${B.grayBorder}` }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 18, fontFamily: "Space Grotesk, sans-serif", color: B.dark }}>
          La promesa de esta isla
        </h2>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: B.dark }}>
          Cuando termines esta isla, no solo conocerás acordes: habrás vivido tus primeras
          canciones. Tal vez no suenen perfectas, pero ya serán tuyas.
        </p>
      </Card>

      {/* Anti-frustración */}
      <Card style={{ background: B.greenLight, border: `1px solid ${B.grayBorder}` }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 18, fontFamily: "Space Grotesk, sans-serif", color: B.dark }}>
          Recuerda
        </h2>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: B.dark }}>
          Tus dedos no nacieron sabiendo. En esta isla no venimos a demostrar talento, venimos a
          construir confianza musical paso a paso.
        </p>
      </Card>

      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 8px" }}>
        <Btn variant="primary" onClick={onBack}>
          Volver al Puerto de Inicio
        </Btn>
      </div>
    </div>
  );
}
