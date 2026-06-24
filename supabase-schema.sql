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

-- 5. Attendance Sessions Table
create table if not exists public.attendance_sessions (
    id uuid primary key default gen_random_uuid(),
    class_id uuid not null,
    teacher_id uuid not null references public.profiles(id),
    attendance_date date not null,
    locked boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_class_session unique(class_id, attendance_date)
);

-- 6. Attendance Records Table
create table if not exists public.attendance_records (
    id uuid primary key default gen_random_uuid(),
    session_id uuid not null references public.attendance_sessions(id) on delete cascade,
    student_id uuid not null references public.profiles(id),
    status text check (status in ('Present','Absent','Late','Pending')) default 'Pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_student_session unique(session_id, student_id)
);

-- 7. Indexes for Query Performance
create index if not exists idx_attendance_sessions_class_date on public.attendance_sessions(class_id, attendance_date);
create index if not exists idx_attendance_records_student on public.attendance_records(student_id);
create index if not exists idx_attendance_records_session on public.attendance_records(session_id);

-- 8. Row Level Security (RLS) Policies
alter table public.attendance_sessions enable row level security;
alter table public.attendance_records enable row level security;

-- Sessions policies
create policy "Sessions are viewable by all profiles" 
on public.attendance_sessions for select 
using (true);

create policy "Teachers can insert sessions" 
on public.attendance_sessions for insert 
with check (
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() and profiles.role = 'teacher'
  )
);

create policy "Teachers can update sessions" 
on public.attendance_sessions for update 
using (
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() and profiles.role = 'teacher'
  )
);

-- Records policies
create policy "Teachers can view all records"
on public.attendance_records for select
using (
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() and profiles.role = 'teacher'
  )
);

create policy "Students can view only their own records"
on public.attendance_records for select
using (student_id = auth.uid());

create policy "Parents can view only their children's records"
on public.attendance_records for select
using (
  exists (
    select 1 from public.parent_child 
    where parent_child.parent_id = auth.uid() 
    and parent_child.student_id = attendance_records.student_id
  )
);

create policy "Teachers can manage records"
on public.attendance_records for all
using (
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() and profiles.role = 'teacher'
  )
);

-- 9. Attendance Summary View
create or replace view public.attendance_summary as
select 
    ar.student_id,
    asess.class_id,
    count(ar.id) as total_classes,
    sum(case when ar.status = 'Present' then 1 else 0 end) as present_count,
    sum(case when ar.status = 'Absent' then 1 else 0 end) as absent_count,
    sum(case when ar.status = 'Late' then 1 else 0 end) as late_count,
    sum(case when ar.status = 'Pending' then 1 else 0 end) as pending_count,
    round(
      (sum(case when ar.status in ('Present', 'Late') then 1 else 0 end)::numeric / 
       nullif(count(ar.id), 0)::numeric) * 100, 
      1
    ) as attendance_percentage
from public.attendance_records ar
join public.attendance_sessions asess on ar.session_id = asess.id
group by ar.student_id, asess.class_id;

