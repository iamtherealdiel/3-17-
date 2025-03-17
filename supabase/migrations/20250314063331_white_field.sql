/*
  # Update Admin Applications View
  
  1. Changes
    - Drop existing admin_applications_view
    - Create updated view with youtube_links array
  
  2. Purpose
    - Include YouTube channel links in admin view
    - Ensure all application data is properly displayed
*/

-- Drop the existing view if it exists
DROP VIEW IF EXISTS admin_applications_view;

-- Create updated view with youtube_links
CREATE VIEW admin_applications_view AS
SELECT 
  ur.id,
  ur.user_id,
  ur.interests,
  ur.other_interest,
  ur.name,
  ur.email,
  ur.youtube_channel,
  ur.website,
  ur.youtube_links,
  ur.status,
  ur.created_at,
  ur.updated_at,
  u.raw_user_meta_data->>'verification_code' as verification_code,
  u.email as user_email,
  u.created_at as user_created_at
FROM user_requests ur
JOIN auth.users u ON ur.user_id = u.id;

-- Grant permissions to authenticated users
GRANT SELECT ON admin_applications_view TO authenticated;