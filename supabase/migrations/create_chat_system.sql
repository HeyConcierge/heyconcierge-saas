-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT,
  user_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'escalated', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  escalated_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai', 'human')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chats_status ON chats(status);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at DESC);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats
-- Public can create chats (for anonymous users)
CREATE POLICY "Anyone can create chats"
ON chats
FOR INSERT
TO public
WITH CHECK (true);

-- Public can read their own chats (by email if provided)
CREATE POLICY "Users can read own chats"
ON chats
FOR SELECT
TO public
USING (user_email = current_setting('request.jwt.claims', true)::json->>'email' OR user_email IS NULL);

-- Authenticated users (team) can read all chats
CREATE POLICY "Team can read all chats"
ON chats
FOR SELECT
TO authenticated
USING (true);

-- Team can update chats
CREATE POLICY "Team can update chats"
ON chats
FOR UPDATE
TO authenticated
USING (true);

-- RLS Policies for messages
-- Public can insert messages (for user chat messages)
CREATE POLICY "Anyone can insert messages"
ON messages
FOR INSERT
TO public
WITH CHECK (true);

-- Public can read messages from their chats
CREATE POLICY "Users can read messages from their chats"
ON messages
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND (chats.user_email = current_setting('request.jwt.claims', true)::json->>'email' OR chats.user_email IS NULL)
  )
);

-- Team can read all messages
CREATE POLICY "Team can read all messages"
ON messages
FOR SELECT
TO authenticated
USING (true);

-- Create function to get unread chat count for team
CREATE OR REPLACE FUNCTION get_unread_chats_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM chats
    WHERE status IN ('active', 'escalated')
    AND created_at > NOW() - INTERVAL '7 days'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
