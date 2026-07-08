CREATE TABLE public.parent_journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL DEFAULT 'Lucía',
  parent_name text NOT NULL DEFAULT 'Carolina',
  teacher_name text NOT NULL DEFAULT 'Álvaro',
  plan_name text NOT NULL DEFAULT 'Plan Semanal Presencial',
  status text NOT NULL DEFAULT 'pilot',
  onboarding_answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.parent_journeys TO authenticated;
GRANT ALL ON public.parent_journeys TO service_role;

ALTER TABLE public.parent_journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY pj_select_own ON public.parent_journeys
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY pj_insert_own ON public.parent_journeys
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY pj_update_own ON public.parent_journeys
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_parent_journeys_updated_at
  BEFORE UPDATE ON public.parent_journeys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();