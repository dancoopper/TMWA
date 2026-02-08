-- Create a function to check membership without triggering RLS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_workspace_member(_workspace_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE workspace_id = _workspace_id
    AND user_id = auth.uid()
  );
END;
$$;

-- Drop existing policies to recreate them clearly
DROP POLICY IF EXISTS "Users can view their own workspaces" ON "public"."workspaces";
DROP POLICY IF EXISTS "Members can view other members of the same workspace" ON "public"."workspace_members";

-- Re-create workspace policies

-- Select: Users can view their own workspaces (where they are owner or member)
CREATE POLICY "Users can view their own workspaces"
ON "public"."workspaces"
FOR SELECT
USING (
  auth.uid() = owner_user_id 
  OR 
  is_workspace_member(id)
);

-- Re-create workspace_members policies

-- Select: Members can view other members of the same workspace
CREATE POLICY "Members can view other members of the same workspace"
ON "public"."workspace_members"
FOR SELECT
USING (
  -- I can see my own membership
  user_id = auth.uid()
  OR
  -- I can see members if I am the owner of the workspace
  EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE workspaces.id = workspace_members.workspace_id
    AND workspaces.owner_user_id = auth.uid()
  )
  OR
  -- I can see members if I am also a member of the workspace (peers)
  is_workspace_member(workspace_members.workspace_id)
);
