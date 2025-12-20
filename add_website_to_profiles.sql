-- Add website column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS website text;

-- Update the handle_new_user function to include website if we want to default it (optional, usually null is fine)
-- No change needed for trigger if we just allow nulls.

-- Grant access if needed (usually authenticated users can read/update their own)
-- Existing policies should cover update if it's "update own profile".
-- Existing policies for select should cover "public can view".
