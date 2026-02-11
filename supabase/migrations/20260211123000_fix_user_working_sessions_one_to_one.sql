-- Enforce one working session row per user and make latest workspace strongly typed.

-- Remove unusable rows before applying stricter constraints.
DELETE FROM public.user_working_sessions
WHERE user_id IS NULL;

-- Keep only the most recent row per user when duplicates exist.
DELETE FROM public.user_working_sessions older
USING public.user_working_sessions newer
WHERE older.user_id = newer.user_id
  AND older.id < newer.id;

-- Ensure legacy non-numeric workspace ids do not break bigint conversion.
UPDATE public.user_working_sessions
SET latest_workspace_id = NULL
WHERE latest_workspace_id IS NOT NULL
  AND latest_workspace_id !~ '^[0-9]+$';

ALTER TABLE public.user_working_sessions
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid(),
  ALTER COLUMN latest_workspace_id TYPE bigint
    USING latest_workspace_id::bigint;

ALTER TABLE public.user_working_sessions
  ADD CONSTRAINT user_working_sessions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.user_profiles (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  ADD CONSTRAINT user_working_sessions_latest_workspace_id_fkey
    FOREIGN KEY (latest_workspace_id) REFERENCES public.workspaces (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

CREATE UNIQUE INDEX user_working_sessions_user_id_key
  ON public.user_working_sessions USING btree (user_id);

ALTER TABLE public.user_working_sessions
  ADD CONSTRAINT user_working_sessions_user_id_key
    UNIQUE USING INDEX user_working_sessions_user_id_key;

ALTER TABLE public.user_working_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own working session" ON public.user_working_sessions;
DROP POLICY IF EXISTS "Users can insert own working session" ON public.user_working_sessions;
DROP POLICY IF EXISTS "Users can update own working session" ON public.user_working_sessions;
DROP POLICY IF EXISTS "Users can delete own working session" ON public.user_working_sessions;

CREATE POLICY "Users can read own working session"
ON public.user_working_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own working session"
ON public.user_working_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own working session"
ON public.user_working_sessions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own working session"
ON public.user_working_sessions
FOR DELETE
USING (auth.uid() = user_id);
