// Ruta paralela de moderación. SSR desactivado explícitamente porque la
// sesión Supabase vive en el navegador; el server no puede resolverla y
// provocaría parpadeo / hydration mismatch. React Query se hereda del
// QueryClientProvider de __root.tsx.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useIsCurrentUserTeam, type TeamAccessStatus } from "@/features/moderation/hooks/useIsCurrentUserTeam";
import { ModerationScreen } from "@/features/moderation/components/ModerationScreen";

export const Route = createFileRoute("/moderacion/comunidad")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Moderación de comunidad · SoundKeleles" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ModerationCommunityRoute,
});

function ModerationCommunityRoute() {
  const { status, retry } = useIsCurrentUserTeam();
  return <AccessGate status={status} onRetry={retry} />;
}

function AccessGate({ status, onRetry }: { status: TeamAccessStatus; onRetry: () => void }) {
  if (status === "team") return <ModerationScreen />;

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Verificando acceso…</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <CenteredMessage
        title="Inicia sesión desde la aplicación"
        description="Esta sección requiere una cuenta autenticada."
        action={
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Ir a la aplicación
          </Link>
        }
      />
    );
  }

  if (status === "error") {
    return (
      <CenteredMessage
        title="No pudimos verificar tu acceso"
        description="Es posible que se trate de un problema temporal de conexión."
        action={
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Reintentar
          </button>
        }
      />
    );
  }

  // not_team
  return (
    <CenteredMessage
      title="Esta sección no está disponible"
      description="Si crees que deberías tener acceso, contacta al equipo de SoundKeleles."
      action={
        <Link
          to="/"
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Volver al inicio
        </Link>
      }
    />
  );
}

function CenteredMessage({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-6">{action}</div>
      </div>
    </div>
  );
}
