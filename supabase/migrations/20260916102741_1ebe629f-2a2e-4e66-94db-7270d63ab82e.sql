ALTER TABLE public.upcoming_activities
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Community',
  ADD COLUMN IF NOT EXISTS image_url text;