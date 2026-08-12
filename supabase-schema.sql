-- ================================================================
-- Run this in Supabase: Project → SQL Editor → New query → Run
-- ================================================================

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text,
  country text not null,
  state text not null,
  num_students int not null,
  student_names text not null,
  grade text not null,        -- comma-separated if multiple selected
  subjects text not null,     -- comma-separated
  curriculum text not null,
  class_time text not null,   -- comma-separated
  source text
);

-- Turn on Row Level Security (required — Supabase blocks all access by default until you add policies)
alter table public.registrations enable row level security;

-- Anyone (the public form, using the anon key) can INSERT a new registration...
create policy "Public can submit registrations"
on public.registrations
for insert
to anon
with check (true);

-- ...but only a logged-in admin can READ the data back.
create policy "Only logged-in users can read registrations"
on public.registrations
for select
to authenticated
using (true);

-- No public update/delete policy is created, so the anon key can never
-- edit or remove existing rows — it can only add new ones.
