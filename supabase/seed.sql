-- Seed data for Kudos Live Board development
-- 3 departments, 8 hashtags, 10 users, 50 kudos, varied hearts, 5 secret boxes

-- Departments
INSERT INTO departments (id, name) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Engineering'),
  ('d1000000-0000-0000-0000-000000000002', 'Design'),
  ('d1000000-0000-0000-0000-000000000003', 'Product');

-- Hashtags
INSERT INTO hashtags (id, name) VALUES
  ('h1000000-0000-0000-0000-000000000001', 'Dedicated'),
  ('h1000000-0000-0000-0000-000000000002', 'Inspiring'),
  ('h1000000-0000-0000-0000-000000000003', 'Teamwork'),
  ('h1000000-0000-0000-0000-000000000004', 'Creative'),
  ('h1000000-0000-0000-0000-000000000005', 'Leadership'),
  ('h1000000-0000-0000-0000-000000000006', 'Supportive'),
  ('h1000000-0000-0000-0000-000000000007', 'Innovation'),
  ('h1000000-0000-0000-0000-000000000008', 'Excellence');

-- App config (special days)
INSERT INTO app_config (key, value) VALUES
  ('special_days', '["2025-12-25", "2025-11-15"]');

-- Note: user_profiles depend on auth.users which are created via Supabase Auth.
-- In local dev, create test users via Supabase dashboard or seed auth.users directly.
-- The following assumes 10 test user UUIDs exist in auth.users.

-- Example user profiles (uncomment after creating auth.users):
-- INSERT INTO user_profiles (id, name, avatar_url, department_id, title, star_count, kudos_received_count, kudos_sent_count, hearts_received_count) VALUES
--   ('u1000000-0000-0000-0000-000000000001', 'Huynh Duong Xuan Nhat', NULL, 'd1000000-0000-0000-0000-000000000001', 'GRAPHIC', 2, 25, 15, 50),
--   ('u1000000-0000-0000-0000-000000000002', 'Huynh Duong Xuan',      NULL, 'd1000000-0000-0000-0000-000000000002', 'GRAPHIC', 1, 12, 20, 30),
--   ('u1000000-0000-0000-0000-000000000003', 'Nguyen Hoang Long',     NULL, 'd1000000-0000-0000-0000-000000000001', 'DEVELOPER', 3, 55, 10, 100),
--   ('u1000000-0000-0000-0000-000000000004', 'Tran Van Minh',         NULL, 'd1000000-0000-0000-0000-000000000003', 'PM', 1, 18, 30, 25),
--   ('u1000000-0000-0000-0000-000000000005', 'Le Thi Mai',            NULL, 'd1000000-0000-0000-0000-000000000002', 'DESIGNER', 2, 22, 8, 40),
--   ('u1000000-0000-0000-0000-000000000006', 'Pham Duc Anh',          NULL, 'd1000000-0000-0000-0000-000000000001', 'DEVELOPER', 0, 5, 12, 10),
--   ('u1000000-0000-0000-0000-000000000007', 'Vo Thanh Tam',          NULL, 'd1000000-0000-0000-0000-000000000003', 'QA', 1, 15, 25, 20),
--   ('u1000000-0000-0000-0000-000000000008', 'Do Minh Chau',          NULL, 'd1000000-0000-0000-0000-000000000001', 'DEVELOPER', 2, 30, 18, 60),
--   ('u1000000-0000-0000-0000-000000000009', 'Bui Quang Huy',         NULL, 'd1000000-0000-0000-0000-000000000002', 'DESIGNER', 0, 8, 5, 12),
--   ('u1000000-0000-0000-0000-000000000010', 'Nguyen Ba Chuc',        NULL, 'd1000000-0000-0000-0000-000000000003', 'PM', 1, 10, 22, 15);

-- Secret boxes (uncomment after creating auth.users):
-- INSERT INTO secret_boxes (user_id, is_opened, gift_description) VALUES
--   ('u1000000-0000-0000-0000-000000000001', true,  'Nhan duoc 1 ao phong SAA'),
--   ('u1000000-0000-0000-0000-000000000001', false, NULL),
--   ('u1000000-0000-0000-0000-000000000002', true,  'Nhan duoc 1 ao phong SAA'),
--   ('u1000000-0000-0000-0000-000000000003', false, NULL),
--   ('u1000000-0000-0000-0000-000000000004', true,  'Nhan duoc 1 ao phong SAA');
