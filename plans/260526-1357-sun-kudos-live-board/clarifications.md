# Sun* Kudos Live Board — Clarifications

## Session 2026-05-26

- Q: Scope cho session này — Supabase nên cover bao nhiêu phần dynamic? → A: Read-only MVP (schema + seed + reads). Send-Kudos / Like-persist / Secret Box = no-op.
- Q: Image storage cho gallery row? → A: Defer — mock URLs only. Schema có `image_urls text[]`, seed dùng ảnh có sẵn `/public/award-*.png`.
- Q: Hashtag dùng kiểu nào? → A: Free-form, parse `#xxx` từ content, lưu `hashtags text[]`. Filter dropdown query distinct từ DB.
- Q: User profile (full_name, department, avatar) — lấy ở đâu? → A: Bảng `profiles` mới + `departments` ref table + seed 10-15 user giả.
