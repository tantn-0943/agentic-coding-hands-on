-- ================================================
-- Full seed data for SAA 2025 - Kudos Live Board
-- Covers: departments, hashtags, app_config, auth users,
-- user_profiles, kudos, kudos_hashtags, kudos_media, hearts, secret_boxes
-- ================================================

-- Clean existing data (order matters due to FK constraints)
TRUNCATE kudos_media, kudos_hashtags, hearts, secret_boxes, kudos, user_profiles, departments, hashtags, app_config CASCADE;

-- ================================================
-- 1. Reference tables
-- ================================================

-- 3 Departments
INSERT INTO departments (id, name) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Engineering'),
  ('d1000000-0000-0000-0000-000000000002', 'Design'),
  ('d1000000-0000-0000-0000-000000000003', 'Product');

-- 8 Hashtags
INSERT INTO hashtags (id, name) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Dedicated'),
  ('a1000000-0000-0000-0000-000000000002', 'Inspiring'),
  ('a1000000-0000-0000-0000-000000000003', 'Teamwork'),
  ('a1000000-0000-0000-0000-000000000004', 'Creative'),
  ('a1000000-0000-0000-0000-000000000005', 'Leadership'),
  ('a1000000-0000-0000-0000-000000000006', 'Supportive'),
  ('a1000000-0000-0000-0000-000000000007', 'Innovation'),
  ('a1000000-0000-0000-0000-000000000008', 'Excellence');

-- App config (special days for double-point hearts)
INSERT INTO app_config (key, value) VALUES
  ('special_days', '["2025-12-25", "2025-11-15", "2026-03-20"]')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ================================================
