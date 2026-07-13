/**
 * TEMPORAL — se elimina inmediatamente tras ejecutarse una sola vez.
 * Lee NOTIFICATIONS_CRON_SECRET desde process.env (no lo devuelve ni lo loguea)
 * y programa el cron via la función SECURITY DEFINER install_notifications_cron.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/_install-cron")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const host = request.headers.get("host") ?? "";
        if (!host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
          return new Response("Forbidden", { status: 403 });
        }
        const secret = process.env.NOTIFICATIONS_CRON_SECRET;
        if (!secret) return new Response("missing_env", { status: 500 });

        const url =
          "https://project--77ab2421-fb34-4e8c-8b10-45bd1af97135.lovable.app/api/public/hooks/notifications-scheduler";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.rpc("install_notifications_cron", {
          _url: url,
          _bearer: secret,
        });
        if (error) {
          return Response.json({ ok: false, code: error.code ?? null }, { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});
