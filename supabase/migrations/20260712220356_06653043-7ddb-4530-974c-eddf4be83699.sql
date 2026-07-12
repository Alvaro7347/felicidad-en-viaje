DROP INDEX IF EXISTS public.lesson_discussion_posts_one_active_per_user_lesson;

CREATE UNIQUE INDEX lesson_discussion_posts_one_active_per_user_lesson
  ON public.lesson_discussion_posts(user_id, lesson_id)
  WHERE deleted_at IS NULL AND is_hidden = false;