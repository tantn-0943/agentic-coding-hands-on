-- Kudos Live Board: Core tables, RLS policies, and views
-- Migration: 20260316000000_create_kudos_tables

-- Reference tables
CREATE TABLE IF NOT EXISTS hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  department_id UUID REFERENCES departments(id),
  title TEXT,
  star_count INT DEFAULT 0,
  kudos_received_count INT DEFAULT 0,
  kudos_sent_count INT DEFAULT 0,
  hearts_received_count INT DEFAULT 0
);

-- App configuration (special days, etc.)
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Core kudos table
CREATE TABLE IF NOT EXISTS kudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  category_tag TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_kudos_created_at ON kudos(created_at DESC);
CREATE INDEX idx_kudos_sender ON kudos(sender_id);
CREATE INDEX idx_kudos_receiver ON kudos(receiver_id);

-- Kudos media attachments
CREATE TABLE IF NOT EXISTS kudos_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kudos_id UUID REFERENCES kudos(id) ON DELETE CASCADE NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')) NOT NULL,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE INDEX idx_kudos_media_kudos ON kudos_media(kudos_id);

-- Kudos-to-hashtag junction
CREATE TABLE IF NOT EXISTS kudos_hashtags (
  kudos_id UUID REFERENCES kudos(id) ON DELETE CASCADE,
  hashtag_id UUID REFERENCES hashtags(id),
  PRIMARY KEY (kudos_id, hashtag_id)
);

-- Hearts (likes)
CREATE TABLE IF NOT EXISTS hearts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kudos_id UUID REFERENCES kudos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  is_special_day BOOLEAN DEFAULT false,
  points INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(kudos_id, user_id)
);

CREATE INDEX idx_hearts_kudos ON hearts(kudos_id);
CREATE INDEX idx_hearts_user ON hearts(user_id);

-- Secret boxes
CREATE TABLE IF NOT EXISTS secret_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  is_opened BOOLEAN DEFAULT false,
  gift_description TEXT,
  opened_at TIMESTAMPTZ
);

CREATE INDEX idx_secret_boxes_user ON secret_boxes(user_id);

-- ================================================
-- RLS Policies (Constitution Principle IV)
-- ================================================

ALTER TABLE kudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearts ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- kudos
CREATE POLICY "kudos_select" ON kudos FOR SELECT TO authenticated USING (true);
CREATE POLICY "kudos_insert" ON kudos FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- hearts
CREATE POLICY "hearts_select" ON hearts FOR SELECT TO authenticated USING (true);
CREATE POLICY "hearts_insert" ON hearts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND auth.uid() != (SELECT sender_id FROM kudos WHERE id = kudos_id));
CREATE POLICY "hearts_delete" ON hearts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- secret_boxes
CREATE POLICY "secret_boxes_select" ON secret_boxes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "secret_boxes_update" ON secret_boxes FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- user_profiles
CREATE POLICY "profiles_select" ON user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Reference tables: read-only
CREATE POLICY "hashtags_select" ON hashtags FOR SELECT TO authenticated USING (true);
CREATE POLICY "departments_select" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "app_config_select" ON app_config FOR SELECT TO authenticated USING (true);

-- Media
CREATE POLICY "media_select" ON kudos_media FOR SELECT TO authenticated USING (true);
CREATE POLICY "media_insert" ON kudos_media FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = (SELECT sender_id FROM kudos WHERE id = kudos_id));

-- Kudos hashtags
CREATE POLICY "kudos_hashtags_select" ON kudos_hashtags FOR SELECT TO authenticated USING (true);
CREATE POLICY "kudos_hashtags_insert" ON kudos_hashtags FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = (SELECT sender_id FROM kudos WHERE id = kudos_id));

-- ================================================
-- Views
-- ================================================

CREATE OR REPLACE VIEW kudos_with_hearts AS
  SELECT k.*, COALESCE(COUNT(h.id), 0)::INT AS heart_count
  FROM kudos k
  LEFT JOIN hearts h ON h.kudos_id = k.id
  GROUP BY k.id;
