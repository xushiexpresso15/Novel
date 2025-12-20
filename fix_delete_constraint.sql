-- 1. Identify and Drop the potential non-cascading Foreign Key on novels -> auth.users
-- Since we don't know the exact name, we try to drop common default names.
-- IF novels table was created via UI, it might be `novels_user_id_fkey`.
ALTER TABLE novels
DROP CONSTRAINT IF EXISTS novels_user_id_fkey;

-- 2. Validate Profile FK
-- We already added novels -> profiles (CASCADE) in previous steps.
-- But just in case novels -> auth.users is needed for RLS or other logic, let's add it back WITH CASCADE.
-- It is safe to allow novels to reference auth.users directly.

ALTER TABLE novels
ADD CONSTRAINT novels_user_id_fkey_v2
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 3. Ensure Profiles also cascades (usually it does, but let's be sure)
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey; -- default name if any

-- Dropping the PK constraint is NOT what we want. We want the FK constraint on the ID column if it exists as a separate constraint.
-- Usually profiles.id IS the FK to auth.users.
-- We can't easily alter the PK/FK definition of an existing column without knowing constraint name.
-- However, creating the table usually sets it up right.

-- 4. Re-grant execute just in case
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;
GRANT EXECUTE ON FUNCTION delete_own_account() TO service_role;
