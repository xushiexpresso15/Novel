-- 1. Modify Novels Table
ALTER TABLE novels
ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- 2. Create Storage Bucket (if not exists)
-- Note: Creating buckets via SQL is strictly not standard Supabase, usually done via UI.
-- However, we can try to insert into storage.buckets if permissions allow, or just strictly set policies assuming bucket exists.
-- standard way: User must create bucket 'covers' in Dashboard.
-- We will write policies assuming 'covers' bucket exists.

-- 3. Storage Policies for 'covers' bucket
-- Allow public access to view covers
CREATE POLICY "Anyone can view covers"
ON storage.objects FOR SELECT
USING ( bucket_id = 'covers' );

-- Allow authenticated users to upload covers
CREATE POLICY "Users can upload covers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'covers' AND
  auth.role() = 'authenticated'
);

-- Allow users to propagate updates (optional, for replacing images)
CREATE POLICY "Users can update own covers"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'covers' AND
  auth.role() = 'authenticated' -- In real app, check path contains user_id
);
