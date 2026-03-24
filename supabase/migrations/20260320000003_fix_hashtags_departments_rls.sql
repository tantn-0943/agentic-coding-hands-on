-- Bug fix: Allow both authenticated and anon roles to read reference tables.
-- hashtags and departments are non-sensitive reference data used in dropdowns.
-- The original policy only allowed 'authenticated', which returns empty results
-- if the session is not properly forwarded in server-side API routes.

-- Add anon read access for hashtags
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'hashtags_select_anon' AND tablename = 'hashtags'
  ) THEN
    CREATE POLICY "hashtags_select_anon" ON hashtags FOR SELECT TO anon USING (true);
  END IF;
END
$$;

-- Add anon read access for departments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'departments_select_anon' AND tablename = 'departments'
  ) THEN
    CREATE POLICY "departments_select_anon" ON departments FOR SELECT TO anon USING (true);
  END IF;
END
$$;

-- Add anon read access for app_config (special_days used in hearts)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'app_config_select_anon' AND tablename = 'app_config'
  ) THEN
    CREATE POLICY "app_config_select_anon" ON app_config FOR SELECT TO anon USING (true);
  END IF;
END
$$;
