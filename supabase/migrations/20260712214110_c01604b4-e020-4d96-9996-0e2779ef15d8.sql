
-- =========================================================
-- Commit 1 — Comunidad MVP1: preguntas y comentarios de clase
-- =========================================================

-- ---------- Roles ----------
CREATE TYPE public.app_role AS ENUM ('soundkeleles_team');

CREATE TABLE public.user_roles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL    ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_select_self"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

CREATE OR REPLACE FUNCTION public.is_soundkeleles_team()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'soundkeleles_team'::public.app_role);
$$;

REVOKE ALL ON FUNCTION public.is_soundkeleles_team() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_soundkeleles_team() TO authenticated, service_role;


-- ---------- Posts ----------
CREATE TABLE public.lesson_discussion_posts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id           text NOT NULL,
  post_type           text NOT NULL CHECK (post_type IN ('question','comment')),
  content             text NOT NULL,
  author_display_name text NOT NULL,
  is_hidden           boolean NOT NULL DEFAULT false,
  deleted_at          timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT posts_lesson_id_valid CHECK (lesson_id IN (
    'n1','n2','n3','n4','n5','n6','n7','n8','n9',
    'm1','m2','m3','m4','m5','m6','m7','m8','m9','m10',
    'p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11'
  )),
  CONSTRAINT posts_content_len CHECK (
    char_length(btrim(content)) BETWEEN 3 AND 1000
  )
);

CREATE UNIQUE INDEX lesson_discussion_posts_one_active_per_user_lesson
  ON public.lesson_discussion_posts (user_id, lesson_id)
  WHERE deleted_at IS NULL;

CREATE INDEX lesson_discussion_posts_lesson_recent
  ON public.lesson_discussion_posts (lesson_id, created_at DESC)
  WHERE deleted_at IS NULL AND is_hidden = false;

GRANT SELECT, INSERT, UPDATE ON public.lesson_discussion_posts TO authenticated;
GRANT ALL ON public.lesson_discussion_posts TO service_role;

ALTER TABLE public.lesson_discussion_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select_public_visible"
  ON public.lesson_discussion_posts FOR SELECT TO authenticated
  USING (deleted_at IS NULL AND is_hidden = false);

CREATE POLICY "posts_select_team_all"
  ON public.lesson_discussion_posts FOR SELECT TO authenticated
  USING (public.is_soundkeleles_team());

CREATE POLICY "posts_insert_self_non_team"
  ON public.lesson_discussion_posts FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND is_hidden = false
    AND deleted_at IS NULL
    AND NOT public.is_soundkeleles_team()
  );

CREATE POLICY "posts_update_author_soft_delete"
  ON public.lesson_discussion_posts FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "posts_update_team_hide"
  ON public.lesson_discussion_posts FOR UPDATE TO authenticated
  USING (public.is_soundkeleles_team())
  WITH CHECK (public.is_soundkeleles_team());

CREATE OR REPLACE FUNCTION public.guard_post_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  is_team boolean := public.is_soundkeleles_team();
BEGIN
  IF NEW.id <> OLD.id
     OR NEW.user_id <> OLD.user_id
     OR NEW.lesson_id <> OLD.lesson_id
     OR NEW.post_type <> OLD.post_type
     OR NEW.content <> OLD.content
     OR NEW.author_display_name <> OLD.author_display_name
     OR NEW.created_at <> OLD.created_at
  THEN
    RAISE EXCEPTION 'Immutable field changed on lesson_discussion_posts';
  END IF;

  IF is_team THEN
    IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
      RAISE EXCEPTION 'Team cannot modify deleted_at';
    END IF;
  ELSE
    IF NEW.is_hidden IS DISTINCT FROM OLD.is_hidden THEN
      RAISE EXCEPTION 'Author cannot modify is_hidden';
    END IF;
    IF OLD.deleted_at IS NOT NULL THEN
      RAISE EXCEPTION 'Post already deleted';
    END IF;
    IF NEW.deleted_at IS NULL THEN
      RAISE EXCEPTION 'Author update must set deleted_at';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_guard_post_update
  BEFORE UPDATE ON public.lesson_discussion_posts
  FOR EACH ROW EXECUTE FUNCTION public.guard_post_update();

CREATE OR REPLACE FUNCTION public.set_post_author_display_name()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_mode      text;
  v_pname     text;
  v_parent    text;
  v_first     text;
  v_reserved  text[] := ARRAY['equipo','soundkeleles','equipo soundkeleles'];
  v_fallback  text;
