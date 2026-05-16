-- Add phone number to user profiles (shown on shared omega presentations)

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL;

-- Sync phone from auth metadata when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public viewers: resolve presenter phone for a shared link (no PII beyond phone)
CREATE OR REPLACE FUNCTION public.get_shared_instance_owner_phone(p_token text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT u.phone
  FROM presentation_instances pi
  INNER JOIN users u ON u.id = pi.created_by
  WHERE pi.share_token = p_token
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_shared_instance_owner_phone(text) TO anon, authenticated;
