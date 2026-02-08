-- Enable RLS
ALTER TABLE "public"."workspaces" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."workspace_members" ENABLE ROW LEVEL SECURITY;

-- Policies for workspaces

-- Select: Users can view their own workspaces (where they are owner or member)
CREATE POLICY "Users can view their own workspaces"
ON "public"."workspaces"
FOR SELECT
USING (
  auth.uid() = owner_user_id OR
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_members.workspace_id = workspaces.id
    AND workspace_members.user_id = auth.uid()
  )
);

-- Insert: Authenticated users can create workspaces
CREATE POLICY "Authenticated users can create workspaces"
ON "public"."workspaces"
FOR INSERT
WITH CHECK (
  auth.uid() = owner_user_id
);

-- Update: Only workspace owners can update
CREATE POLICY "Workspace owners can update their workspaces"
ON "public"."workspaces"
FOR UPDATE
USING (
  auth.uid() = owner_user_id
);

-- Delete: Only workspace owners can delete
CREATE POLICY "Workspace owners can delete their workspaces"
ON "public"."workspaces"
FOR DELETE
USING (
  auth.uid() = owner_user_id
);

-- Policies for workspace_members

-- Select: Members can view other members of the same workspace
CREATE POLICY "Members can view other members of the same workspace"
ON "public"."workspace_members"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members AS wm
    WHERE wm.workspace_id = workspace_members.workspace_id
    AND wm.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE workspaces.id = workspace_members.workspace_id
    AND workspaces.owner_user_id = auth.uid()
  )
);

-- Insert: Workspace owners can add members
CREATE POLICY "Workspace owners can add members"
ON "public"."workspace_members"
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE workspaces.id = workspace_members.workspace_id
    AND workspaces.owner_user_id = auth.uid()
  )
);

-- Update: Workspace owners can update members
CREATE POLICY "Workspace owners can update members"
ON "public"."workspace_members"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE workspaces.id = workspace_members.workspace_id
    AND workspaces.owner_user_id = auth.uid()
  )
);

-- Delete: Workspace owners can remove members (and members can leave? - preserving owner only for now based on plan)
CREATE POLICY "Workspace owners can remove members"
ON "public"."workspace_members"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE workspaces.id = workspace_members.workspace_id
    AND workspaces.owner_user_id = auth.uid()
  )
);
