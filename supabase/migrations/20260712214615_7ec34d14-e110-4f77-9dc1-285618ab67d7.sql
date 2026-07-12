
DROP POLICY IF EXISTS "posts_update_author_soft_delete" ON public.lesson_discussion_posts;
DROP POLICY IF EXISTS "posts_update_team_hide" ON public.lesson_discussion_posts;

CREATE POLICY "posts_update_author_or_team"
  ON public.lesson_discussion_posts FOR UPDATE TO authenticated
  USING (
    (user_id = auth.uid() AND deleted_at IS NULL)
    OR public.is_soundkeleles_team()
  )
  WITH CHECK (
    user_id = auth.uid()
    OR public.is_soundkeleles_team()
  );
