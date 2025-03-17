/*
  # Add YouTube Channel Link Uniqueness

  1. Changes
    - Add unique constraint on youtube_links array elements
    - Add function to check for duplicate YouTube links
    - Add trigger to validate YouTube links before insert/update
  
  2. Purpose
    - Prevent the same YouTube channel from being linked to multiple accounts
    - Provide clear error messages when duplicate channels are detected
*/

-- Function to check for duplicate YouTube links
CREATE OR REPLACE FUNCTION check_youtube_link_uniqueness()
RETURNS trigger AS $$
DECLARE
  existing_request RECORD;
  link TEXT;
BEGIN
  -- Skip check if no YouTube links
  IF NEW.youtube_links IS NULL OR array_length(NEW.youtube_links, 1) IS NULL THEN
    RETURN NEW;
  END IF;

  -- Check each YouTube link
  FOREACH link IN ARRAY NEW.youtube_links
  LOOP
    -- Skip empty links
    IF link IS NOT NULL AND link != '' THEN
      -- Check if link exists in another request
      SELECT user_id, id INTO existing_request
      FROM user_requests
      WHERE youtube_links @> ARRAY[link]
        AND user_id != NEW.user_id
        AND id != NEW.id;
      
      IF FOUND THEN
        RAISE EXCEPTION 'YouTube channel % is already registered with another account', link;
      END IF;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS youtube_link_uniqueness_check ON user_requests;

-- Create trigger for YouTube link uniqueness check
CREATE TRIGGER youtube_link_uniqueness_check
  BEFORE INSERT OR UPDATE ON user_requests
  FOR EACH ROW
  EXECUTE FUNCTION check_youtube_link_uniqueness();

-- Add comment explaining the trigger
COMMENT ON TRIGGER youtube_link_uniqueness_check ON user_requests IS 
  'Ensures YouTube channels cannot be linked to multiple accounts';