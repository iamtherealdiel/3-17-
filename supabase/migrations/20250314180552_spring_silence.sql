/*
  # Add Notifications Table and Functions
  
  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `type` (text)
      - `read` (boolean)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for users to:
      - View their own notifications
      - Mark notifications as read
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their notifications as read"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    -- Only allow updating read status
    read = true AND
    xmin = xmin
  );

-- Create index for faster lookups
CREATE INDEX idx_notifications_user_id_created_at 
ON notifications(user_id, created_at DESC);

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET read = true
  WHERE id = notification_id
  AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_title text,
  p_content text,
  p_type text DEFAULT 'info'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type
  ) VALUES (
    p_user_id,
    p_title,
    p_content,
    p_type
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;