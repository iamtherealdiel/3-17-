/*
  # Add Username Handle Support
  
  1. Changes
    - Add username column to auth.users metadata
    - Add unique constraint on username
    - Add username validation function
    - Update existing functions to use username
    - Add trigger to validate username format
  
  2. Purpose
    - Allow users to have unique @ handles
    - Ensure usernames follow proper format
    - Make user identification more human-readable
*/

-- Function to validate username format
CREATE OR REPLACE FUNCTION validate_username(username text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Username rules:
  -- 1. Must be 3-30 characters
  -- 2. Can only contain letters, numbers, and underscores
  -- 3. Must start with a letter
  -- 4. Cannot end with an underscore
  RETURN username ~ '^[a-zA-Z][a-zA-Z0-9_]{1,28}[a-zA-Z0-9]$';
END;
$$;

-- Function to ensure username uniqueness and format
CREATE OR REPLACE FUNCTION check_username()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  username text;
BEGIN
  -- Get username from metadata
  username := NEW.raw_user_meta_data->>'username';
  
  -- Validate username format
  IF username IS NOT NULL AND NOT validate_username(username) THEN
    RAISE EXCEPTION 'Invalid username format. Username must be 3-30 characters, start with a letter, and contain only letters, numbers, and underscores.';
  END IF;
  
  -- Check uniqueness
  IF username IS NOT NULL AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE raw_user_meta_data->>'username' = username 
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Username already taken';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for username validation
DROP TRIGGER IF EXISTS check_username_trigger ON auth.users;
CREATE TRIGGER check_username_trigger
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION check_username();

-- Update notification functions to support usernames
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

-- Function to get user's username
CREATE OR REPLACE FUNCTION get_username(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  username text;
BEGIN
  SELECT raw_user_meta_data->>'username'
  INTO username
  FROM auth.users
  WHERE id = user_id;
  
  RETURN username;
END;
$$;