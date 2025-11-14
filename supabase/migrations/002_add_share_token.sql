-- Add share_token to presentation_instances for unique links
ALTER TABLE presentation_instances 
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Create index for fast lookups by token
CREATE INDEX IF NOT EXISTS idx_instances_share_token ON presentation_instances(share_token);

-- Function to generate unique token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
DECLARE
  token TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate random alphanumeric token (12 characters)
    token := upper(
      substr(
        encode(gen_random_bytes(9), 'base64'),
        1, 12
      )
    );
    -- Replace non-alphanumeric characters
    token := regexp_replace(token, '[^A-Z0-9]', '', 'g');
    -- Ensure length
    token := substr(token || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 1, 12);
    
    -- Check if token already exists
    SELECT EXISTS(SELECT 1 FROM presentation_instances WHERE share_token = token) INTO exists_check;
    
    -- Exit loop if token is unique
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN token;
END;
$$ LANGUAGE plpgsql;

