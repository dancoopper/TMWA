-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  event_data jsonb,
  template_id bigint,
  workspace_id bigint,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT events_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id)
);
CREATE TABLE public.templates (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_schema jsonb,
  CONSTRAINT templates_pkey PRIMARY KEY (id),
  CONSTRAINT templates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  full_name text,
  dob text,
  company text,
  role text,
  onboarded boolean DEFAULT false,
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_settings (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  user_id uuid,
  theme text,
  CONSTRAINT user_settings_pkey PRIMARY KEY (id),
  CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.working_sessions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid DEFAULT gen_random_uuid(),
  workspace_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT working_sessions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.workspace_members (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid,
  workspace_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT workspace_members_pkey PRIMARY KEY (id),
  CONSTRAINT workspace_members_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT workspace_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.workspaces (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text,
  owner_user_id uuid DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT workspaces_pkey PRIMARY KEY (id),
  CONSTRAINT workspaces_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.user_profiles(id),
  CONSTRAINT workspaces_owner_user_id_fkey1 FOREIGN KEY (owner_user_id) REFERENCES public.user_profiles(id)
);