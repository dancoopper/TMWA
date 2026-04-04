-- Booked events must store full range: `date` = start, `ends_at` = end (matches app Event model).
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
  select workspace_id, created_by, coalesce(label, 'Booking')
    into v_workspace_id, v_owner_id, v_label
    from public.availability_shares
   where id = NEW.share_id;

  insert into public.templates (user_id, name, data, is_hidden)
  values (v_owner_id, '__booking__', '[]'::jsonb, true)
  on conflict do nothing;

  select id into v_template_id
    from public.templates
   where user_id = v_owner_id
     and name    = '__booking__';

  insert into public.events (
    workspace_id,
    template_id,
    title,
    date,
    ends_at,
    data
  )
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
