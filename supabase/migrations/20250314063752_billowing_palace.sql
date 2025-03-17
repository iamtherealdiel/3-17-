/*
  # Update Application Status Handling
  
  1. Changes
    - Add function to handle application status updates
    - Update user metadata on approval/rejection
    - Reset onboarding status on rejection
  
  2. Purpose
    - Manage user access based on application status
    - Force rejected users to restart onboarding
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_application_status;

-- Create updated function with metadata handling
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
DECLARE
  v_user_id uuid;
  v_metadata jsonb;
BEGIN
  -- Verify admin privileges
  IF NOT (SELECT is_admin(admin_id)) THEN
    RAISE EXCEPTION 'Unauthorized: Admin privileges required';
  END IF;

  -- Get user_id from application
  SELECT user_id INTO v_user_id
  FROM user_requests
  WHERE id = application_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  -- Get current user metadata
  SELECT raw_user_meta_data INTO v_metadata
  FROM auth.users
  WHERE id = v_user_id;

  -- Update user metadata based on status
  IF new_status = 'approved' THEN
    -- For approved applications, mark onboarding as complete
    v_metadata = v_metadata || jsonb_build_object(
      'onboarding_complete', true,
      'application_status', 'approved'
    );
  ELSIF new_status = 'rejected' THEN
    -- For rejected applications, reset onboarding status
    v_metadata = v_metadata || jsonb_build_object(
      'onboarding_complete', false,
      'application_status', 'rejected'
    );
  END IF;

  -- Update user metadata
  UPDATE auth.users
  SET raw_user_meta_data = v_metadata
  WHERE id = v_user_id;

  -- Update the application status
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
  ) VALUES (
    admin_id,
    v_user_id,
    COALESCE(reason, 'Application status updated to: ' || new_status)
  );

  RETURN true;
END;
$$;