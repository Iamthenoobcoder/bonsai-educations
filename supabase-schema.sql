-- Supabase Complete Database Schema
-- Run this inside your Supabase SQL Editor to rebuild the backend from scratch.

-- Disable cascade drops to avoid accidental loss, run with caution
drop view if exists public.attendance_summary cascade;
drop table if exists public.attendance_records cascade;
drop table if exists public.attendance_sessions cascade;
drop table if exists public.scores cascade;
drop table if exists public.timetable cascade;
drop table if exists public.class_students cascade;
drop table if exists public.classes cascade;
drop table if exists public.parent_child cascade;
drop table if exists public.profiles cascade;

-- =========================================================================
-- 1. PROFILES TABLE (Extends Auth.Users)
-- =========================================================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  role text check (role in ('admin', 'teacher', 'student', 'parent')) default 'student',
  email text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Profiles are viewable by authenticated users" 
  on public.profiles for select using (auth.role() = 'authenticated');

create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);

create policy "System/Admin can insert profiles" 
  on public.profiles for insert with check (
    auth.uid() = id or 
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Automatically create profile on signup trigger
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =========================================================================
-- 2. PARENT-CHILD MAPPING
-- =========================================================================
create table public.parent_child (
  parent_id uuid references public.profiles(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (parent_id, student_id)
);

alter table public.parent_child enable row level security;

create policy "Authenticated users can select parent_child mappings" 
  on public.parent_child for select using (auth.role() = 'authenticated');

create policy "Admins can manage parent_child mappings" 
  on public.parent_child for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- =========================================================================
-- 3. CLASSES TABLE
-- =========================================================================
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  grade text not null,
  teacher_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.classes enable row level security;

create policy "Classes viewable by authenticated users" 
  on public.classes for select using (auth.role() = 'authenticated');

create policy "Admins and teachers can manage classes" 
  on public.classes for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role in ('admin', 'teacher')
    )
  );


-- =========================================================================
-- 4. CLASS-STUDENT ENROLLMENT
-- =========================================================================
create table public.class_students (
  class_id uuid references public.classes(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (class_id, student_id)
);

alter table public.class_students enable row level security;

create policy "Enrollments viewable by authenticated users" 
  on public.class_students for select using (auth.role() = 'authenticated');

create policy "Admins and teachers can manage enrollments" 
  on public.class_students for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role in ('admin', 'teacher')
    )
  );


-- =========================================================================
-- 5. TIMETABLE TABLE
-- =========================================================================
create table public.timetable (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete cascade not null,
  day text check (day in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) not null,
  subject text not null,
  start_time time not null,
  end_time time not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.timetable enable row level security;

create policy "Timetable slots viewable by authenticated users" 
  on public.timetable for select using (auth.role() = 'authenticated');

create policy "Admins can manage timetable slots" 
  on public.timetable for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- =========================================================================
-- 6. SCORES TABLE
-- =========================================================================
create table public.scores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  exam_name text not null,
  marks numeric not null,
  max_marks numeric not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.scores enable row level security;

-- Score select policies
create policy "Students can view own scores" 
  on public.scores for select using (student_id = auth.uid());

create policy "Parents can view children's scores" 
  on public.scores for select using (
    exists (
      select 1 from public.parent_child 
      where parent_child.parent_id = auth.uid() and parent_child.student_id = scores.student_id
    )
  );

create policy "Teachers and Admins can select all scores" 
  on public.scores for select using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role in ('admin', 'teacher')
    )
  );

-- Score write policies
create policy "Teachers and Admins can manage scores" 
  on public.scores for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role in ('admin', 'teacher')
    )
  );


-- =========================================================================
-- 7. ATTENDANCE SESSIONS TABLE
-- =========================================================================
create table public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete cascade not null,
  teacher_id uuid references public.profiles(id) on delete set null,
  attendance_date date not null,
  locked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_class_session unique(class_id, attendance_date)
);

alter table public.attendance_sessions enable row level security;

create policy "Sessions are viewable by authenticated users" 
  on public.attendance_sessions for select using (auth.role() = 'authenticated');

create policy "Teachers and Admins can manage sessions" 
  on public.attendance_sessions for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role in ('admin', 'teacher')
    )
  );


-- =========================================================================
-- 8. ATTENDANCE RECORDS TABLE
-- =========================================================================
create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.attendance_sessions(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('Present', 'Absent', 'Late', 'Pending')) default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_student_session unique(session_id, student_id)
);

alter table public.attendance_records enable row level security;

-- Attendance select policies
create policy "Students can view own attendance records" 
  on public.attendance_records for select using (student_id = auth.uid());

create policy "Parents can view children's attendance records" 
  on public.attendance_records for select using (
    exists (
      select 1 from public.parent_child 
      where parent_child.parent_id = auth.uid() and parent_child.student_id = attendance_records.student_id
    )
  );

create policy "Teachers and Admins can view all attendance records" 
  on public.attendance_records for select using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role in ('admin', 'teacher')
    )
  );

-- Attendance write policies
create policy "Teachers and Admins can manage attendance records" 
  on public.attendance_records for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role in ('admin', 'teacher')
    )
  );


-- =========================================================================
-- 9. ATTENDANCE SUMMARY VIEW
-- =========================================================================
create view public.attendance_summary as
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


-- =========================================================================
-- 10. INDEXES FOR PERFORMANCE
-- =========================================================================
create index idx_parent_child_parent on public.parent_child(parent_id);
create index idx_parent_child_student on public.parent_child(student_id);
create index idx_class_students_student on public.class_students(student_id);
create index idx_timetable_class on public.timetable(class_id);
create index idx_scores_student on public.scores(student_id);
create index idx_attendance_sessions_class_date on public.attendance_sessions(class_id, attendance_date);
create index idx_attendance_records_student on public.attendance_records(student_id);
create index idx_attendance_records_session on public.attendance_records(session_id);
