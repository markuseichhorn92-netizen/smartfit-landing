-- SmartFit CMS Content Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS smartfit_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT DEFAULT 'admin'
);

-- Enable RLS
ALTER TABLE smartfit_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (public website)
CREATE POLICY "Public read access" ON smartfit_content
  FOR SELECT USING (true);

-- Allow anyone to update (protected by password in frontend)
CREATE POLICY "Public write access" ON smartfit_content
  FOR ALL USING (true);

-- Insert initial content
INSERT INTO smartfit_content (id, content) VALUES ('main', '{
  "hero": {
    "headline": "Endlich wieder <span class=\"gradient-text\">fit und voller Energie</span>",
    "subheadline": "Personal Training für <strong class=\"text-white\">alle ab 35</strong>, die sich wieder wohlfühlen wollen",
    "description": "Mehr Energie für den Alltag. Endlich wieder gut schlafen. Gesund abnehmen ohne Verzicht – mit einem Plan, der zu deinem Leben passt."
  },
  "images": {
    "hero-image": "https://smartfit-coaching.de/wp-content/uploads/2023/02/personal-trainer-trier-david-puschmann-smartfit-coaching.png"
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
