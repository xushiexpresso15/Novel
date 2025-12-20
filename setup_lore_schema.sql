-- Create lore_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS lore_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    novel_id UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('character', 'location', 'item')),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE lore_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own lore items"
ON lore_items
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_lore_novel_id ON lore_items(novel_id);
