/*
  # Add version function
  
  1. New Functions
    - `version()`: Returns the current application version
      - Returns: text
      - No parameters required
      - Accessible to all authenticated and anonymous users
  
  2. Security
    - Function is created in the public schema
    - Execute permission granted to public role
*/

-- Create the version function
CREATE OR REPLACE FUNCTION public.version()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT '1.0.0'::text;
$$;

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION public.version() TO public;

-- Add comment for documentation
COMMENT ON FUNCTION public.version() IS 'Returns the current application version';