-- 2. Auth users (Supabase local dev)
-- ================================================
-- Create 10 test users in auth.users for local development.
-- In production, users are created via Google OAuth.

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
  ('b1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'nhat.huynh@sun-asterisk.com',   crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"google","providers":["google"]}', '{"full_name":"Huynh Duong Xuan Nhat"}',  'authenticated', 'authenticated'),
  ('b1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'xuan.huynh@sun-asterisk.com',   crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"google","providers":["google"]}', '{"full_name":"Huynh Duong Xuan"}',       'authenticated', 'authenticated'),
  ('b1000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'long.nguyen@sun-asterisk.com',  crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"google","providers":["google"]}', '{"full_name":"Nguyen Hoang Long"}',      'authenticated', 'authenticated'),
  ('b1000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'minh.tran@sun-asterisk.com',    crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"google","providers":["google"]}', '{"full_name":"Tran Van Minh"}',          'authenticated', 'authenticated'),
  ('b1000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'mai.le@sun-asterisk.com',       crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"google","providers":["google"]}', '{"full_name":"Le Thi Mai"}',             'authenticated', 'authenticated'),
  ('b1000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'anh.pham@sun-asterisk.com',     crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"google","providers":["google"]}', '{"full_name":"Pham Duc Anh"}',           'authenticated', 'authenticated'),
  ('b1000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'tam.vo@sun-asterisk.com',       crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"google","providers":["google"]}', '{"full_name":"Vo Thanh Tam"}',           'authenticated', 'authenticated'),
  ('b1000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'chau.do@sun-asterisk.com',      crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"google","providers":["google"]}', '{"full_name":"Do Minh Chau"}',           'authenticated', 'authenticated'),
  ('b1000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'huy.bui@sun-asterisk.com',      crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"google","providers":["google"]}', '{"full_name":"Bui Quang Huy"}',          'authenticated', 'authenticated'),
  ('b1000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'chuc.nguyen@sun-asterisk.com',  crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"google","providers":["google"]}', '{"full_name":"Nguyen Ba Chuc"}',         'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Also create auth.identities for each user (required by Supabase Auth)
INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
SELECT id, id, email, 'email', jsonb_build_object('sub', id::text, 'email', email), now(), now(), now()
FROM auth.users WHERE id IN (
  'b1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000004',
  'b1000000-0000-0000-0000-000000000005','b1000000-0000-0000-0000-000000000006',
  'b1000000-0000-0000-0000-000000000007','b1000000-0000-0000-0000-000000000008',
  'b1000000-0000-0000-0000-000000000009','b1000000-0000-0000-0000-000000000010'
)
ON CONFLICT DO NOTHING;

-- ================================================
-- 3. User profiles
-- ================================================

INSERT INTO user_profiles (id, name, avatar_url, department_id, title, star_count, kudos_received_count, kudos_sent_count, hearts_received_count) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Huynh Duong Xuan Nhat', NULL, 'd1000000-0000-0000-0000-000000000001', 'GRAPHIC',    2, 25, 15, 50),
  ('b1000000-0000-0000-0000-000000000002', 'Huynh Duong Xuan',      NULL, 'd1000000-0000-0000-0000-000000000002', 'GRAPHIC',    1, 12, 20, 30),
  ('b1000000-0000-0000-0000-000000000003', 'Nguyen Hoang Long',     NULL, 'd1000000-0000-0000-0000-000000000001', 'DEVELOPER',  3, 55, 10, 100),
  ('b1000000-0000-0000-0000-000000000004', 'Tran Van Minh',         NULL, 'd1000000-0000-0000-0000-000000000003', 'PM',         1, 18, 30, 25),
  ('b1000000-0000-0000-0000-000000000005', 'Le Thi Mai',            NULL, 'd1000000-0000-0000-0000-000000000002', 'DESIGNER',   2, 22,  8, 40),
  ('b1000000-0000-0000-0000-000000000006', 'Pham Duc Anh',          NULL, 'd1000000-0000-0000-0000-000000000001', 'DEVELOPER',  0,  5, 12, 10),
  ('b1000000-0000-0000-0000-000000000007', 'Vo Thanh Tam',          NULL, 'd1000000-0000-0000-0000-000000000003', 'QA',         1, 15, 25, 20),
  ('b1000000-0000-0000-0000-000000000008', 'Do Minh Chau',          NULL, 'd1000000-0000-0000-0000-000000000001', 'DEVELOPER',  2, 30, 18, 60),
  ('b1000000-0000-0000-0000-000000000009', 'Bui Quang Huy',         NULL, 'd1000000-0000-0000-0000-000000000002', 'DESIGNER',   0,  8,  5, 12),
  ('b1000000-0000-0000-0000-000000000010', 'Nguyen Ba Chuc',        NULL, 'd1000000-0000-0000-0000-000000000003', 'PM',         1, 10, 22, 15);

-- ================================================
-- 4. Kudos (20 entries — varied senders, receivers, content)
-- ================================================

INSERT INTO kudos (id, sender_id, receiver_id, content, category_tag, is_anonymous, anonymous_name, created_at) VALUES
  -- Recent kudos (last 7 days)
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', '<p>Anh Long luôn sẵn sàng hỗ trợ team, cảm ơn anh rất nhiều! 🎉</p>', 'Người truyền động lực', false, NULL, now() - interval '1 hour'),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000005', '<p>Chị Mai đã thiết kế bộ UI mới tuyệt vời, rất chuyên nghiệp!</p>', 'Nghệ sĩ sáng tạo', false, NULL, now() - interval '3 hours'),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', '<p>Nhất luôn hoàn thành deadline trước hạn, great job!</p>', 'Chiến binh deadline', false, NULL, now() - interval '6 hours'),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000007', '<p>Tam đã review kỹ càng và phát hiện nhiều bug quan trọng 🐛</p>', 'QA Siêu Nhân', false, NULL, now() - interval '12 hours'),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000008', '<p>Châu đã fix bug production trong 30 phút, impressive!</p>', 'Anh hùng rescue', false, NULL, now() - interval '1 day'),
  -- Anonymous kudo
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000004', '<p>Cảm ơn anh Minh đã giúp đỡ mình rất nhiều trong dự án!</p>', 'Mentor tuyệt vời', true, 'Người ẩn danh', now() - interval '1 day 6 hours'),
  -- Older kudos
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000002', '<p>Xuân luôn có những ý tưởng design sáng tạo, respect!</p>', 'Creative Master', false, NULL, now() - interval '2 days'),
  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000009', '<p>Huy đã hoàn thành bộ illustration đẹp mắt cho landing page 🎨</p>', 'Họa sĩ tài ba', false, NULL, now() - interval '2 days 12 hours'),
  ('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000010', '<p>Chức đã lead sprint planning rất hiệu quả, team rất hài lòng!</p>', 'Sprint Master', false, NULL, now() - interval '3 days'),
  ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000001', '<p>Nhất luôn chia sẻ kiến thức với team, <strong>cảm ơn rất nhiều</strong>!</p>', 'Knowledge Sharer', false, NULL, now() - interval '3 days 6 hours'),
  ('c1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000006', '<p>Anh đã onboard member mới rất nhanh, teamwork tuyệt vời!</p>', 'Team Player', false, NULL, now() - interval '4 days'),
  ('c1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000005', '<p>Chị Mai đã tổ chức workshop UI/UX rất bổ ích cho cả team!</p>', 'Workshop Queen', false, NULL, now() - interval '4 days 12 hours'),
  ('c1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', '<p>Anh Minh đã negotiate với client thành công, dự án được gia hạn 👏</p>', 'Negotiation Pro', false, NULL, now() - interval '5 days'),
  ('c1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000008', '<p>Châu đã refactor code clean hơn rất nhiều, performance tăng 40%!</p>', 'Code Artisan', false, NULL, now() - interval '5 days 6 hours'),
  ('c1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', '<p>Long đã implement feature phức tạp một cách elegant!</p>', 'Coding Wizard', false, NULL, now() - interval '6 days'),
  -- Anonymous kudo with custom name
  ('c1000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001', '<p>Bạn là nguồn cảm hứng của cả team! Keep going!</p>', 'Ngôi sao sáng', true, 'Một người bạn', now() - interval '6 days 12 hours'),
  ('c1000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000002', '<p>Design mới đẹp quá, khách hàng rất thích!</p>', 'Design Star', false, NULL, now() - interval '7 days'),
  ('c1000000-0000-0000-0000-000000000018', 'b1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000009', '<p>Huy luôn hoàn thành task đúng hạn và chất lượng cao!</p>', 'Reliable Designer', false, NULL, now() - interval '8 days'),
  ('c1000000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000007', '<p>Tam đã handle incident on-call rất chuyên nghiệp!</p>', 'On-Call Hero', false, NULL, now() - interval '9 days'),
  ('c1000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000006', '<p>Anh đã mentor junior rất tận tâm, respect!</p>', 'Mentor của năm', false, NULL, now() - interval '10 days');

