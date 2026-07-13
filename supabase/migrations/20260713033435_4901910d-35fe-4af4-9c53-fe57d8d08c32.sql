
create or replace function public.install_notifications_cron(_url text, _bearer text)
returns void
language plpgsql
security definer
set search_path = public, cron, net
as $$
declare
  headers_json jsonb;
  cmd text;
begin
  -- Sólo se permite ejecutar como service_role (llamada desde supabaseAdmin server-side).
  if current_setting('request.jwt.claims', true) is not null
     and coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'role'), '') <> 'service_role'
  then
    raise exception 'install_notifications_cron: forbidden';
  end if;

  headers_json := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || _bearer
  );

  begin
    perform cron.unschedule('notifications-scheduler-hourly');
  exception when others then
    null;
  end;

  cmd := format(
    'select net.http_post(url := %L, headers := %L::jsonb, body := ''{}''::jsonb) as request_id;',
    _url,
    headers_json::text
  );

  perform cron.schedule('notifications-scheduler-hourly', '0 * * * *', cmd);
end;
$$;

revoke all on function public.install_notifications_cron(text, text) from public, anon, authenticated;
grant execute on function public.install_notifications_cron(text, text) to service_role;
