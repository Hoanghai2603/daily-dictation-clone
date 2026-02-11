-- Comprehensive Fix for Admin Permissions

-- 1. Ensure app_admins table exists and has RLS
CREATE TABLE IF NOT EXISTS app_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE app_admins ENABLE ROW LEVEL SECURITY;

-- 2. Allow Public Read on app_admins (safeguard)
DROP POLICY IF EXISTS "Public read access to admins" ON app_admins;
CREATE POLICY "Public read access to admins" ON app_admins
  FOR SELECT USING (true);

-- 3. Redefine is_admin function to be case-insensitive and robust
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
DECLARE
  current_email TEXT;
BEGIN
  -- Get email from JWT
  current_email := auth.jwt() ->> 'email';
  
  -- If no email in JWT (not logged in), return false
  IF current_email IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if email exists in whitelist (case-insensitive)
  RETURN EXISTS (
    SELECT 1 FROM app_admins 
    WHERE lower(email) = lower(current_email)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Fix Profiles Policies for Admin
-- First, drop potentially conflicting or outdated policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Recreate View Policy
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  USING (is_admin());

-- Recreate Update Policy
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE
  USING (is_admin());

-- 5. Fix User Progress Policies for Admin (Just in case)
DROP POLICY IF EXISTS "Admins can view all user_progress" ON user_progress;
CREATE POLICY "Admins can view all user_progress" ON user_progress
  FOR SELECT
  USING (is_admin());
