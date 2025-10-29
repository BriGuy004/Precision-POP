-- Remove hero_image_url and description columns, add tagline
ALTER TABLE public.retailers
DROP COLUMN IF EXISTS hero_image_url,
DROP COLUMN IF EXISTS description,
ADD COLUMN IF NOT EXISTS tagline TEXT;