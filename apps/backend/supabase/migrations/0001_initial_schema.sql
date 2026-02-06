-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_id TEXT NOT NULL,
  thumbnail_url TEXT,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  accent TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT false,
  duration INTEGER, -- in seconds
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create transcripts (segments) table
CREATE TABLE IF NOT EXISTS transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  start_time FLOAT NOT NULL, -- in seconds
  end_time FLOAT NOT NULL,   -- in seconds
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  streak_count INTEGER DEFAULT 0,
  total_time_listened INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('in-progress', 'completed')),
  percentage FLOAT DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

-- Create vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  word TEXT NOT NULL,
  translation TEXT,
  context_sentence TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;

-- Policies
-- Exercises: Public can read published ones, Admin (implicitly via service role or specific role) can do all
CREATE POLICY "Public can view published exercises" ON exercises
  FOR SELECT USING (is_published = true);

-- Transcripts: Public can read
CREATE POLICY "Public can view transcripts" ON transcripts
  FOR SELECT USING (true);

-- Profiles: Users can read/update their own
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- User Progress: Users can handle their own
CREATE POLICY "Users can handle own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Vocabulary: Users can handle their own
CREATE POLICY "Users can handle own vocabulary" ON vocabulary
  FOR ALL USING (auth.uid() = user_id);
