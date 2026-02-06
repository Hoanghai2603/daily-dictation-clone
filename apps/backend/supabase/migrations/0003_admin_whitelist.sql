-- Create a whitelist table for admin emails
CREATE TABLE IF NOT EXISTS app_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_admins ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the whitelist (to check if they are admin), 
-- but only existing admins (or service role) can modify it.
-- Bootstrap problem: How to add the first admin?
-- Answer: You insert it manually via SQL Editor.
CREATE POLICY "Public read access to admins" ON app_admins
  FOR SELECT USING (true);
