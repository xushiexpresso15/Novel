import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://owehtfxlpgoejooqpmpe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZWh0ZnhscGdvZWpvb3FwbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDgxODQsImV4cCI6MjA4MTcyNDE4NH0.CrG8cObuDsTsBbWDF2jp3ix6v2YPbqpuvP6hbWrHW-Y'

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
)
