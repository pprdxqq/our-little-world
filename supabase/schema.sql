-- Our Little World / Supabase foundation
-- Run this in the Supabase SQL editor after creating a project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Our Little World',
  created_at timestamptz not null default now()
);

create table if not exists public.room_members (
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 240),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  gift_key text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  caption text,
  media_path text,
  memory_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.room_state (
  room_id uuid primary key references public.rooms(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists room_members_user_idx on public.room_members(user_id);
create index if not exists notes_room_created_idx on public.notes(room_id, created_at desc);
create index if not exists gifts_room_created_idx on public.gifts(room_id, created_at desc);
create index if not exists memories_room_date_idx on public.memories(room_id, memory_date desc);

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.notes enable row level security;
alter table public.gifts enable row level security;
alter table public.memories enable row level security;
alter table public.room_state enable row level security;

create or replace function public.is_room_member(target_room uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.room_members
    where room_id = target_room and user_id = auth.uid()
  );
$$;

drop policy if exists "profiles_self_or_room_member" on public.profiles;
create policy "profiles_self_or_room_member" on public.profiles
for select using (
  id = auth.uid()
  or exists (
    select 1 from public.room_members mine
    join public.room_members theirs on theirs.room_id = mine.room_id
    where mine.user_id = auth.uid() and theirs.user_id = profiles.id
  )
);

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert" on public.profiles
for insert with check (id = auth.uid());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "rooms_member_read" on public.rooms;
create policy "rooms_member_read" on public.rooms
for select using (public.is_room_member(id));

drop policy if exists "room_members_read" on public.room_members;
create policy "room_members_read" on public.room_members
for select using (public.is_room_member(room_id));

drop policy if exists "notes_member_read" on public.notes;
create policy "notes_member_read" on public.notes
for select using (public.is_room_member(room_id));

drop policy if exists "notes_member_insert" on public.notes;
create policy "notes_member_insert" on public.notes
for insert with check (author_id = auth.uid() and public.is_room_member(room_id));

drop policy if exists "notes_member_update" on public.notes;
create policy "notes_member_update" on public.notes
for update using (public.is_room_member(room_id));

drop policy if exists "gifts_member_read" on public.gifts;
create policy "gifts_member_read" on public.gifts
for select using (public.is_room_member(room_id));

drop policy if exists "gifts_member_insert" on public.gifts;
create policy "gifts_member_insert" on public.gifts
for insert with check (sender_id = auth.uid() and public.is_room_member(room_id));

drop policy if exists "memories_member_read" on public.memories;
create policy "memories_member_read" on public.memories
for select using (public.is_room_member(room_id));

drop policy if exists "memories_member_insert" on public.memories;
create policy "memories_member_insert" on public.memories
for insert with check (author_id = auth.uid() and public.is_room_member(room_id));

drop policy if exists "room_state_member_read" on public.room_state;
create policy "room_state_member_read" on public.room_state
for select using (public.is_room_member(room_id));

drop policy if exists "room_state_member_write" on public.room_state;
create policy "room_state_member_write" on public.room_state
for insert with check (public.is_room_member(room_id));

create policy "room_state_member_update" on public.room_state
for update using (public.is_room_member(room_id));

-- Enable Supabase Realtime for the tables that need live updates.
alter publication supabase_realtime add table public.notes;
alter publication supabase_realtime add table public.gifts;
alter publication supabase_realtime add table public.memories;
alter publication supabase_realtime add table public.room_state;
