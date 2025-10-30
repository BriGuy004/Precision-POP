-- Add new columns to recipes table
ALTER TABLE public.recipes
ADD COLUMN IF NOT EXISTS prep_time INTEGER,
ADD COLUMN IF NOT EXISTS cook_time INTEGER,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Copy data from old column to new column
UPDATE public.recipes SET image_url = image WHERE image IS NOT NULL;

-- Drop the old image column
ALTER TABLE public.recipes DROP COLUMN IF EXISTS image;

-- Drop the old ready_in_minutes column since we now have prep_time and cook_time
ALTER TABLE public.recipes DROP COLUMN IF EXISTS ready_in_minutes;