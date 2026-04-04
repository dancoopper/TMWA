-- Add permission columns to workspace_members
ALTER TABLE "public"."workspace_members"
  ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'viewer'
    CONSTRAINT workspace_members_role_check CHECK (role IN ('viewer', 'editor')),
  ADD COLUMN IF NOT EXISTS "hide_events" BOOLEAN NOT NULL DEFAULT FALSE;

-- RPC: look up a user's ID by their auth email.
-- SECURITY DEFINER so clients never touch auth.users directly.
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(p_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email
  LIMIT 1;

  RETURN v_user_id; -- returns NULL if not found
END;
$$;

-- Grant execute only to authenticated users
REVOKE EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) TO authenticated;
