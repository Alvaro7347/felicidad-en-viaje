/**
 * ARCHIVO TEMPORAL — instalación de una sola pasada.
 *
 * Lee NOTIFICATIONS_CRON_SECRET desde process.env (nunca sale de este servidor)
 * y reprograma el job de pg_cron con Authorization: Bearer <secret>.
 *
 * Se elimina inmediatamente después de ejecutarse. NO debe quedar publicado.
 * Restringido a llamadas desde localhost para reducir superficie mientras existe.
 */

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/install-notifications-cron")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Restringir a llamadas locales del sandbox.
        const host = request.headers.get("host") ?? "";
        if (!host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
          return new Response("Forbidden", { status: 403 });
        }

        const secret = process.env.NOTIFICATIONS_CRON_SECRET;
        if (!secret) return new Response("Missing NOTIFICATIONS_CRON_SECRET", { status: 500 });

        const url =
          "https://project--77ab2421-fb34-4e8c-8b10-45bd1af97135.lovable.app/api/public/hooks/notifications-scheduler";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // 1. Desprogramar cualquier versión previa (silencioso si no existe).
        // 2. Programar de nuevo enviando Authorization: Bearer <NOTIFICATIONS_CRON_SECRET>.
        //    Los headers se serializan en un jsonb; el valor vive únicamente en
        //    la fila cron.job del catálogo interno del backend.
        const bearer = `Bearer ${secret}`;
        const headers = JSON.stringify({
          "Content-Type": "application/json",
          Authorization: bearer,
        });

        const sql = `
          do $$
          begin
            perform cron.unschedule('notifications-scheduler-hourly');
          exception when others then
            null;
          end
          $$;

          select cron.schedule(
            'notifications-scheduler-hourly',
            '0 * * * *',
            $cron$
              select net.http_post(
                url  := '${url}',
                headers := '${headers}'::jsonb,
                body := '{}'::jsonb
              ) as request_id;
            $cron$
          );
        `;

        // supabaseAdmin no expone SQL crudo; usamos la conexión via SQL RPC.
        // El proyecto tiene `supabase--insert` (server-side); aquí replicamos
        // via la API de Postgres a través del edge-side admin client.
        const { error } = await (supabaseAdmin as unknown as {
          rpc: (fn: string, args: Record<string, unknown>) => Promise<{ error: unknown }>;
        }).rpc("exec_sql_admin", { sql });

        if (error) {
          return Response.json(
            { ok: false, note: "exec_sql_admin no disponible; instalar via supabase--insert" },
            { status: 200 },
          );
        }
        return Response.json({ ok: true });
      },
    },
  },
});
