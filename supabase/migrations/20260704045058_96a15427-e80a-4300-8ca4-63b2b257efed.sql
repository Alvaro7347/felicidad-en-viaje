CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  guide_name TEXT NOT NULL,
  guide_role TEXT,
  stage_id TEXT NOT NULL,
  stage_title TEXT NOT NULL,
  mission_id TEXT NOT NULL,
  mission_title TEXT NOT NULL,
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

GRANT INSERT ON public.support_messages TO anon;
GRANT INSERT ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert support messages"
  ON public.support_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);