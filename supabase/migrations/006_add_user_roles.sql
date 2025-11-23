-- Add User Roles Migration
-- This migration adds role-based access control (RBAC) to the users table

-- 1. Add role column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. Create index for role lookups (important for performance)
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Update existing users to have 'user' role (if null)
UPDATE users SET role = 'user' WHERE role IS NULL;

-- 4. Set default for new users
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';

-- 5. Function to check if user is admin (used in RLS policies)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update RLS policies for presentations (allow admins to see all)
DROP POLICY IF EXISTS "Admins can view all presentations" ON presentations;
CREATE POLICY "Admins can view all presentations" ON presentations
  FOR SELECT
  USING (is_admin(auth.uid()));

-- 7. Update RLS policies for presentation_instances (allow admins to see all)
DROP POLICY IF EXISTS "Admins can view all instances" ON presentation_instances;
CREATE POLICY "Admins can view all instances" ON presentation_instances
  FOR SELECT
  USING (is_admin(auth.uid()));

-- 8. Update RLS policies for users (allow admins to see all users)
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT
  USING (is_admin(auth.uid()));

-- 9. Allow admins to update user roles (for future role management)
DROP POLICY IF EXISTS "Admins can update user roles" ON users;
CREATE POLICY "Admins can update user roles" ON users
  FOR UPDATE
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Note: To make a user admin, run:
-- UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';

