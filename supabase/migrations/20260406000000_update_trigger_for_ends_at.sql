-- Update the trigger function to include `ends_at` when inserting a calendar
-- event for a booking, to satisfy the new NOT NULL constraint added in 20260404.
-- Also incorporates the `color_key` default (not strictly needed since it has a DB default
-- but good practice). We use `booked_slot_end` for `ends_at`.
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
  --    ON CONFLICT DO NOTHING is safe due to the partial unique index.
  insert into public.templates (user_id, name, data, is_hidden)
  values (v_owner_id, '__booking__', '[]'::jsonb, true)
  on conflict do nothing;

  select id into v_template_id
    from public.templates
   where user_id = v_owner_id
     and name    = '__booking__';

  -- 3. Insert the calendar event with booker details as detail rows,
  --    now including ends_at for the new schema requirement.
  insert into public.events (workspace_id, template_id, title, date, ends_at, data)
  values (
    v_workspace_id,
    v_template_id,
    v_label || ': ' || NEW.booker_name,
    NEW.booked_slot_start,
    NEW.booked_slot_end,
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
