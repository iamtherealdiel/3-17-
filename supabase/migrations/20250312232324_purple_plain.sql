/*
  # Create Profiles Table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for users to:
      - Read their own profile
      - Update their own profile
    
  3. Automation
    - Add trigger to create profile on user signup
*/

-- Create a table for public profiles if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop view policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    DROP POLICY "Users can view own profile" ON profiles;
  END IF;

  -- Drop update policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    DROP POLICY "Users can update own profile" ON profiles;
  END IF;
END $$;

-- Create policies
CREATE POLICY "Users can view own profile" 
  ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Function to handle new user profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to handle new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();