-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Creating Policies
-- 1. Users can view messages where they are the sender OR the recipient
CREATE POLICY "Users can view their own messages"
ON messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- 2. Users can insert messages where they are the sender
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- 3. Users can update messages where they are the recipient (e.g. mark as read)
CREATE POLICY "Recipients can update messages"
ON messages FOR UPDATE
USING (auth.uid() = recipient_id);

-- 4. Users can delete their own sent messages or messages received (optional, maybe just hide?)
-- Letting them delete for now
CREATE POLICY "Users can delete their own messages"
ON messages FOR DELETE
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
