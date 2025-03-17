/*
  # Fix Username Handling
  
  1. Changes
    - Make username optional in user metadata
    - Update username validation to be more permissive
    - Fix user creation trigger
  
  2. Purpose
    - Allow users to sign up without immediate username requirement
    - Fix database errors during user creation
*/

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS check_username_trigger ON auth.users;
DROP FUNCTION IF EXISTS check_username();
DROP FUNCTION IF EXISTS validate_username();

-- Create updated username validation function
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
  RETURN username IS NULL OR username ~ '^[a-zA-Z][a-zA-Z0-9_]{1,28}[a-zA-Z0-9]$';
END;
$$;

-- Create updated username check function
CREATE OR REPLACE FUNCTION check_username()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  username text;
BEGIN
  -- Get username from metadata if it exists
  username := NEW.raw_user_meta_data->>'username';
  
  -- Skip validation if no username is set
  IF username IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Validate username format
  IF NOT validate_username(username) THEN
    RAISE EXCEPTION 'Invalid username format. Username must be 3-30 characters, start with a letter, and contain only letters, numbers, and underscores.';
  END IF;
  
  -- Check uniqueness only if username is provided
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE raw_user_meta_data->>'username' = username 
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Username already taken';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create new trigger for username validation
CREATE TRIGGER check_username_trigger
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION check_username();

-- Update notification function to handle null usernames
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
  IF p_username IS NOT NULL THEN
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE raw_user_meta_data->>'username' = p_username;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'User not found with username: %', p_username;
    END IF;
  END IF;

  -- Create notification
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type
  ) VALUES (
    COALESCE(v_user_id, auth.uid()),
    p_title,
    p_content,
    p_type
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;