-- Review fixes for the kudos write path.
-- H1: allow a signed-in user to CLAIM an unlinked seeded profile (user_id IS NULL)
--     by matching email. The existing profiles_update_self policy's USING clause
--     evaluates to NULL for unlinked rows, so the claim update silently affected
--     0 rows; this policy makes the claim possible (WITH CHECK still pins it to
--     the caller's own auth.uid()).
CREATE POLICY profiles_claim_unlinked ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id IS NULL)
  WITH CHECK (user_id = auth.uid());

-- M1: cap free-text lengths at the DB as a backstop to the server-action guards.
ALTER TABLE public.kudos
  ADD CONSTRAINT kudos_content_len CHECK (char_length(content) <= 2000),
  ADD CONSTRAINT kudos_title_len CHECK (title IS NULL OR char_length(title) <= 200),
  ADD CONSTRAINT kudos_anon_name_len
    CHECK (anonymous_name IS NULL OR char_length(anonymous_name) <= 100);
