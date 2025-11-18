-- Fix RLS policy to allow unauthenticated access to presentations via share token
-- This solves the "Cannot coerce the result to a single JSON object" error

-- Drop the old policy that's too restrictive
DROP POLICY IF EXISTS "Anyone can view presentations with shared instances" ON presentations;

-- Create a new policy that properly allows public access via share token
-- This policy checks if ANY instance of this presentation has a share_token
CREATE POLICY "Allow public access to presentations with share tokens" ON presentations
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 
      FROM presentation_instances 
      WHERE presentation_instances.presentation_id = presentations.id
      AND presentation_instances.share_token IS NOT NULL
    )
  );

-- Also ensure the presentation_instances policy is correct
-- Drop and recreate to make sure it's working
DROP POLICY IF EXISTS "Anyone can view instances by share token" ON presentation_instances;

CREATE POLICY "Public can view instances with share token" ON presentation_instances
  FOR SELECT 
  USING (share_token IS NOT NULL);

-- Note: "Users can read own presentations" policy already exists from migration 001
-- No need to recreate it

-- Summary of what this fixes:
-- 1. Allows unauthenticated users to query presentations table when presentation has instances with share_token
-- 2. Allows unauthenticated users to query presentation_instances by share_token
-- 3. Maintains security - only presentations with active share links are accessible
-- 4. Logged-in users can still see all their own presentations

