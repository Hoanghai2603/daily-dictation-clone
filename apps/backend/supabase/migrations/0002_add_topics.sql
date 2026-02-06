-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  level TEXT CHECK (level IN ('Easy', 'Medium', 'Advanced', 'Easy/Intermediate', 'Intermediate/Advanced')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add topic_id to exercises
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exercises' AND column_name = 'topic_id') THEN
    ALTER TABLE exercises ADD COLUMN topic_id UUID REFERENCES topics(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS on topics
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Policy for topics
CREATE POLICY "Public can view topics" ON topics
  FOR SELECT USING (true);
