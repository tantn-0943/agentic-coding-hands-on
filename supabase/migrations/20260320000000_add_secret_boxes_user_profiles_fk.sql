-- Bug fix: Add FK from secret_boxes.user_id to user_profiles(id)
-- This enables PostgREST to resolve the join:
--   .from('secret_boxes').select('user:user_profiles(...)')
-- Previously, secret_boxes.user_id only referenced auth.users(id),
-- so PostgREST could not find a path to user_profiles.

ALTER TABLE secret_boxes
  ADD CONSTRAINT secret_boxes_user_id_user_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES user_profiles(id);
