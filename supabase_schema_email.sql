
-- Add Email to profiles for "Send Email" feature
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- Update handle_new_user to copy email
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
