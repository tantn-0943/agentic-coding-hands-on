-- Add anonymous fields to kudos table for Viết Kudo feature
-- Migration: 20260318000000_add_kudos_anonymous_fields

ALTER TABLE kudos ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;
ALTER TABLE kudos ADD COLUMN IF NOT EXISTS anonymous_name TEXT;

-- Storage bucket for kudos images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kudos-images',
  'kudos-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated users can upload to their own folder
CREATE POLICY "kudos_images_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'kudos-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Public read access for displaying images
CREATE POLICY "kudos_images_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'kudos-images');

-- Allow users to delete their own uploaded images
CREATE POLICY "kudos_images_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'kudos-images' AND (storage.foldername(name))[1] = auth.uid()::text);
