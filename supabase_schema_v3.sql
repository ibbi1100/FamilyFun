-- v3.0 FAMILY ISOLATION & REWARDS SCHEMA

-- 1. Add Family Identity to Profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS family_name text DEFAULT 'The Incredibles';

-- 2. Index for faster family lookups
CREATE INDEX IF NOT EXISTS idx_profiles_family_name ON profiles(family_name);

-- 3. Update RLS to allow reading profiles within the same family
-- (Existing RLS might be too permissive or too restrictive, let's refine)

-- Allow users to see profiles of their own family members
create policy "Users can view own family members"
  on profiles for select
  using ( family_name = (select family_name from profiles where id = auth.uid()) );

-- 4. Message RLS update (optional, but good for future)
-- Ensure users can only message their family members (implicitly handled by UI filtering, but good for security)
-- Current message policy: "auth.uid() = sender_id OR auth.uid() = receiver_id" is fine for 1:1.

-- 5. Helper Function to set default family on new user (Updates handle_new_user)
-- We need to make sure new users get a family name. For now, default to 'The Incredibles' or pull from metadata if available.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, avatar, email, family_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'role',
    new.raw_user_meta_data ->> 'avatar',
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'family_name', 'The Incredibles') -- Default family
  );
  RETURN new;
END;
$$;
