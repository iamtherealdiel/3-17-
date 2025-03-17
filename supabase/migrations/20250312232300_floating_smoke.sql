/*
  # Create User Requests Table

  1. New Tables
    - `user_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `interests` (text[], stores selected interests)
      - `other_interest` (text, optional custom interest)
      - `name` (text, user's full name)
      - `email` (text, user's email)
      - `youtube_link` (text, optional channel URL)
      - `status` (text, request status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for users to:
      - Create their own requests
      - View their own requests
      - Update their own requests
*/

-- Create user_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interests text[] NOT NULL,
  other_interest text,
  name text NOT NULL,
  email text NOT NULL,
  youtube_link text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable row level security
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop create policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_requests' 
    AND policyname = 'Users can create their own requests'
  ) THEN
    DROP POLICY "Users can create their own requests" ON user_requests;
  END IF;

  -- Drop view policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_requests' 
    AND policyname = 'Users can view their own requests'
  ) THEN
    DROP POLICY "Users can view their own requests" ON user_requests;
  END IF;

  -- Drop update policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_requests' 
    AND policyname = 'Users can update their own requests'
  ) THEN
    DROP POLICY "Users can update their own requests" ON user_requests;
  END IF;
END $$;

-- Create policies
CREATE POLICY "Users can create their own requests"
  ON user_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own requests"
  ON user_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests"
  ON user_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_modified_column() CASCADE;

-- Create function to automatically update updated_at field
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_user_requests_modified ON user_requests;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_user_requests_modified
  BEFORE UPDATE ON user_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();