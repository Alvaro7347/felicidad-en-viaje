import { createFileRoute } from "@tanstack/react-router";
import { ArchipelagoApp } from "@/components/ArchipelagoApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Archipiélago de la Felicidad | SoundKeleles" },
      {
        name: "description",
        content:
          "Toca la felicidad. Aprender ukelele puede sentirse simple, humano y emocionante. Un viaje musical por islas, misiones y pequeñas victorias.",
      },
      { property: "og:title", content: "Archipiélago de la Felicidad | SoundKeleles" },
      {
        property: "og:description",
        content:
          "Un viaje musical para aprender ukelele con pequeñas victorias, sin presión y a tu propio ritmo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArchipelagoApp,
});
