-- Ensure profiles table exists (it should)
-- Add RLS policies

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING ( auth.uid() = id );

-- Policy: Public can view all profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles
    FOR SELECT
    USING ( true );

-- Policy: Users can insert their own profile (usually handled by trigger, but just in case)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK ( auth.uid() = id );
