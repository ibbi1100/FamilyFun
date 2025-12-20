-- Add proof_url column
ALTER TABLE missions ADD COLUMN IF NOT EXISTS proof_url text;

-- Update status check constraint (Postgres requires dropping the old constraint first)
ALTER TABLE missions DROP CONSTRAINT IF EXISTS missions_status_check;
ALTER TABLE missions ADD CONSTRAINT missions_status_check CHECK (status IN ('active', 'pending_approval', 'completed'));

-- Create storage bucket for proofs if it doesn't exist (This usually needs to be done via dashboard or specific storage API, but here is SQL if using pg_net or similar, otherwise just a placeholder for the user)
-- insert into storage.buckets (id, name, public) values ('proofs', 'proofs', true);
