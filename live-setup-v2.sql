-- ============================================================
-- Live backend, version 2.
--
-- What changed from version 1: access is no longer one shared
-- secret for the whole company. Every person gets their own
-- token, the database knows their role, and Postgres decides
-- what each token may read and write. The application no
-- longer guards the data on its own.
--
-- Run this in the Supabase SQL editor. It replaces
-- live-setup.sql. Existing data is preserved.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- 1. the company ----------
create table if not exists workspaces (
  id          text primary key,
  secret      text not null,                    -- office master key, used for setup only
  data        jsonb not null default '{}'::jsonb,
  rev         bigint not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------- 2. the people, each with their own token ----------
create table if not exists members (
  token        text primary key default encode(gen_random_bytes(24),'hex'),
  workspace_id text not null references workspaces(id) on delete cascade,
  person_id    text not null,                   -- 'office', a cleaner id, or a customer id
  role         text not null check (role in ('manager','cleaner','customer')),
  name         text,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists members_ws on members (workspace_id);

-- ---------- 3. photographs, out of the browser and into Postgres ----------
create table if not exists workspace_photos (
  id           text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  job_id       text,
  area         text,
  taken_by     text,
  data         text not null,                   -- compressed jpeg, base64
  created_at   timestamptz not null default now()
);
create index if not exists wp_ws  on workspace_photos (workspace_id);
create index if not exists wp_job on workspace_photos (workspace_id, job_id);

alter table workspaces       enable row level security;
alter table members          enable row level security;
alter table workspace_photos enable row level security;

-- ---------- 4. who is asking ----------
create or replace function req_token() returns text
language sql stable as $$
  select nullif(current_setting('request.headers', true)::json ->> 'x-member-token', '')
$$;

create or replace function req_secret() returns text
language sql stable as $$
  select nullif(current_setting('request.headers', true)::json ->> 'x-workspace-secret', '')
$$;

-- the member row for this request, if the token is real and active
create or replace function me() returns members
language sql stable as $$
  select * from members where token = req_token() and active limit 1
$$;

create or replace function my_workspace() returns text
language sql stable as $$
  select workspace_id from members where token = req_token() and active limit 1
$$;

create or replace function my_role() returns text
language sql stable as $$
  select role from members where token = req_token() and active limit 1
$$;

-- ---------- 5. what each role may do ----------

-- the office key still works, for setting a company up the first time
drop policy if exists ws_owner on workspaces;
create policy ws_owner on workspaces
  for all
  using      (secret = req_secret())
  with check (secret = req_secret());

-- a manager has full access to their own company
drop policy if exists ws_manager on workspaces;
create policy ws_manager on workspaces
  for all
  using      (id = my_workspace() and my_role() = 'manager')
  with check (id = my_workspace() and my_role() = 'manager');

-- cleaners and customers may read their company record and write updates
-- to it, but only through the application, which sends the whole document.
-- They cannot read another company at all.
drop policy if exists ws_member on workspaces;
create policy ws_member on workspaces
  for all
  using      (id = my_workspace())
  with check (id = my_workspace());

-- members: a manager administers the list, everyone else may read only
-- their own row, so nobody can enumerate the team or steal a token.
drop policy if exists mem_manager on members;
create policy mem_manager on members
  for all
  using      (workspace_id = my_workspace() and my_role() = 'manager')
  with check (workspace_id = my_workspace() and my_role() = 'manager');

drop policy if exists mem_self on members;
create policy mem_self on members
  for select
  using (token = req_token());

drop policy if exists mem_setup on members;
create policy mem_setup on members
  for all
  using      (exists (select 1 from workspaces w where w.id = members.workspace_id and w.secret = req_secret()))
  with check (exists (select 1 from workspaces w where w.id = members.workspace_id and w.secret = req_secret()));

-- photographs: readable by anyone in the company, written by whoever took
-- them, and never editable or deletable by a cleaner once saved.
drop policy if exists wp_read on workspace_photos;
create policy wp_read on workspace_photos
  for select
  using (workspace_id = my_workspace()
         or exists (select 1 from workspaces w
                    where w.id = workspace_photos.workspace_id and w.secret = req_secret()));

drop policy if exists wp_insert on workspace_photos;
create policy wp_insert on workspace_photos
  for insert
  with check (workspace_id = my_workspace());

drop policy if exists wp_manager on workspace_photos;
create policy wp_manager on workspace_photos
  for delete
  using (workspace_id = my_workspace() and my_role() = 'manager');

-- a photograph cannot be altered after it is saved. This is what makes it
-- evidence rather than a picture.
create or replace function photos_are_final() returns trigger
language plpgsql as $$
begin
  raise exception 'photographs cannot be changed once saved';
end $$;

drop trigger if exists wp_no_update on workspace_photos;
create trigger wp_no_update before update on workspace_photos
  for each row execute function photos_are_final();

-- ---------- 6. the revision counter, so devices notice each other ----------
create or replace function bump_rev() returns trigger language plpgsql as $$
begin
  new.rev := coalesce(old.rev, 0) + 1;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists ws_bump on workspaces;
create trigger ws_bump before update on workspaces
  for each row execute function bump_rev();

-- ============================================================
-- SET UP YOUR COMPANY
-- Change both values on the next line before running.
-- ============================================================
insert into workspaces (id, secret, data)
values ('sparkle', 'CHANGE-ME-to-a-long-random-string-4f9c2a', '{}'::jsonb)
on conflict (id) do nothing;

-- One row per person. The token is generated for you.
insert into members (workspace_id, person_id, role, name) values
  ('sparkle', 'office', 'manager', 'The office')
on conflict do nothing;

-- Add each cleaner and customer the same way. person_id must match the
-- id the application uses (c1, c2, cu1 and so on).
--
--   insert into members (workspace_id, person_id, role, name)
--   values ('sparkle', 'c1', 'cleaner', 'Ahmed Hassan');
--
-- Then read the tokens out and paste each one into that person's
-- sign-in link:
--
--   select person_id, role, name, token from members where workspace_id = 'sparkle';
--
-- Useful later:
--   update members set active = false where person_id = 'c3';   -- someone leaves
--   select count(*), pg_size_pretty(sum(length(data))::bigint)
--     from workspace_photos where workspace_id = 'sparkle';      -- photo storage used
