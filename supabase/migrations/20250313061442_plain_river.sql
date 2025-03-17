/*
  # Add Digital Rights Fields

  1. Changes
    - Add website column to user_requests table
    - Add youtube_channel column to user_requests table
  
  2. Purpose
    - Support digital rights management requests with website and channel info
*/

-- Add new columns for digital rights
ALTER TABLE user_requests 
ADD COLUMN website text,
ADD COLUMN youtube_channel text;