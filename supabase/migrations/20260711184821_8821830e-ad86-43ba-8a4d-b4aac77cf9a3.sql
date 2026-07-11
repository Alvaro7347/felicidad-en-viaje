DROP INDEX IF EXISTS public.idx_parent_journeys_student_id;
ALTER TABLE public.parent_journeys DROP COLUMN IF EXISTS student_id;
DROP TABLE IF EXISTS public.students;