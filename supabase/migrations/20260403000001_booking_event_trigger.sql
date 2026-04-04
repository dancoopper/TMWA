-- Function: creates a calendar event whenever a booking is confirmed.
-- Runs as SECURITY DEFINER so it bypasses RLS on events/templates.
create or replace function public.create_event_from_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_workspace_id int;
  v_owner_id     uuid;
  v_template_id  int;
begin
  -- 1. Look up the share to get workspace + owner
  select workspace_id, created_by
    into v_workspace_id, v_owner_id
    from public.availability_shares
   where id = NEW.share_id;

  -- 2. Find (or create) a hidden "booking" template owned by the workspace owner
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

  -- 3. Insert a calendar event for the booked slot
  insert into public.events (workspace_id, template_id, title, date, data)
  values (
    v_workspace_id,
    v_template_id,
    'Booking: ' || NEW.booker_name,
    NEW.booked_slot_start,
    jsonb_build_object(
      'booker_name',  NEW.booker_name,
      'booker_email', NEW.booker_email
    )
  );

  return NEW;
end;
$$;

-- Trigger: fires after every new booking row
create trigger on_booking_created
  after insert on public.bookings
  for each row
  execute function public.create_event_from_booking();
