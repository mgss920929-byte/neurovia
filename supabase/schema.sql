-- Neurovia Phase 1 Database Schema
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  cognitive_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.test_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  test_slug text not null,
  raw_score numeric not null,
  percentile numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
alter table public.test_results enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can view all test results"
  on public.test_results for select using (true);

create policy "Users can insert own test results"
  on public.test_results for insert with check (auth.uid() = user_id);
