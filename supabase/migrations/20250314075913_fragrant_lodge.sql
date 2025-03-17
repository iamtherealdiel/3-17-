/*
  # Create Messages Table and Storage

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references auth.users)
      - `receiver_id` (uuid, references auth.users)
      - `content` (text)
      - `image_url` (text, optional)
      - `created_at` (timestamptz)
      - `read_at` (timestamptz, optional)

  2. Security
    - Enable RLS
    - Add policies for:
      - Sending messages
      - Reading own messages
      - Marking messages as read
    
  3. Storage
    - Create bucket for message images
    - Set up storage policies
*/

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  read_at timestamptz,
  CONSTRAINT valid_message CHECK (
    content IS NOT NULL AND content != ''
  )
);

-- Enable RLS if not already enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop send policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Users can send messages'
  ) THEN
    DROP POLICY "Users can send messages" ON messages;
  END IF;

  -- Drop read policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Users can read their own messages'
  ) THEN
    DROP POLICY "Users can read their own messages" ON messages;
  END IF;

  -- Drop update policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Users can mark messages as read'
  ) THEN
    DROP POLICY "Users can mark messages as read" ON messages;
  END IF;
END $$;

-- Create policies
CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can read their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (sender_id, receiver_id));

-- Create function to mark message as read
CREATE OR REPLACE FUNCTION mark_message_read(message_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE messages
  SET read_at = now()
  WHERE id = message_id
  AND receiver_id = auth.uid()
  AND read_at IS NULL;
  
  RETURN FOUND;
END;
$$;

-- Create policy for updating read status
CREATE POLICY "Users can mark messages as read"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = receiver_id
  )
  WITH CHECK (
    -- Only allow updating read_at field
    read_at IS NOT NULL AND
    read_at > created_at
  );

-- Create indexes for faster message lookups
DROP INDEX IF EXISTS idx_messages_participants;
DROP INDEX IF EXISTS idx_messages_created_at;

CREATE INDEX idx_messages_participants 
ON messages(sender_id, receiver_id);

CREATE INDEX idx_messages_created_at 
ON messages(created_at DESC);

-- Create bucket for message images if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('message-images', 'message-images')
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DO $$ 
BEGIN
  -- Drop upload policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Users can upload message images'
  ) THEN
    DROP POLICY "Users can upload message images" ON storage.objects;
  END IF;

  -- Drop view policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Users can view message images'
  ) THEN
    DROP POLICY "Users can view message images" ON storage.objects;
  END IF;
END $$;

-- Set up storage policy for message images
CREATE POLICY "Users can upload message images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view message images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'message-images');