-- Remove accent_color column
ALTER TABLE public.retailers DROP COLUMN IF EXISTS accent_color;

-- Remove hero_image_url column  
ALTER TABLE public.retailers DROP COLUMN IF EXISTS hero_image_url;

-- Update storage RLS policies for brand-images bucket to fix upload security issue
DROP POLICY IF EXISTS "Public read access for brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete brand images" ON storage.objects;

-- Create storage policies for brand-images bucket
CREATE POLICY "Public read access for brand images"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-images');

CREATE POLICY "Authenticated users can upload brand images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update brand images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brand-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete brand images"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-images' AND auth.role() = 'authenticated');