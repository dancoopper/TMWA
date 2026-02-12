-- Enable RLS for templates if not already enabled (it was, but safe to re-run enable if needed)
alter table "public"."templates" enable row level security;

-- Templates Policies

create policy "Users can view their own templates"
  on public.templates for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own templates"
  on public.templates for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own templates"
  on public.templates for update
  to authenticated
  using (user_id = auth.uid());

create policy "Users can delete their own templates"
  on public.templates for delete
  to authenticated
  using (user_id = auth.uid());


-- Events Policies
alter table "public"."events" enable row level security;

create policy "Users can view events in workspaces they belong to"
  on public.events for select
  to authenticated
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = events.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Users can insert events in workspaces they belong to"
  on public.events for insert
  to authenticated
  with check (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = events.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Users can update events in workspaces they belong to"
  on public.events for update
  to authenticated
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = events.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Users can delete events in workspaces they belong to"
  on public.events for delete
  to authenticated
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = events.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );
