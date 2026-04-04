-- Replace the trigger function to include richer event details.
-- The `data` field is stored as a JSON array containing one object,
-- which DayDetailPanel iterates to render key/value detail rows.
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

  -- 2. Find (or create) a hidden "__booking__" template for that owner
  select id
    into v_template_id
    from public.templates
   where user_id = v_owner_id
     and name    = '__booking__'
   limit 1;

  if v_template_id is null then
    insert into public.templates (user_id, name, data, is_hidden)
    values (v_owner_id, '__booking__', '[]'::jsonb, true)
    returning id into v_template_id;
  end if;

  -- 3. Insert the calendar event.
  --    `data` is a JSON array with one object so DayDetailPanel renders
  --    each key as a labelled detail row (see buildSelectedEventDetails).
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
