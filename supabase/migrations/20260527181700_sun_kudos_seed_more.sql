-- Densify the Sun* Kudos board: +24 profiles and ~40 generated kudos so the
-- Spotlight word cloud and "N KUDOS" count look populated like the design.
-- Generated kudos are dated older than the curated 12 so the feed still leads
-- with the hand-written ones.

INSERT INTO public.profiles(id, full_name, department_id, avatar_url, badge) VALUES
  ('33333333-0000-0000-0000-000000000001', 'Trần Minh Khoa',   'CECV10', 'https://i.pravatar.cc/64?u=tran-minh-khoa-2',   'Rising Hero'),
  ('33333333-0000-0000-0000-000000000002', 'Lê Thị Hương',     'CECV20', 'https://i.pravatar.cc/64?u=le-thi-huong-2',     'Legend Hero'),
  ('33333333-0000-0000-0000-000000000003', 'Phạm Văn An',      'Marketing', 'https://i.pravatar.cc/64?u=pham-van-an-2',   'New Hero'),
  ('33333333-0000-0000-0000-000000000004', 'Vũ Thị Mai',       'Design', 'https://i.pravatar.cc/64?u=vu-thi-mai-2',       'Super Hero'),
  ('33333333-0000-0000-0000-000000000005', 'Đỗ Quang Huy',     'CECV10', 'https://i.pravatar.cc/64?u=do-quang-huy-2',     'Rising Hero'),
  ('33333333-0000-0000-0000-000000000006', 'Bùi Thị Lan',      'CECV20', 'https://i.pravatar.cc/64?u=bui-thi-lan-2',      'Legend Hero'),
  ('33333333-0000-0000-0000-000000000007', 'Hoàng Văn Nam',    'Design', 'https://i.pravatar.cc/64?u=hoang-van-nam',      'Super Hero'),
  ('33333333-0000-0000-0000-000000000008', 'Ngô Thị Thu',      'Marketing', 'https://i.pravatar.cc/64?u=ngo-thi-thu',     'Rising Hero'),
  ('33333333-0000-0000-0000-000000000009', 'Đinh Văn Tài',     'CECV10', 'https://i.pravatar.cc/64?u=dinh-van-tai',       'New Hero'),
  ('33333333-0000-0000-0000-00000000000a', 'Phan Thị Nga',     'CECV20', 'https://i.pravatar.cc/64?u=phan-thi-nga',       'Legend Hero'),
  ('33333333-0000-0000-0000-00000000000b', 'Lý Minh Tuấn',     'Design', 'https://i.pravatar.cc/64?u=ly-minh-tuan',       'Rising Hero'),
  ('33333333-0000-0000-0000-00000000000c', 'Cao Thị Liên',     'Marketing', 'https://i.pravatar.cc/64?u=cao-thi-lien',     'Super Hero'),
  ('33333333-0000-0000-0000-00000000000d', 'Dương Văn Đức',    'CECV10', 'https://i.pravatar.cc/64?u=duong-van-duc',      'Rising Hero'),
  ('33333333-0000-0000-0000-00000000000e', 'Trịnh Thị Hà',     'CECV20', 'https://i.pravatar.cc/64?u=trinh-thi-ha',       'Legend Hero'),
  ('33333333-0000-0000-0000-00000000000f', 'Võ Thành Long',    'Design', 'https://i.pravatar.cc/64?u=vo-thanh-long',      'New Hero'),
  ('33333333-0000-0000-0000-000000000010', 'Đặng Thu Trang',   'Marketing', 'https://i.pravatar.cc/64?u=dang-thu-trang',  'Super Hero'),
  ('33333333-0000-0000-0000-000000000011', 'Mai Quốc Bảo',     'CECV10', 'https://i.pravatar.cc/64?u=mai-quoc-bao',       'Rising Hero'),
  ('33333333-0000-0000-0000-000000000012', 'Hồ Thị Yến',       'CECV20', 'https://i.pravatar.cc/64?u=ho-thi-yen',         'Legend Hero'),
  ('33333333-0000-0000-0000-000000000013', 'Tạ Văn Sơn',       'Design', 'https://i.pravatar.cc/64?u=ta-van-son',         'Super Hero'),
  ('33333333-0000-0000-0000-000000000014', 'Lương Thị Hoa',    'Marketing', 'https://i.pravatar.cc/64?u=luong-thi-hoa',   'Rising Hero'),
  ('33333333-0000-0000-0000-000000000015', 'Châu Minh Hiếu',   'CECV10', 'https://i.pravatar.cc/64?u=chau-minh-hieu',     'New Hero'),
  ('33333333-0000-0000-0000-000000000016', 'Kiều Thị Vân',     'CECV20', 'https://i.pravatar.cc/64?u=kieu-thi-van',       'Legend Hero'),
  ('33333333-0000-0000-0000-000000000017', 'Trương Văn Phúc',  'Design', 'https://i.pravatar.cc/64?u=truong-van-phuc',    'Super Hero'),
  ('33333333-0000-0000-0000-000000000018', 'Đoàn Thị Kim',     'Marketing', 'https://i.pravatar.cc/64?u=doan-thi-kim',    'Rising Hero');

-- ~40 generated kudos with deterministic pseudo-random sender/receiver pairs.
INSERT INTO public.kudos(sender_id, receiver_id, title, content, hashtags, image_urls, like_count, created_at)
SELECT
  s.id,
  r.id,
  'IDOL GIỚI TRẺ',
  CASE g % 4
    WHEN 0 THEN 'Cảm ơn bạn đã luôn hỗ trợ team trong suốt thời gian qua. Tinh thần trách nhiệm của bạn là nguồn cảm hứng cho tất cả mọi người!'
    WHEN 1 THEN 'Sự tận tâm và chuyên nghiệp của bạn khiến mình rất nể phục. Cảm ơn vì đã đồng hành cùng dự án!'
    WHEN 2 THEN 'Năng lượng tích cực bạn mang lại cho team thật tuyệt vời. Cảm ơn vì là một người đồng đội đáng quý!'
    ELSE 'Cảm ơn bạn vì những đóng góp thầm lặng nhưng vô cùng giá trị. Bạn xứng đáng được ghi nhận!'
  END,
  CASE g % 4
    WHEN 0 THEN ARRAY['#Dedicated','#Inspiring','#TeamPlayer']
    WHEN 1 THEN ARRAY['#Excellence','#Leadership','#SunStar']
    WHEN 2 THEN ARRAY['#Creative','#Innovation','#BestTeam']
    ELSE ARRAY['#Gratitude','#Mentor','#Champion']
  END,
  ARRAY[]::text[],
  (random() * 900 + 50)::int,
  now() - interval '4 days' - (g || ' hours')::interval
FROM generate_series(1, 40) g
CROSS JOIN LATERAL (
  SELECT id FROM public.profiles ORDER BY md5(g::text || id::text) LIMIT 1
) s
CROSS JOIN LATERAL (
  SELECT id FROM public.profiles WHERE id <> s.id ORDER BY md5(g::text || 'r' || id::text) LIMIT 1
) r;
