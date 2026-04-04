-- Deduplicate any __booking__ templates that got created as duplicates,
-- keeping the earliest one per user.
delete from public.templates
where name = '__booking__'
  and id not in (
    select min(id)
    from public.templates
    where name = '__booking__'
    group by user_id
  );

-- Partial unique index: only __booking__ rows must be unique per user.
-- Regular user-created templates are unaffected.
create unique index if not exists templates_user_booking_unique
  on public.templates (user_id)
  where name = '__booking__';

-- Update the trigger function to use ON CONFLICT so the template
-- upsert is a single atomic operation with no race conditions.
create or replace function public.create_event_from_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_workspace_id int;
  v_owner_id     uuid;
  v_label        text;
  v_template_id  int;
begin
  -- 1. Look up the share to get workspace, owner, and label
  select workspace_id, created_by, coalesce(label, 'Booking')
    into v_workspace_id, v_owner_id, v_label
    from public.availability_shares
   where id = NEW.share_id;

  -- 2. Ensure exactly one __booking__ template exists for this owner.
  --    ON CONFLICT DO NOTHING is safe due to the partial unique index above.
  insert into public.templates (user_id, name, data, is_hidden)
  values (v_owner_id, '__booking__', '[]'::jsonb, true)
  on conflict do nothing;

  select id into v_template_id
    from public.templates
   where user_id = v_owner_id
     and name    = '__booking__';

  -- 3. Insert the calendar event with booker details as detail rows
  insert into public.events (workspace_id, template_id, title, date, data)
  values (
    v_workspace_id,
    v_template_id,
    v_label || ': ' || NEW.booker_name,
    NEW.booked_slot_start,
    jsonb_build_array(
      jsonb_build_object(
        'Name',    NEW.booker_name,
        'Email',   NEW.booker_email,
        'Subject', v_label
      )
    )
  );

  return NEW;
end;
$$;