-- ================================================
-- 5. Kudos hashtags (1-3 per kudo)
-- ================================================

INSERT INTO kudos_hashtags (kudos_id, hashtag_id) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000006'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000008'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000008'),
  ('c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000007'),
  ('c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000006'),
  ('c1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000006'),
  ('c1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000007'),
  ('c1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000008'),
  ('c1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000007'),
  ('c1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000008'),
  ('c1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000006'),
  ('c1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000003');

-- ================================================
-- 6. Hearts (varied, no self-hearts per RLS)
-- ================================================

INSERT INTO hearts (kudos_id, user_id, is_special_day, points) VALUES
  -- Kudo 1: 5 hearts
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', false, 1),
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000004', false, 1),
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000005', false, 1),
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000007', false, 1),
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000008', false, 1),
  -- Kudo 2: 3 hearts
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', false, 1),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', false, 1),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000006', false, 1),
  -- Kudo 3: 4 hearts
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', false, 1),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', false, 1),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000005', false, 1),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000007', false, 1),
  -- Kudo 5: 6 hearts (popular!)
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', false, 1),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', false, 1),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', false, 1),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000004', false, 1),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000007', false, 1),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000009', false, 1),
  -- Kudo 10: 2 hearts
  ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000002', false, 1),
  ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000006', false, 1),
  -- Kudo 15: 3 hearts
  ('c1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000001', false, 1),
  ('c1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000004', false, 1),
  ('c1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000008', false, 1);

-- ================================================
-- 7. Secret boxes (varied states)
-- ================================================

INSERT INTO secret_boxes (user_id, is_opened, gift_description, opened_at) VALUES
  ('b1000000-0000-0000-0000-000000000001', true,  'Nhận được 1 áo phông SAA 2025 phiên bản giới hạn!', now() - interval '2 days'),
  ('b1000000-0000-0000-0000-000000000001', false, NULL, NULL),
  ('b1000000-0000-0000-0000-000000000002', true,  'Nhận được voucher Highlands Coffee trị giá 100k!', now() - interval '5 days'),
  ('b1000000-0000-0000-0000-000000000003', true,  'Nhận được 1 sticker pack Sun* Kudos đặc biệt!', now() - interval '1 day'),
  ('b1000000-0000-0000-0000-000000000003', false, NULL, NULL),
  ('b1000000-0000-0000-0000-000000000004', true,  'Nhận được 1 ngày Work From Home bonus!', now() - interval '3 days'),
  ('b1000000-0000-0000-0000-000000000005', false, NULL, NULL),
  ('b1000000-0000-0000-0000-000000000008', true,  'Nhận được voucher Grab 50k!', now() - interval '4 days'),
  ('b1000000-0000-0000-0000-000000000010', false, NULL, NULL);

-- ================================================
-- Done! Summary:
-- 3 departments, 8 hashtags, 1 app_config
-- 10 auth users + 10 user_profiles
-- 20 kudos (2 anonymous) with 29 hashtag links
-- 23 hearts across 5 kudos
-- 9 secret boxes (5 opened, 4 unopened)
-- ================================================
