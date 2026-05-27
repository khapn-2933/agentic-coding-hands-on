-- Sun* Kudos schema: profiles, departments, kudos posts + likes.
-- Read-only MVP: seed data drives the /sun-kudos board. Writes (send/like/open-box)
-- come in a later migration once the dialog flows are built.

-- ---------------------------------------------------------------------------
-- 1. Departments (small reference table; seed-only for now).
-- ---------------------------------------------------------------------------
CREATE TABLE public.departments (
  id text PRIMARY KEY,
  name text NOT NULL
);

-- ---------------------------------------------------------------------------
-- 2. Profiles (1-to-optional-1 with auth.users; nullable so seed users without
--    auth.users entries are valid until they sign in via Google OAuth).
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  email text UNIQUE,
  full_name text NOT NULL,
  department_id text REFERENCES public.departments(id),
  avatar_url text,
  badge text CHECK (
    badge IS NULL
    OR badge IN ('Rising Hero', 'Legend Hero', 'Super Hero', 'New Hero')
  ),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX profiles_department_idx ON public.profiles(department_id);

-- ---------------------------------------------------------------------------
-- 3. Kudos posts. like_count is denormalized so the board reads cheaply; once
--    likes become writeable, a trigger keeps it in sync with kudos_likes.
-- ---------------------------------------------------------------------------
CREATE TABLE public.kudos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text,
  content text NOT NULL,
  hashtags text[] NOT NULL DEFAULT '{}',
  image_urls text[] NOT NULL DEFAULT '{}',
  like_count int NOT NULL DEFAULT 0,
  is_highlight boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kudos_no_self_send CHECK (sender_id <> receiver_id)
);

CREATE INDEX kudos_created_at_idx ON public.kudos(created_at DESC);
CREATE INDEX kudos_sender_idx ON public.kudos(sender_id);
CREATE INDEX kudos_receiver_idx ON public.kudos(receiver_id);
CREATE INDEX kudos_like_count_idx ON public.kudos(like_count DESC);
CREATE INDEX kudos_hashtags_gin ON public.kudos USING GIN(hashtags);

-- ---------------------------------------------------------------------------
-- 4. Kudos likes. Empty in MVP (no writes), but the schema is here so the
--    later Like-toggle migration is additive (RLS policy + trigger only).
-- ---------------------------------------------------------------------------
CREATE TABLE public.kudos_likes (
  kudos_id uuid NOT NULL REFERENCES public.kudos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bonus_multiplier int NOT NULL DEFAULT 1 CHECK (bonus_multiplier IN (1, 2)),
  liked_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (kudos_id, user_id)
);

-- ---------------------------------------------------------------------------
-- 5. RLS — read-only for authenticated users in MVP.
-- ---------------------------------------------------------------------------
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudos_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY departments_select ON public.departments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY profiles_select ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY kudos_select ON public.kudos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY kudos_likes_select ON public.kudos_likes
  FOR SELECT TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- 6. Helper: star_rank derived from kudos received (1★ ≥10, 2★ ≥20, 3★ ≥50).
--    Exposed as an RPC so the client can compute without a full profile join.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.star_rank_for(profile_id uuid)
RETURNS int
LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT CASE
    WHEN c >= 50 THEN 3
    WHEN c >= 20 THEN 2
    WHEN c >= 10 THEN 1
    ELSE 0
  END
  FROM (SELECT COUNT(*) AS c FROM public.kudos WHERE receiver_id = profile_id) s;
$$;
