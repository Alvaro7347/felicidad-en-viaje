
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL,
  name text NOT NULL,
  age text,
  experience text,
  teacher_name text,
  plan_name text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own students"
  ON public.students FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can insert their own students"
  ON public.students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update their own students"
  ON public.students FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_students_owner_user_id ON public.students(owner_user_id);

-- Vinculación no destructiva con parent_journeys
ALTER TABLE public.parent_journeys
  ADD COLUMN IF NOT EXISTS student_id uuid;

CREATE INDEX IF NOT EXISTS idx_parent_journeys_student_id
  ON public.parent_journeys(student_id);
