/*
  # Add Admin Access Tracking and Secure IDs
  
  1. New Functions
    - `generate_secure_identifier()`: Generates unique IDs for users
    - `handle_new_user()`: Adds secure ID to new users
    - `is_admin()`: Verifies admin status
    - `get_user_by_secure_id()`: Safely retrieves user data
  
  2. New Tables
    - `admin_access`: Tracks admin access to user data
  
  3. Security
    - Enable RLS on admin_access table
    - Add policies for admin access
    - Update existing users with roles and secure IDs
*/

-- Create a function to generate a unique identifier
CREATE OR REPLACE FUNCTION public.generate_secure_identifier()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id text;
  is_unique boolean := false;
BEGIN
  WHILE NOT is_unique LOOP
    new_id := 
      encode(gen_random_bytes(16), 'hex') || 
      '_' || 
      regexp_replace(
        encode(gen_random_bytes(8), 'base64'), 
        '[^a-zA-Z0-9,._-]', 
        '', 
        'g'
      );
    
    new_id := substring(new_id, 1, 64);
    
    SELECT NOT EXISTS (
      SELECT 1 FROM auth.users WHERE raw_user_meta_data->>'secure_id' = new_id
    ) INTO is_unique;
  END LOOP;

  RETURN new_id;
END;
$$;

-- Create admin_access table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id),
  accessed_user_id uuid NOT NULL REFERENCES auth.users(id),
  accessed_at timestamptz NOT NULL DEFAULT now(),
  access_reason text
);

-- Enable RLS on admin_access table
ALTER TABLE public.admin_access ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_access' 
    AND policyname = 'Admin users can view access logs'
  ) THEN
    DROP POLICY "Admin users can view access logs" ON admin_access;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_access' 
    AND policyname = 'Admin users can log access'
  ) THEN
    DROP POLICY "Admin users can log access" ON admin_access;
  END IF;
END $$;

-- Create policies
CREATE POLICY "Admin users can view access logs" 
  ON public.admin_access
  FOR SELECT 
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));

CREATE POLICY "Admin users can log access" 
  ON public.admin_access
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create function to add secure_id to new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  secure_id text;
BEGIN
  secure_id := public.generate_secure_identifier();
  
  NEW.raw_user_meta_data := 
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('secure_id', secure_id);
    
  RETURN NEW;
END;
$$;

-- Create trigger to add secure_id to new users
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to verify if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$;

-- Function to safely get a user by secure_id (admin only)
CREATE OR REPLACE FUNCTION public.get_user_by_secure_id(
  secure_id text,
  admin_id uuid,
  reason text DEFAULT 'Admin lookup'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record auth.users%ROWTYPE;
  result json;
BEGIN
  IF NOT public.is_admin(admin_id) THEN
    RAISE EXCEPTION 'Unauthorized access: admin privileges required';
  END IF;

  SELECT * INTO user_record
  FROM auth.users
  WHERE raw_user_meta_data->>'secure_id' = secure_id;

  IF user_record IS NULL THEN
    RETURN json_build_object('error', 'User not found with provided secure ID');
  END IF;

  INSERT INTO public.admin_access (
    admin_id, 
    accessed_user_id, 
    access_reason
  ) VALUES (
    admin_id, 
    user_record.id, 
    reason
  );

  RETURN json_build_object(
    'id', user_record.id,
    'email', user_record.email,
    'created_at', user_record.created_at,
    'user_metadata', user_record.raw_user_meta_data - 'secure_id',
    'last_sign_in_at', user_record.last_sign_in_at,
    'confirmed_at', user_record.confirmed_at
  );
END;
$$;

-- Update existing users' metadata
DO $$
BEGIN
  -- Add 'user' role to users without a role
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE
      WHEN raw_user_meta_data IS NULL OR NOT (raw_user_meta_data ? 'role') 
      THEN COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'user')
      ELSE raw_user_meta_data
    END
  WHERE raw_user_meta_data IS NULL OR NOT (raw_user_meta_data ? 'role');
  
  -- Add secure_id to users without one
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE
      WHEN raw_user_meta_data IS NULL OR NOT (raw_user_meta_data ? 'secure_id') 
      THEN COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('secure_id', public.generate_secure_identifier())
      ELSE raw_user_meta_data
    END
  WHERE raw_user_meta_data IS NULL OR NOT (raw_user_meta_data ? 'secure_id');
END
$$;