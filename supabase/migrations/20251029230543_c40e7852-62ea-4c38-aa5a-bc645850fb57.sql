-- Add back hero_image_url column for background images in cards
ALTER TABLE public.retailers
ADD COLUMN IF NOT EXISTS hero_image_url TEXT;