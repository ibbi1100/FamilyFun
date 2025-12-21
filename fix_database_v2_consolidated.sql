-- EMERGENCY DATABASE FIX SCRIPT (v2.1 Consolidated)
-- Run this ENTIRE script in Supabase SQL Editor to fix "missing balance", "missing email", and "missing messages".

-- 1. FIX: Add 'balance' to profiles (Economy)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS balance numeric default 0.00;

-- 2. FIX: Add 'email' to profiles (Social)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- 3. FIX: Create 'messages' table (Chat)
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) not null,
  receiver_id uuid references profiles(id) not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. FIX: Enable RLS for messages
alter table messages enable row level security;

-- 5. FIX: RLS Policies for Messages (Safe to re-run, drops existing first)
DROP POLICY IF EXISTS "Users can read their own messages" ON messages;
create policy "Users can read their own messages"
  on messages for select
  using ( auth.uid() = sender_id OR auth.uid() = receiver_id );

DROP POLICY IF EXISTS "Users can send messages" ON messages;
create policy "Users can send messages"
  on messages for insert
  with check ( auth.uid() = sender_id );

DROP POLICY IF EXISTS "Users can update read status" ON messages;
create policy "Users can update read status"
  on messages for update
  using ( auth.uid() = receiver_id );

-- 6. FIX: Ensure handle_new_user trigger copies email
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role, avatar, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'role',
    new.raw_user_meta_data ->> 'avatar',
    new.email
  );
  return new;
end;
$$;

-- 7. FIX: Ensure game_content table exists
create table if not exists game_content (
  id uuid default uuid_generate_v4() primary key,
  type text check (type in ('joke', 'charade', 'dare', 'story', 'future')),
  content jsonb not null,
  is_used boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. FIX: RLS for game_content
alter table game_content enable row level security;

DROP POLICY IF EXISTS "Anyone can read unused content" ON game_content;
create policy "Anyone can read unused content"
  on game_content for select
  using ( true );

DROP POLICY IF EXISTS "Authenticated users can update usage" ON game_content;
create policy "Authenticated users can update usage"
  on game_content for update
  using ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Authenticated users can insert new content" ON game_content;
create policy "Authenticated users can insert new content"
  on game_content for insert
  with check ( auth.role() = 'authenticated' );
