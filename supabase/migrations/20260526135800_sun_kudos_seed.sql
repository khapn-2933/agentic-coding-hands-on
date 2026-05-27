-- Sun* Kudos seed data — 4 departments, 10 profiles, 12 kudos posts.
-- Deterministic UUIDs so the page is reproducible across re-seeds.

INSERT INTO public.departments(id, name) VALUES
  ('CECV10', 'CECV10'),
  ('CECV20', 'CECV20'),
  ('Marketing', 'Marketing'),
  ('Design', 'Design');

INSERT INTO public.profiles(id, full_name, department_id, avatar_url, badge) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Huỳnh Dương Xuân Nhật', 'CECV10', 'https://i.pravatar.cc/64?u=huynh-duong-xuan-nhat', 'Rising Hero'),
  ('11111111-0000-0000-0000-000000000002', 'Nguyễn Bá Chức',        'CECV10', 'https://i.pravatar.cc/64?u=nguyen-ba-chuc',          'Legend Hero'),
  ('11111111-0000-0000-0000-000000000003', 'Nguyễn Văn Quý',        'CECV10', 'https://i.pravatar.cc/64?u=nguyen-van-quy',          'Super Hero'),
  ('11111111-0000-0000-0000-000000000004', 'Nguyễn Hoàng Linh',     'CECV20', 'https://i.pravatar.cc/64?u=nguyen-hoang-linh',       'Legend Hero'),
  ('11111111-0000-0000-0000-000000000005', 'Trần Minh Khoa',        'CECV20', 'https://i.pravatar.cc/64?u=tran-minh-khoa',          'Rising Hero'),
  ('11111111-0000-0000-0000-000000000006', 'Lê Thị Hương',          'Marketing', 'https://i.pravatar.cc/64?u=le-thi-huong',         'Rising Hero'),
  ('11111111-0000-0000-0000-000000000007', 'Phạm Văn An',           'Marketing', 'https://i.pravatar.cc/64?u=pham-van-an',          'New Hero'),
  ('11111111-0000-0000-0000-000000000008', 'Vũ Thị Mai',            'Design',    'https://i.pravatar.cc/64?u=vu-thi-mai',           'Super Hero'),
  ('11111111-0000-0000-0000-000000000009', 'Đỗ Quang Huy',          'Design',    'https://i.pravatar.cc/64?u=do-quang-huy',         'Rising Hero'),
  ('11111111-0000-0000-0000-00000000000a', 'Bùi Thị Lan',           'CECV10',    'https://i.pravatar.cc/64?u=bui-thi-lan',          'Legend Hero');

