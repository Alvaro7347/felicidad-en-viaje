
DROP POLICY IF EXISTS "posts_update_author_or_team" ON public.lesson_discussion_posts;

CREATE POLICY "posts_update_team_only"
  ON public.lesson_discussion_posts FOR UPDATE TO authenticated
  USING (public.is_soundkeleles_team())
  WITH CHECK (public.is_soundkeleles_team());

CREATE OR REPLACE FUNCTION public.soft_delete_own_post(_post_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  affected int;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  UPDATE public.lesson_discussion_posts
    SET deleted_at = now()
    WHERE id = _post_id
      AND user_id = auth.uid()
      AND deleted_at IS NULL;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected = 0 THEN
    RAISE EXCEPTION 'Post not found, not owned, or already deleted';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.soft_delete_own_post(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.soft_delete_own_post(uuid) TO authenticated;

-- guard_post_update ya prohíbe modificar deleted_at cuando el ejecutor es equipo
-- y prohíbe cambiar is_hidden cuando el ejecutor no es equipo. La función
-- soft_delete_own_post ejecuta como definidor (postgres), por lo que
-- is_soundkeleles_team() dentro del trigger evalúa a FALSE y aplica la rama
-- de autor: OLD.deleted_at IS NULL y NEW.deleted_at IS NOT NULL → permitido.
