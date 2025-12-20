-- Add is_published column to chapters table if it doesn't exist
ALTER TABLE chapters 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

-- Enable Row Level Security (RLS) on chapters table
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Policy 1: Novel Owners can do everything on their own chapters
DROP POLICY IF EXISTS "Owners can do everything on chapters" ON chapters;
CREATE POLICY "Owners can do everything on chapters"
ON chapters
FOR ALL
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

-- Policy 2: Everyone can view published chapters
DROP POLICY IF EXISTS "Public can view published chapters" ON chapters;
CREATE POLICY "Public can view published chapters"
ON chapters
FOR SELECT
USING (
  is_published = true
);
