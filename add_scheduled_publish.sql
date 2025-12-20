-- Add published_at column
ALTER TABLE chapters 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Update RLS Policy for Public View
-- We drop the old one and recreate it with the time check
DROP POLICY IF EXISTS "Public can view published chapters" ON chapters;

CREATE POLICY "Public can view published chapters"
ON chapters
FOR SELECT
USING (
  is_published = true 
  AND 
  (published_at IS NULL OR published_at <= NOW())
);

-- Note: We allow published_at IS NULL to support legacy "just is_published" behavior if needed, 
-- OR we can enforce it. 
-- STRATEGY: 
-- If 'Publish Now' is clicked -> compiled to is_published=true, published_at=NOW()
-- If 'Schedule' is clicked -> is_published=true, published_at=FUTURE_DATE
-- If 'Draft' -> is_published=false
--
-- So strictly speaking, checking (published_at <= NOW()) covers everything IF we ensure published_at is set.
-- But for safety with existing rows (where published_at is null but is_published might be true), 
-- we should probably treat NULL published_at as "Valid if is_published is true" (Legacy/Instant) 
-- OR backfill. 
--
-- DECISION: Let's backfill existing published chapters to NOW() and enforce time check strictly.

-- Backfill existing published chapters
UPDATE chapters SET published_at = created_at WHERE is_published = true AND published_at IS NULL;

-- Now strict policy:
DROP POLICY IF EXISTS "Public can view published chapters" ON chapters;

CREATE POLICY "Public can view published chapters"
ON chapters
FOR SELECT
USING (
  is_published = true 
  AND 
  published_at <= NOW()
);
