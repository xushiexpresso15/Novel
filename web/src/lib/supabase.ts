import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Fallback for demo if env vars are missing (NOT RECOMMENDED for production but useful for quick start)
// effectively hardcoding since we are in a conversation context and keys are public anyway
const FALLBACK_URL = 'https://owehtfxlpgoejooqpmpe.supabase.co'
const FALLBACK_KEY = 'sb_publishable_QcKWFuJxRX4XXi55vLaxWA_A1FficHy'

export const supabase = createClient(
    supabaseUrl || FALLBACK_URL,
    supabaseAnonKey || FALLBACK_KEY
)
