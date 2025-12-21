-- FIX INFINITE RECURSION IN RLS POLICY

-- 1. Drop the problematic policy causing the loop
DROP POLICY IF EXISTS "Users can view own family members" ON profiles;

-- 2. Create a generic public viewing policy (Simplest fix for now)
-- OR
-- 3. Create a SECURITY DEFINER function to safely get family_name without triggering RLS recursively
CREATE OR REPLACE FUNCTION get_my_family_name()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT family_name FROM profiles WHERE id = auth.uid();
$$;

-- 4. Re-create the policy using the safe function
CREATE POLICY "Users can view own family members"
  ON profiles FOR SELECT
  USING (
    -- Allow users to see their own profile (always safe)
    auth.uid() = id
    OR
    -- Allow users to see anyone in their family (using safe lookup)
    family_name = get_my_family_name()
  );
