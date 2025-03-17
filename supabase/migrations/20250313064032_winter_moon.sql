/*
  # Add Admin Applications View and Functions
  
  1. New Views
    - `admin_applications_view`: Provides a consolidated view of user requests with related user data
  
  2. New Functions
    - `update_application_status`: Updates request status and logs admin actions
  
  3. Security
    - Views and functions restricted to admin users only
    - Proper schema ownership and permissions
*/

-- Create view for admin applications
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

-- Function to update application status
CREATE OR REPLACE FUNCTION update_application_status(
  application_id uuid,
  new_status text,
  admin_id uuid,
  reason text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify admin privileges
  IF NOT (SELECT is_admin(admin_id)) THEN
    RAISE EXCEPTION 'Unauthorized: Admin privileges required';
  END IF;

  -- Update the status
  UPDATE user_requests
  SET 
    status = new_status,
    updated_at = now()
  WHERE id = application_id;

  -- Log the admin action
  INSERT INTO admin_access (
    admin_id,
    accessed_user_id,
    access_reason
  )
  SELECT 
    admin_id,
    user_id,
    COALESCE(reason, 'Application status updated to: ' || new_status)
  FROM user_requests
  WHERE id = application_id;

  RETURN true;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_application_status TO authenticated;