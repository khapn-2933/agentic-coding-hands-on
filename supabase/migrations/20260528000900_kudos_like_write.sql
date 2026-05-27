-- Enable liking kudos: write RLS on kudos_likes + a trigger that keeps the
-- denormalized kudos.like_count in sync. The trigger INCREMENTS/DECREMENTS
-- (rather than recomputing) so the seeded base like_count is preserved.

-- ---------------------------------------------------------------------------
-- 1. RLS: a signed-in user may like as themselves, but NOT their own kudos;
--    and may remove only their own like. (PK (kudos_id,user_id) already
--    enforces one-like-per-user.)
-- ---------------------------------------------------------------------------
CREATE POLICY kudos_likes_insert_own ON public.kudos_likes
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    -- Clients may only insert a normal (1×) like; the special-day 2× multiplier
    -- is applied server-side, never trusted from a client-supplied row. This
    -- prevents corrupting like_count via the SECURITY DEFINER sync trigger.
    AND bonus_multiplier = 1
    AND NOT EXISTS (
      SELECT 1 FROM public.kudos k
      WHERE k.id = kudos_id AND k.sender_id = kudos_likes.user_id
    )
  );

CREATE POLICY kudos_likes_delete_own ON public.kudos_likes
  FOR DELETE TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- 2. Keep kudos.like_count in sync (delta, preserves seeded base).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_kudos_like_count()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.kudos
      SET like_count = like_count + NEW.bonus_multiplier
      WHERE id = NEW.kudos_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.kudos
      SET like_count = GREATEST(0, like_count - OLD.bonus_multiplier)
      WHERE id = OLD.kudos_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_kudos_like_count
  AFTER INSERT OR DELETE ON public.kudos_likes
  FOR EACH ROW EXECUTE FUNCTION public.sync_kudos_like_count();
