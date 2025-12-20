-- Enable RLS on tables
ALTER TABLE novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ===========================
-- PROFILES POLICIES
-- ===========================
-- Everyone can see profiles (needed for Explore page to show author name)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ===========================
-- NOVELS POLICIES
-- ===========================
-- 1. Public Access: Anyone can see public novels
DROP POLICY IF EXISTS "Anyone can read public novels" ON novels;
CREATE POLICY "Anyone can read public novels" ON novels
  FOR SELECT USING (is_public = true);

-- 2. Owner Access: Authors can do everything with their own novels
DROP POLICY IF EXISTS "Authors can do everything with own novels" ON novels;
CREATE POLICY "Authors can do everything with own novels" ON novels
  FOR ALL USING (auth.uid() = user_id);

-- ===========================
-- CHAPTERS POLICIES
-- ===========================
-- 1. Public Access: Anyone can read chapters of public novels
-- We check if the parent novel is public.
DROP POLICY IF EXISTS "Anyone can read chapters of public novels" ON chapters;
CREATE POLICY "Anyone can read chapters of public novels" ON chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM novels
      WHERE novels.id = chapters.novel_id
      AND novels.is_public = true
    )
  );

-- 2. Owner Access: Authors can do everything with their own chapters
-- We check if the user owns the parent novel.
DROP POLICY IF EXISTS "Authors can do everything with own chapters" ON chapters;
CREATE POLICY "Authors can do everything with own chapters" ON chapters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM novels
      WHERE novels.id = chapters.novel_id
      AND novels.user_id = auth.uid()
    )
  );
