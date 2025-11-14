-- Add RLS policies for public viewing of presentations via share tokens
-- This allows unauthenticated users to view presentations when they have a valid share token

-- Allow anyone to read presentation instances by share_token (for public viewing)
CREATE POLICY "Anyone can view instances by share token" ON presentation_instances
  FOR SELECT USING (share_token IS NOT NULL);

-- Allow anyone to read presentations that have instances with share tokens
CREATE POLICY "Anyone can view presentations with shared instances" ON presentations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM presentation_instances
      WHERE presentation_id = presentations.id
      AND share_token IS NOT NULL
    )
  );

-- Allow anyone to read questions for instances accessed by share token
CREATE POLICY "Anyone can read questions for shared instances" ON custom_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM presentation_instances
      WHERE id = instance_id
      AND share_token IS NOT NULL
    )
  );

-- Allow anyone to read answers for shared instances
CREATE POLICY "Anyone can read answers for shared instances" ON question_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM presentation_instances
      WHERE id = instance_id
      AND share_token IS NOT NULL
    )
  );

-- Allow updating viewed status for shared instances
CREATE POLICY "Anyone can mark shared instances as viewed" ON presentation_instances
  FOR UPDATE USING (share_token IS NOT NULL)
  WITH CHECK (
    share_token IS NOT NULL
    AND status IN ('viewed', 'completed')
  );

-- Allow anyone to submit answers for shared instances
CREATE POLICY "Anyone can submit answers for shared instances" ON question_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM presentation_instances
      WHERE id = instance_id
      AND share_token IS NOT NULL
    )
  );

-- Allow updating answers for shared instances
CREATE POLICY "Anyone can update answers for shared instances" ON question_answers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM presentation_instances
      WHERE id = instance_id
      AND share_token IS NOT NULL
    )
  );

