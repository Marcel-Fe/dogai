-- DogAI — Datenbankschema
-- Migration 0001: Tabellen, Indizes, Trigger

-- ---------------------------------------------------------------------------
-- Profile (1:1 zu auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  locale        text not null default 'de',
  premium_until timestamptz,
  created_at    timestamptz not null default now()
);

-- Profil automatisch bei Registrierung anlegen.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Rassen-Stammdaten (öffentlich lesbar)
-- ---------------------------------------------------------------------------
create table if not exists public.breeds (
  id              text primary key,
  name_de         text not null,
  name_en         text not null,
  fci_group       int  not null,
  fci_group_name  text not null,
  origin          text,
  size_class      text not null,
  weight_min      numeric(5,2),
  weight_max      numeric(5,2),
  height_min      numeric(5,1),
  height_max      numeric(5,1),
  lifespan_min    int,
  lifespan_max    int,
  coat            text,
  activity        int  check (activity between 1 and 5),
  temperament     jsonb not null default '[]',
  short_de        text,
  short_en        text,
  predispositions jsonb not null default '[]'
);

create table if not exists public.breed_diseases (
  id        bigint generated always as identity primary key,
  breed_id  text not null references public.breeds(id) on delete cascade,
  disease   text not null,
  severity  text not null default 'low',
  note      text
);
create index if not exists idx_breed_diseases_breed on public.breed_diseases(breed_id);

-- ---------------------------------------------------------------------------
-- Hunde & Gesundheit
-- ---------------------------------------------------------------------------
create table if not exists public.dogs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  name        text not null,
  breed_id    text references public.breeds(id) on delete set null,
  birth_date  date,
  weight_kg   numeric(5,2),
  sex         text check (sex in ('m','f')),
  neutered    boolean,
  avatar_path text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_dogs_user on public.dogs(user_id);

create table if not exists public.vaccinations (
  id        uuid primary key default gen_random_uuid(),
  dog_id    uuid not null references public.dogs(id) on delete cascade,
  type      text not null,
  date      date not null,
  next_due  date,
  note      text
);
create index if not exists idx_vaccinations_dog on public.vaccinations(dog_id);

create table if not exists public.medications (
  id         uuid primary key default gen_random_uuid(),
  dog_id     uuid not null references public.dogs(id) on delete cascade,
  name       text not null,
  dose       text,
  start_date date,
  end_date   date
);
create index if not exists idx_medications_dog on public.medications(dog_id);

create table if not exists public.health_records (
  id      uuid primary key default gen_random_uuid(),
  dog_id  uuid not null references public.dogs(id) on delete cascade,
  kind    text not null,
  date    date not null,
  summary text not null
);
create index if not exists idx_health_records_dog on public.health_records(dog_id);

create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  dog_id       uuid not null references public.dogs(id) on delete cascade,
  storage_path text not null,
  taken_at     timestamptz not null default now()
);
create index if not exists idx_photos_dog on public.photos(dog_id);

-- ---------------------------------------------------------------------------
-- KI-Chat
-- ---------------------------------------------------------------------------
create table if not exists public.chat_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  dog_id     uuid references public.dogs(id) on delete set null,
  title      text not null default 'Neue Unterhaltung',
  created_at timestamptz not null default now()
);
create index if not exists idx_chat_sessions_user on public.chat_sessions(user_id);

create table if not exists public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role       text not null check (role in ('user','assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_chat_messages_session on public.chat_messages(session_id, created_at);

-- ---------------------------------------------------------------------------
-- KI-Bilderkennung
-- ---------------------------------------------------------------------------
create table if not exists public.scans (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  dog_id       uuid references public.dogs(id) on delete set null,
  storage_path text not null,
  category     text not null,
  result       jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists idx_scans_user on public.scans(user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Rate-Limiting (pro Nutzer und Aktion)
-- ---------------------------------------------------------------------------
create table if not exists public.rate_limits (
  user_id      uuid not null references auth.users on delete cascade,
  kind         text not null,
  count        int  not null default 0,
  window_start timestamptz not null default now(),
  primary key (user_id, kind)
);
