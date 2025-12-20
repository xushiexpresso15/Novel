-- Allow authenticated users to calls this function
CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete the user from auth.users
  -- This will cascade to all other tables (profiles, novels, etc.)
  DELETE FROM auth.users
  WHERE id = auth.uid();
END;
$$;

-- IMPORTANT: Explicitly grant execute permission to logged-in users
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;
GRANT EXECUTE ON FUNCTION delete_own_account() TO service_role;
