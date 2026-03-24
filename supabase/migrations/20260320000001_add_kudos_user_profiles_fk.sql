-- Bug fix: Add FKs from kudos.sender_id and kudos.receiver_id to user_profiles(id)
-- This enables PostgREST to resolve the join:
--   .from('kudos').select('sender:user_profiles!kudos_sender_id_user_profiles_fkey(...)')
--
-- The original inline REFERENCES auth.users(id) created auto-named FKs
-- (kudos_sender_id_fkey, kudos_receiver_id_fkey) that point to auth.users,
-- not user_profiles. PostgREST needs explicit FKs to user_profiles.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kudos_sender_id_user_profiles_fkey'
  ) THEN
    ALTER TABLE kudos
      ADD CONSTRAINT kudos_sender_id_user_profiles_fkey
      FOREIGN KEY (sender_id) REFERENCES user_profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kudos_receiver_id_user_profiles_fkey'
  ) THEN
    ALTER TABLE kudos
      ADD CONSTRAINT kudos_receiver_id_user_profiles_fkey
      FOREIGN KEY (receiver_id) REFERENCES user_profiles(id);
  END IF;
END
$$;
