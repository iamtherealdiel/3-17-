/*
  # Update Notifications System for Usernames
  
  1. Changes
    - Update create_notification function to use usernames
    - Add username validation
    - Update notification creation logic
  
  2. Purpose
    - Support @ usernames instead of user IDs
    - Maintain backward compatibility
    - Improve user experience
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_notification;

-- Create updated function that uses username
CREATE OR REPLACE FUNCTION create_notification(
  p_username text,
  p_title text,
  p_content text,
  p_type text DEFAULT 'info'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_notification_id uuid;
BEGIN
  -- Get user ID from username
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE raw_user_meta_data->>'username' = p_username;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found with username: %', p_username;
  END IF;

  -- Create notification
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type
  ) VALUES (
    v_user_id,
    p_title,
    p_content,
    p_type
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION create_notification IS 'Creates a notification for a user using their username';