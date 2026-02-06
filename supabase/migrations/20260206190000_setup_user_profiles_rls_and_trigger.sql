-- Create the function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, is_onboarded)
  values (new.id, false);
  return new;
end;
$$;

-- Create the trigger on auth.users
-- We use 'if not exists' logic for the trigger by dropping it first if it exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up RLS policies for user_profiles
-- Users can read their own profile
create policy "Users can view own profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id);

-- Users can insert their own profile (fallback for client-side creation)
create policy "Users can insert own profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);
