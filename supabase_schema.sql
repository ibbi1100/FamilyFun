-- Create a table for user profiles
create table profiles (
  id uuid references auth.users not null primary key,
  name text,
  role text check (role in ('Dad', 'Son')),
  avatar text,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for missions/activities
create table missions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  duration text,
  xp integer,
  owner text check (owner in ('Dad', 'Son', 'Shared')),
  emoji text,
  status text default 'active' check (status in ('active', 'completed')),
  created_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table missions enable row level security;

-- Create policies for missions
create policy "Missions are viewable by everyone"
  on missions for select
  using ( true );

create policy "Authenticated users can create missions"
  on missions for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update mission status"
  on missions for update
  using ( auth.role() = 'authenticated' );

-- Set up Realtime for missions
alter publication supabase_realtime add table missions;
