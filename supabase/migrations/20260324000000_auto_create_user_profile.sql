-- Auto-create user_profiles row when a new user signs up via auth.
-- This prevents FK violations when inserting kudos (kudos_sender_id_user_profiles_fkey).
--
-- Google OAuth provides: raw_user_meta_data->>'full_name', raw_user_meta_data->>'avatar_url'

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(
      EXCLUDED.name,
      user_profiles.name
    ),
    avatar_url = COALESCE(
      EXCLUDED.avatar_url,
      user_profiles.avatar_url
    );
  RETURN NEW;
END;
$$;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
