-- Allow users to delete their own account
-- This function deletes the user from auth.users, which should cascade to profiles/novels if foreign keys are set up correctly.

CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users
  WHERE id = auth.uid();
END;
$$;
