-- DELETE payloads only include PK columns by default; filtered postgres_changes
-- (e.g. workspace_id=eq.N) need old row columns present.
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER TABLE public.workspace_members REPLICA IDENTITY FULL;
