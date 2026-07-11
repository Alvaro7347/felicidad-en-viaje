-- Reparación segura de profiles.experience_mode.
-- Nunca borra filas de user_onboarding, parent_journeys ni lesson_progress.

-- 1) Cuentas con solo user_onboarding → self_learning.
UPDATE public.profiles p
SET experience_mode = 'self_learning',
    updated_at = now()
WHERE EXISTS (SELECT 1 FROM public.user_onboarding uo WHERE uo.user_id = p.id)
  AND NOT EXISTS (SELECT 1 FROM public.parent_journeys pj WHERE pj.user_id = p.id)
  AND (p.experience_mode IS DISTINCT FROM 'self_learning');

-- 2) Cuentas con solo parent_journeys → accompanied_learning.
UPDATE public.profiles p
SET experience_mode = 'accompanied_learning',
    updated_at = now()
WHERE EXISTS (SELECT 1 FROM public.parent_journeys pj WHERE pj.user_id = p.id)
  AND NOT EXISTS (SELECT 1 FROM public.user_onboarding uo WHERE uo.user_id = p.id)
  AND (p.experience_mode IS DISTINCT FROM 'accompanied_learning');

-- 3) Cuentas sin ningún onboarding real → limpiar experience_mode fantasma.
UPDATE public.profiles p
SET experience_mode = NULL,
    updated_at = now()
WHERE p.experience_mode IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.user_onboarding uo WHERE uo.user_id = p.id)
  AND NOT EXISTS (SELECT 1 FROM public.parent_journeys pj WHERE pj.user_id = p.id);

-- 4) Cuentas con AMBAS tablas: no se modifican (revisión manual).