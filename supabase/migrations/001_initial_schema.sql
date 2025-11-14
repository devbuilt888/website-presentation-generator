-- Initial Database Schema Migration
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Presentations table
CREATE TABLE IF NOT EXISTS presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_presentations_created_by ON presentations(created_by);
CREATE INDEX idx_presentations_template_id ON presentations(template_id);
CREATE INDEX idx_presentations_is_public ON presentations(is_public);

-- 3. User presentation access table
CREATE TABLE IF NOT EXISTS user_presentation_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  presentation_id UUID NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  can_edit BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, presentation_id)
);

CREATE INDEX idx_access_user_id ON user_presentation_access(user_id);
CREATE INDEX idx_access_presentation_id ON user_presentation_access(presentation_id);

-- 4. Presentation instances table
CREATE TABLE IF NOT EXISTS presentation_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id UUID NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_name TEXT,
  recipient_email TEXT,
  store_link TEXT,
  customization_level TEXT DEFAULT 'simple' CHECK (customization_level IN ('simple', 'advanced')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'completed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  custom_fields JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_instances_presentation_id ON presentation_instances(presentation_id);
CREATE INDEX idx_instances_created_by ON presentation_instances(created_by);
CREATE INDEX idx_instances_recipient_email ON presentation_instances(recipient_email);
CREATE INDEX idx_instances_status ON presentation_instances(status);

-- 5. Custom questions table
CREATE TABLE IF NOT EXISTS custom_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES presentation_instances(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'text' CHECK (question_type IN ('text', 'multiple_choice', 'yes_no', 'rating')),
  position INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT FALSE,
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_questions_instance_id ON custom_questions(instance_id);
CREATE INDEX idx_questions_instance_position ON custom_questions(instance_id, position);

-- 6. Question answers table
CREATE TABLE IF NOT EXISTS question_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES custom_questions(id) ON DELETE CASCADE,
  instance_id UUID NOT NULL REFERENCES presentation_instances(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_value JSONB,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(question_id)
);

CREATE INDEX idx_answers_question_id ON question_answers(question_id);
CREATE INDEX idx_answers_instance_id ON question_answers(instance_id);

-- 7. Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presentations_updated_at BEFORE UPDATE ON presentations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instances_updated_at BEFORE UPDATE ON presentation_instances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presentation_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentation_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Presentations policies
CREATE POLICY "Users can read own presentations" ON presentations
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can read public presentations" ON presentations
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can create presentations" ON presentations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own presentations" ON presentations
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own presentations" ON presentations
  FOR DELETE USING (auth.uid() = created_by);

-- Access policies
CREATE POLICY "Users can read own access" ON user_presentation_access
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Presentation owners can grant access" ON user_presentation_access
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM presentations 
      WHERE id = presentation_id AND created_by = auth.uid()
    )
  );

-- Instance policies
CREATE POLICY "Users can manage own instances" ON presentation_instances
  FOR ALL USING (auth.uid() = created_by);

-- Question policies
CREATE POLICY "Users can read questions for own instances" ON custom_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM presentation_instances 
      WHERE id = instance_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create questions for own instances" ON custom_questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM presentation_instances 
      WHERE id = instance_id AND created_by = auth.uid()
    )
  );

-- Answer policies
CREATE POLICY "Users can read answers for own instances" ON question_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM presentation_instances 
      WHERE id = instance_id AND created_by = auth.uid()
    )
  );

-- Note: Answer creation policy for recipients will be handled via API with token validation

