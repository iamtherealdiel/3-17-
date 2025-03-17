/*
  # Create database schema helper functions

  1. New Functions
    - `get_tables` - Returns a list of tables in the public schema
    - `get_table_columns` - Returns column information for a specific table
    - `get_table_policies` - Returns RLS policy information for a specific table
    - `get_table_relationships` - Returns foreign key relationships for a specific table
  
  2. Purpose
    - These functions provide metadata about the database schema
    - They help visualize and explore the database structure
    - Used by the schema viewer component
*/

-- Function to get list of tables in the public schema
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE (
  table_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.tablename::text 
  FROM pg_tables t
  WHERE t.schemaname = 'public'
  ORDER BY t.tablename;
END;
$$ LANGUAGE plpgsql;

-- Function to get columns for a specific table
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable text,
  column_default text,
  is_identity text,
  is_primary boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text,
    c.is_identity::text,
    CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as is_primary
  FROM 
    information_schema.columns c
  LEFT JOIN (
    SELECT 
      kcu.column_name 
    FROM 
      information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    WHERE 
      tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_name = table_name
      AND tc.table_schema = 'public'
  ) pk ON c.column_name = pk.column_name
  WHERE 
    c.table_name = table_name
    AND c.table_schema = 'public'
  ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql;

-- Function to get RLS policies for a specific table
CREATE OR REPLACE FUNCTION get_table_policies(table_name text)
RETURNS TABLE (
  policy_name text,
  operation text,
  role text,
  definition text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.polname::text as policy_name,
    CASE
      WHEN (p.polcmd = '*') THEN 'ALL'
      WHEN (p.polcmd = 'r') THEN 'SELECT'
      WHEN (p.polcmd = 'a') THEN 'INSERT'
      WHEN (p.polcmd = 'w') THEN 'UPDATE'
      WHEN (p.polcmd = 'd') THEN 'DELETE'
      ELSE p.polcmd::text
    END as operation,
    CASE
      WHEN (ARRAY_LENGTH(p.polroles, 1) IS NULL) THEN 'public'
      WHEN (ARRAY_LENGTH(p.polroles, 1) > 0) THEN (SELECT STRING_AGG(rolname::text, ', ') FROM pg_roles WHERE oid = ANY(p.polroles))
      ELSE 'none'
    END as role,
    pg_catalog.pg_get_expr(p.polqual, p.polrelid)::text as definition
  FROM 
    pg_catalog.pg_policy p
    JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
    JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
  WHERE 
    n.nspname = 'public'
    AND c.relname = table_name
  ORDER BY p.polname;
END;
$$ LANGUAGE plpgsql;

-- Function to get foreign key relationships for a specific table
CREATE OR REPLACE FUNCTION get_table_relationships(table_name text)
RETURNS TABLE (
  constraint_name text,
  column_name text,
  foreign_table_name text,
  foreign_column_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tc.constraint_name::text,
    kcu.column_name::text,
    ccu.table_name::text AS foreign_table_name,
    ccu.column_name::text AS foreign_column_name
  FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
  WHERE 
    tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = table_name
    AND tc.table_schema = 'public';
END;
$$ LANGUAGE plpgsql;