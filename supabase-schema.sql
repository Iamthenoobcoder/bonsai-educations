-- Supabase Complete Database Schema
-- Run this inside your Supabase SQL Editor to rebuild the backend from scratch.

-- Disable cascade drops to avoid accidental loss, run with caution
drop view if exists public.attendance_summary cascade;
drop table if exists public.attendance_records cascade;
drop table if exists public.attendance_sessions cascade;
drop table if exists public.scans cascade;
drop table if exists public.student_details cascade;
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
-- 7. STUDENT DETAILS TABLE (Matches StudentIDCards Sheet)
-- =========================================================================
create table public.student_details (
  "Student_ID" text primary key,
  "FirstName" text,
  "LastName" text,
  "Father" text,
  "Mother" text,
  "Subject" text,
  "Teacher" text,
  "D.O.B." text,
  "Image" text,
  "Grade" text,
  "DateOfJoining" text,
  "ExpiryDate" text,
  "Gender" text,
  "EmailAddress" text,
  "QRCode" text,
  "file_status" text,
  "file_link" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.student_details enable row level security;

-- Helper function to check if the user is an admin or teacher
create or replace function public.is_admin_or_teacher()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'teacher')
  );
end;
$$ language plpgsql security definer;

-- Policies for student_details
create policy "Select student_details"
  on public.student_details for select using (
    auth.role() = 'authenticated' and (
      public.is_admin_or_teacher() or
      "EmailAddress" = (select email from public.profiles where id = auth.uid()) or
      "Father" = (select phone from public.profiles where id = auth.uid()) or
      "Mother" = (select phone from public.profiles where id = auth.uid())
    )
  );

create policy "Admin manage student_details"
  on public.student_details for all using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );


-- =========================================================================
-- 8. SCANS TABLE (Matches Scans Sheet)
-- =========================================================================
create table public.scans (
  "Scan_ID" text primary key default gen_random_uuid()::text,
  "Student_ID" text references public.student_details("Student_ID") on delete cascade not null,
  "DateTime" timestamp with time zone not null default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.scans enable row level security;

-- Policies for scans
create policy "Select scans"
  on public.scans for select using (
    auth.role() = 'authenticated' and (
      public.is_admin_or_teacher() or
      "Student_ID" in (
        select "Student_ID" from public.student_details 
        where "EmailAddress" = (select email from public.profiles where id = auth.uid()) or
              "Father" = (select phone from public.profiles where id = auth.uid()) or
              "Mother" = (select phone from public.profiles where id = auth.uid())
      )
    )
  );

create policy "Teacher/Admin manage scans"
  on public.scans for all using (
    public.is_admin_or_teacher()
  );


-- =========================================================================
-- 9. INDEXES FOR PERFORMANCE
-- =========================================================================
create index idx_student_details_email on public.student_details("EmailAddress");
create index idx_student_details_father on public.student_details("Father");
create index idx_student_details_mother on public.student_details("Mother");
create index idx_scans_student_id on public.scans("Student_ID");
create index idx_scans_datetime on public.scans("DateTime" desc);
create index idx_parent_child_parent on public.parent_child(parent_id);
create index idx_parent_child_student on public.parent_child(student_id);
create index idx_class_students_student on public.class_students(student_id);
create index idx_timetable_class on public.timetable(class_id);
create index idx_scores_student on public.scores(student_id);
