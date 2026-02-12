-- Ensure RLS is enabled for both tables.
alter table "public"."templates" enable row level security;
alter table "public"."events" enable row level security;

-- Recreate template policies idempotently.
drop policy if exists "Users can view own templates" on "public"."templates";
drop policy if exists "Users can create own templates" on "public"."templates";
drop policy if exists "Users can update own templates" on "public"."templates";
drop policy if exists "Users can delete own templates" on "public"."templates";

create policy "Users can view own templates"
on "public"."templates"
for select
using (
  auth.uid() = user_id
);

create policy "Users can create own templates"
on "public"."templates"
for insert
with check (
  auth.uid() = user_id
);

create policy "Users can update own templates"
on "public"."templates"
for update
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

create policy "Users can delete own templates"
on "public"."templates"
for delete
using (
  auth.uid() = user_id
);

-- Recreate event policies idempotently.
drop policy if exists "Workspace members can view events" on "public"."events";
drop policy if exists "Workspace members can create events" on "public"."events";
drop policy if exists "Workspace members can update events" on "public"."events";
drop policy if exists "Workspace members can delete events" on "public"."events";

create policy "Workspace members can view events"
on "public"."events"
for select
using (
  is_workspace_member(workspace_id)
);

create policy "Workspace members can create events"
on "public"."events"
for insert
with check (
  is_workspace_member(workspace_id)
  and exists (
    select 1
    from "public"."templates" t
    where t.id = template_id
      and t.user_id = auth.uid()
  )
);

create policy "Workspace members can update events"
on "public"."events"
for update
using (
  is_workspace_member(workspace_id)
)
with check (
  is_workspace_member(workspace_id)
  and exists (
    select 1
    from "public"."templates" t
    where t.id = template_id
      and t.user_id = auth.uid()
  )
);

create policy "Workspace members can delete events"
on "public"."events"
for delete
using (
  is_workspace_member(workspace_id)
);
