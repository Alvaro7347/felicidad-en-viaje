
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.guard_post_update() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.guard_reply_update() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_post_author_display_name() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_soundkeleles_team() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reaction_post_visible(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.soft_delete_own_post(uuid) FROM anon, PUBLIC;
DROP TABLE IF EXISTS public._rls_test_log;
