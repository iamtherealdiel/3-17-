/*
  # Check and Add Rejection Reason Column
  
  1. Changes
    - Safely check for rejection_reason column
    - Add column only if it doesn't exist
  
  2. Purpose
    - Ensure rejection_reason column exists without errors
    - Handle cases where column may already exist
*/

DO $$ 
BEGIN
  -- Check if column exists before trying to add it
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_requests' 
    AND column_name = 'rejection_reason'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE user_requests 
    ADD COLUMN rejection_reason text;
  END IF;
END $$;