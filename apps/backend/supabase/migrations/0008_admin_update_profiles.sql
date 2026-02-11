-- Allow Admins to update any profile
-- This assumes 'app_admins' table and 'is_admin()' function exist from previous migrations.

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE
  USING (is_admin());
