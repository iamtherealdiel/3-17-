/*
  # Create Form Submissions Table

  1. New Tables
    - `form_submissions`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `message` (text, not null)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for:
      - Admins to read all submissions
      - Anonymous users to submit forms
    
  3. Performance
    - Add index on email column for faster lookups
*/

-- Create form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop admin read policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'form_submissions' 
    AND policyname = 'Admins can read all form submissions'
  ) THEN
    DROP POLICY "Admins can read all form submissions" ON form_submissions;
  END IF;

  -- Drop anonymous insert policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'form_submissions' 
    AND policyname = 'Anyone can submit contact forms'
  ) THEN
    DROP POLICY "Anyone can submit contact forms" ON form_submissions;
  END IF;
END $$;

-- Create policies
CREATE POLICY "Admins can read all form submissions"
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'supabase_admin');

CREATE POLICY "Anyone can submit contact forms"
  ON form_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email ON form_submissions(email);