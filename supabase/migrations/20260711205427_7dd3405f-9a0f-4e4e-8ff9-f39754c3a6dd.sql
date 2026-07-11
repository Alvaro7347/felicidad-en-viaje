-- 1) experience_mode en profiles (nullable, valores permitidos)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS experience_mode TEXT
  CHECK (experience_mode IN ('self_learning','accompanied_learning'));

-- 2) Unicidad de parent_journeys por usuario (una cuenta = un viaje)
-- Consolidar posibles duplicados antes de crear el índice único.
WITH ranked AS (
  SELECT id, user_id,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC NULLS LAST, created_at DESC) AS rn
  FROM public.parent_journeys
)
DELETE FROM public.parent_journeys pj
USING ranked r
WHERE pj.id = r.id AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS parent_journeys_user_id_unique
  ON public.parent_journeys(user_id);
