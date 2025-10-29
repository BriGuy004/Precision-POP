-- Fix storage policies for brand-images bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload brand images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete brand images" ON storage.objects;

-- Create new policies for brand-images bucket
CREATE POLICY "Anyone can view brand images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'brand-images');

CREATE POLICY "Authenticated users can upload brand images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'brand-images');

CREATE POLICY "Authenticated users can update brand images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'brand-images');

CREATE POLICY "Authenticated users can delete brand images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'brand-images');