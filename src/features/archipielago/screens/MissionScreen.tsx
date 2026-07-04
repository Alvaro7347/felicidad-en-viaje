import { B } from "../data/brand";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";

export function MissionScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Partes del Ukelele"
        subtitle="Antes de tocar, conocerás las partes de tu compañero musical."
      />
      <Card>
        <p style={{ margin: 0, lineHeight: 1.6, color: B.grayText, fontSize: 14 }}>
          Contenido en preparación. En esta clase conocerás las partes principales del ukelele,
          para que puedas entender mejor tu instrumento antes de seguir avanzando.
        </p>
      </Card>
    </div>
  );
}
