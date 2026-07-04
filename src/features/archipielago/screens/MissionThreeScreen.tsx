import { B } from "../data/brand";
import { Card } from "../components/Card";
import { BackBtn } from "../components/BackBtn";
import { MissionIntroHeader } from "../components/MissionIntroHeader";

export function MissionThreeScreen({ onBack }: { onBack: () => void; onNext?: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackBtn label="Puerto de Inicio" onClick={onBack} />
      <MissionIntroHeader
        title="Qué es el Archipiélago"
        subtitle="Aquí explicaremos cómo funciona tu viaje musical."
      />
      <Card>
        <p style={{ margin: 0, color: B.dark, lineHeight: 1.7, fontSize: 13 }}>
          Contenido en preparación. En esta clase explicaremos cómo navegar el Archipiélago, qué son las misiones, cómo avanzar y cómo recibir acompañamiento.
        </p>
      </Card>
    </div>
  );
}