BEGIN
  SELECT experience_mode, name INTO v_mode, v_pname
    FROM public.profiles WHERE id = NEW.user_id;

  IF v_mode = 'accompanied_learning' THEN
    SELECT parent_name INTO v_parent
      FROM public.parent_journeys WHERE user_id = NEW.user_id
      ORDER BY updated_at DESC LIMIT 1;
    v_first    := NULLIF(btrim(split_part(btrim(COALESCE(v_parent,'')), ' ', 1)), '');
    v_fallback := 'Familia SoundKeleles';
  ELSE
    v_first    := NULLIF(btrim(split_part(btrim(COALESCE(v_pname,'')), ' ', 1)), '');
    v_fallback := 'Miembro de SoundKeleles';
  END IF;

  IF v_first IS NULL OR lower(v_first) = ANY (v_reserved) THEN
    NEW.author_display_name := v_fallback;
  ELSE
    NEW.author_display_name := v_first;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_post_author_display_name
  BEFORE INSERT ON public.lesson_discussion_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_post_author_display_name();

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON public.lesson_discussion_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ---------- Replies (solo equipo) ----------
CREATE TABLE public.lesson_discussion_replies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES public.lesson_discussion_posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content    text NOT NULL,
  is_hidden  boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT replies_content_len CHECK (
    char_length(btrim(content)) BETWEEN 3 AND 2000
  )
);

CREATE INDEX lesson_discussion_replies_by_post
  ON public.lesson_discussion_replies (post_id, created_at ASC);

GRANT SELECT, INSERT, UPDATE ON public.lesson_discussion_replies TO authenticated;
GRANT ALL ON public.lesson_discussion_replies TO service_role;

ALTER TABLE public.lesson_discussion_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "replies_select_public_visible"
  ON public.lesson_discussion_replies FOR SELECT TO authenticated
  USING (
    is_hidden = false
    AND EXISTS (
      SELECT 1 FROM public.lesson_discussion_posts p
      WHERE p.id = lesson_discussion_replies.post_id
        AND p.deleted_at IS NULL
        AND p.is_hidden = false
    )
  );

CREATE POLICY "replies_select_team_all"
  ON public.lesson_discussion_replies FOR SELECT TO authenticated
  USING (public.is_soundkeleles_team());

CREATE POLICY "replies_insert_team_only"
  ON public.lesson_discussion_replies FOR INSERT TO authenticated
  WITH CHECK (
    public.is_soundkeleles_team()
    AND user_id = auth.uid()
    AND is_hidden = false
    AND EXISTS (
      SELECT 1 FROM public.lesson_discussion_posts p
      WHERE p.id = post_id AND p.deleted_at IS NULL
    )
  );

CREATE POLICY "replies_update_team_hide"
  ON public.lesson_discussion_replies FOR UPDATE TO authenticated
  USING (public.is_soundkeleles_team())
  WITH CHECK (public.is_soundkeleles_team());

CREATE OR REPLACE FUNCTION public.guard_reply_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_soundkeleles_team() THEN
    RAISE EXCEPTION 'Only team can update replies';
  END IF;
  IF NEW.id <> OLD.id
     OR NEW.post_id <> OLD.post_id
     OR NEW.user_id <> OLD.user_id
     OR NEW.content <> OLD.content
     OR NEW.created_at <> OLD.created_at
  THEN
    RAISE EXCEPTION 'Immutable field changed on lesson_discussion_replies';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_guard_reply_update
  BEFORE UPDATE ON public.lesson_discussion_replies
  FOR EACH ROW EXECUTE FUNCTION public.guard_reply_update();

CREATE TRIGGER trg_replies_updated_at
  BEFORE UPDATE ON public.lesson_discussion_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ---------- Reactions ----------
CREATE TABLE public.lesson_discussion_reactions (
  post_id    uuid NOT NULL REFERENCES public.lesson_discussion_posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX lesson_discussion_reactions_by_post
  ON public.lesson_discussion_reactions (post_id);

GRANT SELECT, INSERT, DELETE ON public.lesson_discussion_reactions TO authenticated;
GRANT ALL ON public.lesson_discussion_reactions TO service_role;

ALTER TABLE public.lesson_discussion_reactions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.reaction_post_visible(_post_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.lesson_discussion_posts p
    WHERE p.id = _post_id
      AND (
        (p.deleted_at IS NULL AND p.is_hidden = false)
        OR public.is_soundkeleles_team()
      )
  );
$$;

REVOKE ALL ON FUNCTION public.reaction_post_visible(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reaction_post_visible(uuid) TO authenticated, service_role;

CREATE POLICY "reactions_select_when_post_visible"
  ON public.lesson_discussion_reactions FOR SELECT TO authenticated
  USING (public.reaction_post_visible(post_id));

CREATE POLICY "reactions_insert_self_when_visible"
  ON public.lesson_discussion_reactions FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.reaction_post_visible(post_id)
  );

CREATE POLICY "reactions_delete_self_when_visible"
  ON public.lesson_discussion_reactions FOR DELETE TO authenticated
  USING (
    user_id = auth.uid()
    AND public.reaction_post_visible(post_id)
  );
