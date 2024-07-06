-- this file was manually created
INSERT INTO public.user (display_name, handle, cognito_user_id, created_at)
VALUES
  ('Andrew Brown', 'andrewbrown' ,'MOCK', current_timestamp),
  ('Andrew Bayko', 'bayko' ,'MOCK', current_timestamp);

INSERT INTO public.activity (user_id, message, expires_at, replies_count, reposts_count, likes_count)
VALUES
  (
    (SELECT id from public.user WHERE public.user.handle = 'andrewbrown' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day',
    0,
    0,
    0
  )