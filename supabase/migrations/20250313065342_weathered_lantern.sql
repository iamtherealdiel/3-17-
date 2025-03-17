/*
  # Add YouTube Links Array Column

  1. Changes
    - Add youtube_links array column to user_requests table
  
  2. Purpose
    - Store multiple YouTube channel URLs per user request
    - Support channel management and music partner program features
*/

-- Add youtube_links array column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_requests' 
    AND column_name = 'youtube_links'
  ) THEN
    ALTER TABLE user_requests 
    ADD COLUMN youtube_links text[] DEFAULT '{}';
  END IF;
END $$;