-- Drop existing constraints if necessary (Supabase might require dropping and re-adding)
-- But typically we can just update the check constraint.
-- IMPORTANT: Run this in Supabase SQL Editor

-- 1. Update profiles table constraint
alter table profiles drop constraint profiles_role_check;
alter table profiles add constraint profiles_role_check 
  check (role in ('Dad', 'Mum', 'Son', 'Daughter'));

-- 2. Update missions table constraint
alter table missions drop constraint missions_owner_check;
alter table missions add constraint missions_owner_check 
  check (owner in ('Dad', 'Mum', 'Son', 'Daughter', 'Shared'));

-- 3. Update handle_new_user function if it has hardcoded checks (it doesn't, it uses metadata, but good to double check schema)
-- The trigger function just inserts what's in metadata, so it relies on the table constraint we just updated.
