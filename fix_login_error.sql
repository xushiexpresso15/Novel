-- 1. Clean up "Ghost Profiles" (Profiles whose user no longer exists in Auth)
-- This fixes the "Primary Key Constraint" error if you are trying to re-register.
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- 2. Make the Trigger Robust (Smart Handling)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  _username text;
BEGIN
  -- Get name from Google metadata
  _username := new.raw_user_meta_data->>'full_name';

  -- Fallback if name is missing or too short (avoids char_length check failure)
  IF _username IS NULL OR char_length(_username) < 3 THEN
     _username := 'User_' || substr(new.id::text, 1, 8);
  END IF;

  -- Insert profile, but if it already exists (ghost data), update it instead of crashing
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (new.id, _username, new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO UPDATE
  SET
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
