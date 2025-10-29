-- God mode: Allow unauthenticated uploads for development
DROP POLICY IF EXISTS "Public read access for brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete brand images" ON storage.objects;

-- Public read access
CREATE POLICY "Public read access for brand images"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-images');

-- Public upload (god mode - no auth required)
CREATE POLICY "Anyone can upload brand images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-images');

-- Public update
CREATE POLICY "Anyone can update brand images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brand-images');

-- Public delete
CREATE POLICY "Anyone can delete brand images"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-images');