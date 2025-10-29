-- Create retailers table for white-label grocery brands
CREATE TABLE IF NOT EXISTS retailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  hero_image_url TEXT NOT NULL,
  primary_color TEXT DEFAULT '142 71% 45%',
  accent_color TEXT DEFAULT '25 95% 53%',
  city TEXT,
  state TEXT,
  website TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_retailers_retailer_id ON retailers(retailer_id);
CREATE INDEX IF NOT EXISTS idx_retailers_is_active ON retailers(is_active);

-- Enable RLS
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;

-- Public read access (customers need to see branding)
CREATE POLICY "Anyone can view retailers"
ON retailers FOR SELECT
USING (true);

-- Authenticated users can manage retailers
CREATE POLICY "Authenticated users can insert retailers"
ON retailers FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update retailers"
ON retailers FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete retailers"
ON retailers FOR DELETE
TO authenticated
USING (true);

-- Create storage bucket for brand images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('brand-images', 'brand-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Public can view brand images"
ON storage.objects FOR SELECT
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

-- Create trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_retailers_updated_at
BEFORE UPDATE ON retailers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert HEB as default active brand
INSERT INTO retailers (retailer_id, name, logo_url, hero_image_url, primary_color, accent_color, city, state, website, is_active)
VALUES (
  'heb',
  'H-E-B',
  'https://corporate.heb.com/themes/custom/heb/assets/images/heb-logo.svg',
  'https://images.heb.com/is/image/HEBGrocery/LP-Hero-Store',
  '142 71% 45%',
  '25 95% 53%',
  'San Antonio',
  'Texas',
  'https://www.heb.com',
  true
)
ON CONFLICT (retailer_id) DO NOTHING;

-- Insert Kroger
INSERT INTO retailers (retailer_id, name, logo_url, hero_image_url, primary_color, accent_color, city, state, website, is_active)
VALUES (
  'kroger',
  'Kroger',
  'https://www.kroger.com/content/v2/binary/image/fetch/aHR0cHM6Ly9pLTVjZG4uY29tL2tyb2dlci9sb2dvLnBuZw==',
  'https://www.kroger.com/content/v2/binary/image/hero-store.jpg',
  '210 100% 25%',
  '210 100% 45%',
  'Cincinnati',
  'Ohio',
  'https://www.kroger.com',
  false
)
ON CONFLICT (retailer_id) DO NOTHING;