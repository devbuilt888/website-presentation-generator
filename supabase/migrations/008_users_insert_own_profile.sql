-- Allow authenticated users to create their own profile row (signup fallback).
-- Primary creation is still handle_new_user() on auth.users (SECURITY DEFINER).

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
