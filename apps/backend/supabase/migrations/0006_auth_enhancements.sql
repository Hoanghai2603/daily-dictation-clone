-- Add phone and is_banned columns to profiles
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN 
        ALTER TABLE profiles ADD COLUMN phone TEXT; 
    END IF; 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_banned') THEN 
        ALTER TABLE profiles ADD COLUMN is_banned BOOLEAN DEFAULT false; 
    END IF;
END $$;

-- Create helper function to check admin status based on app_admins whitelist
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM app_admins 
    WHERE email = (select auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow Admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- Allow Admins to view all user progress
DROP POLICY IF EXISTS "Admins can view all user_progress" ON user_progress;
CREATE POLICY "Admins can view all user_progress" ON user_progress
  FOR SELECT USING (is_admin());

-- RPC to ban a user (sets is_banned flag in profiles)
CREATE OR REPLACE FUNCTION ban_user(user_id UUID)
RETURNS VOID AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE profiles SET is_banned = true WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to unban a user
CREATE OR REPLACE FUNCTION unban_user(user_id UUID)
RETURNS VOID AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE profiles SET is_banned = false WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
