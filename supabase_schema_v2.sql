
-- 1. Economy: Add Balance to Profiles
-- We keep 'xp' for level tracking/prestige, but 'balance' is spendable currency
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS balance numeric default 0.00;

-- 2. Chat: Messages Table
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) not null,
  receiver_id uuid references profiles(id) not null, -- null could mean "Family Channel"
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Messages
alter table messages enable row level security;

-- Users can see messages sent by them or to them
create policy "Users can read their own messages"
  on messages for select
  using ( auth.uid() = sender_id OR auth.uid() = receiver_id );

-- Users can send messages
create policy "Users can send messages"
  on messages for insert
  with check ( auth.uid() = sender_id );

-- Users can update read status of messages sent to them
create policy "Users can update read status"
  on messages for update
  using ( auth.uid() = receiver_id );

-- 3. Social: Add "On a Mission" status? (Optional, presence handles most)
-- We rely on Supabase Realtime Presence for online status.

