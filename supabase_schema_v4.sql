-- v4.0 MULTIPLAYER GAME SESSIONS

-- 1. Create Game Sessions Table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type text NOT NULL, -- 'emoji_charades', 'dad_joke', etc.
  player_1_id uuid REFERENCES auth.users(id) NOT NULL,
  player_2_id uuid REFERENCES auth.users(id) NOT NULL,
  turn_player_id uuid REFERENCES auth.users(id),
  state jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_game_sessions_p1 ON game_sessions(player_1_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_p2 ON game_sessions(player_2_id);

-- 3. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;

-- 4. RLS Policies
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to view sessions they are part of
CREATE POLICY "Users can view their game sessions"
  ON game_sessions FOR SELECT
  USING (auth.uid() = player_1_id OR auth.uid() = player_2_id);

-- Allow users to create sessions (usually initiated by p1)
CREATE POLICY "Users can create game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (auth.uid() = player_1_id);

-- Allow users to update sessions they are part of (turns)
CREATE POLICY "Users can update their game sessions"
  ON game_sessions FOR UPDATE
  USING (auth.uid() = player_1_id OR auth.uid() = player_2_id);

-- 5. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
