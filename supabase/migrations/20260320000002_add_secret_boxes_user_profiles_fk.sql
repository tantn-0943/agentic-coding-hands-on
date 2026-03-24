-- Bug fix: Add FK from secret_boxes.user_id to user_profiles(id)
-- This enables PostgREST to resolve the join:
--   .from('secret_boxes').select('user:user_profiles!secret_boxes_user_id_user_profiles_fkey(...)')
--
-- The original inline REFERENCES auth.users(id) created auto-named FK
-- (secret_boxes_user_id_fkey) that points to auth.users, not user_profiles.
-- PostgREST needs an explicit FK to user_profiles for the join to work.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'secret_boxes_user_id_user_profiles_fkey'
  ) THEN
    ALTER TABLE secret_boxes
      ADD CONSTRAINT secret_boxes_user_id_user_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES user_profiles(id);
  END IF;
END
$$;
