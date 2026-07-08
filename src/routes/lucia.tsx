import { createFileRoute } from "@tanstack/react-router";
import { ParentJourneyApp } from "@/features/parent-journey/ParentJourneyApp";

export const Route = createFileRoute("/lucia")({
  head: () => ({
    meta: [
      { title: "Viaje Musical de Lucía · Ruta piloto | SoundKeleles" },
      {
        name: "description",
        content:
          "Ruta piloto para acompañar el aprendizaje de ukelele de Lucía junto a su apoderada Carolina y su profesor Álvaro.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ParentJourneyApp,
});
