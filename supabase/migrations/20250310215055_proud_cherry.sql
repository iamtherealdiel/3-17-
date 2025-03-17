/*
  # Add version function
  
  1. New Functions
    - `version()`: Returns the current version of the application
      - Returns: text
      - No parameters required
      - Accessible to all authenticated users
*/

-- Create version function that returns a static version string
CREATE OR REPLACE FUNCTION version()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT '1.0.0'::text;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION version() TO authenticated;
GRANT EXECUTE ON FUNCTION version() TO anon;