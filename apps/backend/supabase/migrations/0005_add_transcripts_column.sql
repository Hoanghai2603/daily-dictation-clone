-- Add transcripts column to exercises table as JSONB
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS transcripts JSONB DEFAULT '[]'::jsonb;

-- Optional: If you want to drop the old transcripts table
-- DROP TABLE IF EXISTS transcripts;
