/*
  # Add Application Status Check Function
  
  1. New Functions
    - `check_application_status`: Returns the status of a user's application
      - Parameters:
        - user_id (uuid): The ID of the user to check
      - Returns: text (the application status)
  
  2. Purpose
    - Allow checking if a user's application has been approved or rejected
    - Used to control access to dashboard until admin decision
*/

-- Function to check application status
CREATE OR REPLACE FUNCTION check_application_status(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  app_status text;
BEGIN
  SELECT status INTO app_status
  FROM user_requests
  WHERE user_id = $1
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN COALESCE(app_status, 'none');
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_application_status TO authenticated;