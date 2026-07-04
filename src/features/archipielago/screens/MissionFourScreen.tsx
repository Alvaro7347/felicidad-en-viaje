import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";

export function MissionFourScreen({ onBack }: { onBack: () => void; onNext?: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Historia del Ukelele"
        subtitle="Antes de tocar, conocerás el viaje de este pequeño instrumento."
      />
      <Card>
        <p style={{ margin: 0, color: '#666', lineHeight: 1.7, fontSize: 13 }}>
          Contenido en preparación. En esta clase conocerás el origen del ukelele, por qué transmite alegría y cómo llegó a convertirse en un instrumento tan cercano para comenzar a tocar música.
        </p>
      </Card>
    </div>
  );
}
