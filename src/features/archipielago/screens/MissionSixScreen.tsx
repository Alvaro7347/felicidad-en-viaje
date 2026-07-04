import { B } from "../data/brand";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";

export function MissionSixScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Quiz Partes del Ukelele"
        subtitle="Pondrás a prueba lo que aprendiste sobre tu compañero musical."
      />

      <Card>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: B.dark }}>
          Contenido en preparación. En esta clase responderás un quiz breve para
          reconocer las partes principales del ukelele antes de seguir avanzando.
        </p>
      </Card>

      <Btn onClick={onBack}>Volver al Puerto de Inicio</Btn>
    </div>
  );
}
