-- availability_shares: created by the workspace owner to share their availability
create table public.availability_shares (
  id           uuid primary key default gen_random_uuid(),
  workspace_id int  not null references public.workspaces(id) on delete cascade,
  created_by   uuid not null references public.user_profiles(id) on delete cascade,
  start_date   date not null,
  end_date     date not null,
  label        text,
  created_at   timestamptz default now()
);

-- bookings: created by the recipient via the public share link
create table public.bookings (
  id                 uuid primary key default gen_random_uuid(),
  share_id           uuid not null references public.availability_shares(id) on delete cascade,
  booker_name        text not null,
  booker_email       text not null,
  booked_slot_start  timestamptz not null,
  booked_slot_end    timestamptz not null,
  created_at         timestamptz default now()
);

-- Enable RLS on both tables
alter table public.availability_shares enable row level security;
alter table public.bookings enable row level security;

-- Shares: anyone can read (needed for the public booking page)
create policy "public read shares"
  on public.availability_shares
  for select
  using (true);

-- Shares: only the creator can insert
create policy "authenticated create shares"
  on public.availability_shares
  for insert
  with check (auth.uid() = created_by);

-- Bookings: anyone can read (so already-booked slots can be shown greyed out)
create policy "public read bookings"
  on public.bookings
  for select
  using (true);

-- Bookings: anyone with the link can insert (public booking form)
create policy "public insert bookings"
  on public.bookings
  for insert
  with check (true);
