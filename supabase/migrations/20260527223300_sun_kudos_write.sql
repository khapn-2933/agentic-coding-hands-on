-- Enable writing kudos from the "Viết Kudo" compose modal.
-- Adds anonymous-send columns and INSERT RLS so an authenticated user can post
-- a kudos as themselves, plus self-insert/update on profiles so a first-time
-- poster gets a profile row on the fly.

-- ---------------------------------------------------------------------------
-- 1. Anonymous send support on kudos.
-- ---------------------------------------------------------------------------
ALTER TABLE public.kudos
  ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS anonymous_name text;

-- ---------------------------------------------------------------------------
-- 2. Profiles: let a signed-in user create/update their OWN profile row.
--    (SELECT for all authenticated already exists from the schema migration.)
-- ---------------------------------------------------------------------------
CREATE POLICY profiles_insert_self ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY profiles_update_self ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3. Kudos: an authenticated user may insert a kudos only as themselves
--    (sender_id must be one of their own profile rows).
-- ---------------------------------------------------------------------------
CREATE POLICY kudos_insert_own ON public.kudos
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );
