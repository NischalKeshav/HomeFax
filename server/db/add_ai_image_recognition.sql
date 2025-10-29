-- Add AI Image Recognition table
CREATE TABLE IF NOT EXISTS ai_image_recognition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  recognized_objects JSONB,
  recognized_materials JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ai_image_property_id ON ai_image_recognition(property_id);
CREATE INDEX IF NOT EXISTS idx_ai_image_user_id ON ai_image_recognition(user_id);

