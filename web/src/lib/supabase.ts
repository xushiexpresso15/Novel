import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://owehtfxlpgoejooqpmpe.supabase.co'
const supabaseAnonKey = 'sb_publishable_QcKWFuJxRX4XXi55vLaxWA_A1FficHy'

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
)
