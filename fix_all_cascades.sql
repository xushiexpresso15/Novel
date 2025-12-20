-- 1. Fix Chapters -> Users (The error you saw)
-- We need to tell database: "When a User is deleted, verify delete all their Chapters too"
ALTER TABLE chapters
DROP CONSTRAINT IF EXISTS chapters_user_id_fkey;

ALTER TABLE chapters
ADD CONSTRAINT chapters_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 2. Fix Novels -> Users
-- "When a User is deleted, delete all their Novels"
ALTER TABLE novels
DROP CONSTRAINT IF EXISTS novels_user_id_fkey;

ALTER TABLE novels
ADD CONSTRAINT novels_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 3. Fix Chapters -> Novels
-- "When a Novel is deleted, delete all its Chapters"
ALTER TABLE chapters
DROP CONSTRAINT IF EXISTS chapters_novel_id_fkey;

ALTER TABLE chapters
ADD CONSTRAINT chapters_novel_id_fkey
FOREIGN KEY (novel_id) REFERENCES novels(id)
ON DELETE CASCADE;
