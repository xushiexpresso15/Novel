-- Add description column to novels table
ALTER TABLE novels 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'novels' AND column_name = 'description';
