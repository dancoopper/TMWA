-- Editor capability for shared workspaces (owner or member with editor role / owner flag)
CREATE OR REPLACE FUNCTION public.is_workspace_editor(_workspace_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = _workspace_id AND w.owner_user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.workspace_members wm
    WHERE wm.workspace_id = _workspace_id
      AND wm.user_id = auth.uid()
      AND (wm.is_owner IS TRUE OR wm.role = 'editor')
  );
$$;

REVOKE ALL ON FUNCTION public.is_workspace_editor(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_workspace_editor(bigint) TO authenticated;

-- Template may be used for an event if I own it or it is already used in this workspace
CREATE OR REPLACE FUNCTION public.template_usable_in_workspace(_workspace_id bigint, _template_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.id = _template_id AND t.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.workspace_id = _workspace_id AND e.template_id = _template_id
  );
$$;

REVOKE ALL ON FUNCTION public.template_usable_in_workspace(bigint, bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.template_usable_in_workspace(bigint, bigint) TO authenticated;

-- Events: only editors create/update/delete; viewers keep SELECT via existing policy
DROP POLICY IF EXISTS "Workspace members can create events" ON public.events;
DROP POLICY IF EXISTS "Workspace members can update events" ON public.events;
DROP POLICY IF EXISTS "Workspace members can delete events" ON public.events;

CREATE POLICY "Workspace editors can create events"
ON public.events
FOR INSERT
WITH CHECK (
  public.is_workspace_editor(workspace_id)
  AND public.template_usable_in_workspace(workspace_id, template_id)
);

CREATE POLICY "Workspace editors can update events"
ON public.events
FOR UPDATE
USING (public.is_workspace_editor(workspace_id))
WITH CHECK (
  public.is_workspace_editor(workspace_id)
  AND public.template_usable_in_workspace(workspace_id, template_id)
);

CREATE POLICY "Workspace editors can delete events"
ON public.events
FOR DELETE
USING (public.is_workspace_editor(workspace_id));

-- Members: editors invite and manage non-owner rows; anyone can leave (non-owner)
DROP POLICY IF EXISTS "Workspace owners can add members" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace owners can update members" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace owners can remove members" ON public.workspace_members;

CREATE POLICY "Workspace editors can add members"
ON public.workspace_members
FOR INSERT
WITH CHECK (
  public.is_workspace_editor(workspace_id)
  AND (
    COALESCE(is_owner, false) = false
    OR (
      is_owner = true
      AND user_id = (SELECT w.owner_user_id FROM public.workspaces w WHERE w.id = workspace_id)
      AND (SELECT w.owner_user_id FROM public.workspaces w WHERE w.id = workspace_id) = auth.uid()
    )
  )
);

CREATE POLICY "Workspace editors update members"
ON public.workspace_members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = workspace_id AND w.owner_user_id = auth.uid()
  )
  OR (
    public.is_workspace_editor(workspace_id)
    AND NOT COALESCE(workspace_members.is_owner, false)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = workspace_id AND w.owner_user_id = auth.uid()
  )
  OR (
    public.is_workspace_editor(workspace_id)
    AND NOT COALESCE(is_owner, false)
  )
);

CREATE POLICY "Workspace editors remove members"
ON public.workspace_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = workspace_id AND w.owner_user_id = auth.uid()
  )
  OR (
    public.is_workspace_editor(workspace_id)
    AND NOT COALESCE(workspace_members.is_owner, false)
  )
  OR (
    workspace_members.user_id = auth.uid()
    AND NOT COALESCE(workspace_members.is_owner, false)
  )
);

-- Realtime: postgres changes (respects RLS for subscribers)
DO $pub$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'workspace_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_members;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'workspaces'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.workspaces;
  END IF;
END
$pub$;
