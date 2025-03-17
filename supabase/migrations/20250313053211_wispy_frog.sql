/*
  # Add YouTube Links Array Column

  1. Changes
    - Add youtube_links array column to user_requests table
    - Migrate existing youtube_link data to new array column
    - Drop old youtube_link column
  
  2. Purpose
    - Support multiple YouTube channel URLs per user request
*/

-- Add new array column
ALTER TABLE user_requests 
ADD COLUMN youtube_links text[] DEFAULT '{}';

-- Migrate existing data
UPDATE user_requests 
SET youtube_links = ARRAY[youtube_link]
WHERE youtube_link IS NOT NULL AND youtube_link != '';

-- Drop old column
ALTER TABLE user_requests 
DROP COLUMN youtube_link;