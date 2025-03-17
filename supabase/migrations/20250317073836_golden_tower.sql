/*
  # Add Monthly Views Tracking
  
  1. New Tables
    - `channel_views`
      - `id` (uuid, primary key)
      - `channel_id` (text, YouTube channel ID)
      - `user_id` (uuid, references auth.users)
      - `month` (date, first day of month)
      - `views` (bigint, total views for month)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. New Functions
    - `update_channel_views`: Updates monthly view count for a channel
    - `get_total_monthly_views`: Gets total views across all user's channels
  
  3. Security
    - Enable RLS
    - Add policies for users to view their own data
*/

-- Create channel_views table
CREATE TABLE IF NOT EXISTS channel_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month date NOT NULL,
  views bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(channel_id, month)
);

-- Enable RLS
ALTER TABLE channel_views ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own channel stats"
  ON channel_views
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own channel stats"
  ON channel_views
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update channel views
CREATE OR REPLACE FUNCTION update_channel_views(
  p_channel_id text,
  p_user_id uuid,
  p_month date,
  p_views bigint
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO channel_views (channel_id, user_id, month, views)
  VALUES (p_channel_id, p_user_id, p_month, p_views)
  ON CONFLICT (channel_id, month)
  DO UPDATE SET 
    views = p_views,
    updated_at = now();
END;
$$;

-- Function to get total monthly views for a user
CREATE OR REPLACE FUNCTION get_total_monthly_views(
  p_user_id uuid,
  p_month date DEFAULT date_trunc('month', current_date)::date
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_views bigint;
BEGIN
  SELECT COALESCE(SUM(views), 0)
  INTO total_views
  FROM channel_views
  WHERE user_id = p_user_id
  AND month = p_month;
  
  RETURN total_views;
END;
$$;

-- Create index for faster lookups
CREATE INDEX idx_channel_views_user_month 
ON channel_views(user_id, month);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_channel_views_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_channel_views_updated_at
  BEFORE UPDATE ON channel_views
  FOR EACH ROW
  EXECUTE FUNCTION update_channel_views_updated_at();