-- Kudos: mix of senders/receivers, varied like_counts so the Highlight Top-5
-- carousel has a meaningful ordering. Timestamps spread over the past 3 days.
INSERT INTO public.kudos(id, sender_id, receiver_id, title, content, hashtags, image_urls, like_count, is_highlight, created_at) VALUES
  ('22222222-0000-0000-0000-000000000001',
    '11111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002',
    'IDOL GIỚI TRẺ',
    'Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn em sự chăm chỉ, cẩn mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống...',
    ARRAY['#Dedicated', '#Inspiring', '#TeamPlayer', '#Excellence', '#SunStar'],
    ARRAY['/award-top-talent.png', '/award-top-project.png', '/award-mvp.png', '/award-best-manager.png', '/award-signature.png'],
    1000, true, now() - interval '1 hour'),

  ('22222222-0000-0000-0000-000000000002',
    '11111111-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000004',
    'IDOL GIỚI TRẺ',
    'Bạn luôn mang lại năng lượng tích cực cho team. Những ý tưởng sáng tạo và cách tiếp cận vấn đề của bạn luôn làm tôi ngạc nhiên. Cảm ơn vì đã là một người đồng đội tuyệt vời!',
    ARRAY['#Dedicated', '#Inspiring', '#Innovation', '#BestTeam'],
    ARRAY['/award-top-talent.png', '/award-top-project.png', '/award-mvp.png'],
    980, true, now() - interval '3 hours'),

  ('22222222-0000-0000-0000-000000000003',
    '11111111-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002',
    'IDOL GIỚI TRẺ',
    'Sự chuyên nghiệp và kỹ năng lãnh đạo của bạn thật sự ấn tượng. Cảm ơn vì luôn dẫn dắt team vượt qua mọi thử thách một cách xuất sắc!',
    ARRAY['#Leadership', '#Dedicated', '#Excellence', '#Inspiring', '#SunStar'],
    ARRAY['/award-top-talent.png', '/award-mvp.png', '/award-signature.png'],
    920, true, now() - interval '5 hours'),

  ('22222222-0000-0000-0000-000000000004',
    '11111111-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001',
    'IDOL GIỚI TRẺ',
    'Cảm ơn bạn đã luôn đồng hành và hỗ trợ trong những thời điểm khó khăn nhất. Tinh thần không ngại thử thách của bạn là nguồn động lực tuyệt vời cho toàn bộ team.',
    ARRAY['#TeamWork', '#Dedicated', '#Champion', '#BestPartner', '#SunStar'],
    ARRAY['/award-top-talent.png', '/award-top-project.png'],
    870, true, now() - interval '8 hours'),

  ('22222222-0000-0000-0000-000000000005',
    '11111111-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000003',
    'CREATIVE SPARK',
    'Cảm ơn bạn vì đã chia sẻ những idea cực kỳ chất lượng cho campaign vừa qua. Sự sáng tạo của bạn là kim chỉ nam cho cả team marketing.',
    ARRAY['#Creative', '#Marketing', '#Inspiring'],
    ARRAY['/award-signature.png', '/award-top-project.png'],
    820, true, now() - interval '12 hours'),

  ('22222222-0000-0000-0000-000000000006',
    '11111111-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000008',
    'DESIGN HERO',
    'Design của bạn luôn vượt kỳ vọng. Cảm ơn vì đã làm cho mọi sản phẩm trở nên đẹp và truyền cảm hứng hơn rất nhiều.',
    ARRAY['#Design', '#Dedicated', '#Excellence'],
    ARRAY['/award-top-project.png'],
    650, false, now() - interval '1 day'),

  ('22222222-0000-0000-0000-000000000007',
    '11111111-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000005',
    'MENTOR APPRECIATION',
    'Cảm ơn anh đã dành thời gian mentor và chia sẻ kinh nghiệm. Những lời khuyên của anh đã giúp em trưởng thành rất nhiều trong năm qua.',
    ARRAY['#Mentor', '#Inspiring', '#Gratitude'],
    ARRAY[]::text[],
    520, false, now() - interval '1 day 4 hours'),

  ('22222222-0000-0000-0000-000000000008',
    '11111111-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000009',
    'COLLABORATION KING',
    'Cảm ơn bạn vì đã hỗ trợ team design rất nhiệt tình trong sprint vừa rồi. Tinh thần collab của bạn xứng đáng được vinh danh!',
    ARRAY['#TeamPlayer', '#Collaboration', '#Dedicated'],
    ARRAY['/award-best-manager.png', '/award-signature.png'],
    480, false, now() - interval '2 days'),

  ('22222222-0000-0000-0000-000000000009',
    '11111111-0000-0000-0000-00000000000a', '11111111-0000-0000-0000-000000000001',
    'ROCK SOLID',
    'Em làm việc cực kỳ chỉn chu, code clean và review rất tâm huyết. Cảm ơn vì đã giữ chất lượng codebase ở mức cao!',
    ARRAY['#CodeQuality', '#Dedicated', '#Excellence'],
    ARRAY[]::text[],
    410, false, now() - interval '2 days 6 hours'),

  ('22222222-0000-0000-0000-00000000000a',
    '11111111-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000006',
    'CAMPAIGN STAR',
    'Cảm ơn chị đã tin tưởng và giao cho em campaign quan trọng. Em học được rất nhiều từ cách chị làm việc với client.',
    ARRAY['#Marketing', '#Gratitude', '#Mentor'],
    ARRAY['/award-signature.png'],
    310, false, now() - interval '2 days 12 hours'),

  ('22222222-0000-0000-0000-00000000000b',
    '11111111-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000007',
    'NEW BLOOD',
    'Cảm ơn em đã hòa nhập rất nhanh và đóng góp tích cực ngay từ những ngày đầu. Welcome to the family!',
    ARRAY['#Welcome', '#Newcomer', '#TeamPlayer'],
    ARRAY[]::text[],
    220, false, now() - interval '3 days'),

  ('22222222-0000-0000-0000-00000000000c',
    '11111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-00000000000a',
    'PROBLEM SOLVER',
    'Bug cực hiểm hóc mà chị xử lý gọn trong một buổi sáng. Khâm phục skill debug của chị!',
    ARRAY['#Problem-Solver', '#Excellence', '#Dedicated'],
    ARRAY[]::text[],
    180, false, now() - interval '3 days 4 hours');
