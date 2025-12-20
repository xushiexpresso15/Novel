-- Run this in your Supabase SQL Editor to update the novels table schema

ALTER TABLE novels 
ADD COLUMN IF NOT EXISTS genre TEXT DEFAULT '未分類',
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'novels';
