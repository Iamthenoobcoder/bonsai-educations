-- Supabase Initial Schema & Triggers
-- Run this securely inside your Supabase SQL Editor

-- 1. Create the base profiles table linked to Supabase Auth
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  role text check (role in ('admin', 'teacher', 'student', 'parent')) default 'student',
  email text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Turn on Row Level Security (RLS) policies 
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 3. Set up the automated trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- 4. Bind the Trigger to auth.users silently
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
