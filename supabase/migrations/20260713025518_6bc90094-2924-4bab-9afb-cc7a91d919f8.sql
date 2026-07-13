DROP INDEX IF EXISTS public.notification_deliveries_sent_unique_idx;
ALTER TABLE public.notification_deliveries
  ADD CONSTRAINT notification_deliveries_logical_key_unique
  UNIQUE (user_id, notification_type, period_key);