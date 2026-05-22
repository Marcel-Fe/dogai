-- DogAI — Row Level Security
-- Migration 0002: RLS auf allen Tabellen.
-- Grundsatz: Nutzer sehen/ändern ausschließlich eigene Daten.
-- Rassen-Stammdaten sind öffentlich lesbar, aber nicht schreibbar.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- breeds / breed_diseases — öffentlich lesbar
-- ---------------------------------------------------------------------------
alter table public.breeds enable row level security;
alter table public.breed_diseases enable row level security;

create policy "breeds_public_read" on public.breeds
  for select using (true);
create policy "breed_diseases_public_read" on public.breed_diseases
  for select using (true);

-- ---------------------------------------------------------------------------
-- dogs — Eigentum direkt über user_id
-- ---------------------------------------------------------------------------
alter table public.dogs enable row level security;

create policy "dogs_all_own" on public.dogs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Hund-bezogene Tabellen — Eigentum über den verknüpften Hund
-- ---------------------------------------------------------------------------
create or replace function public.owns_dog(target uuid)
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.dogs d
    where d.id = target and d.user_id = auth.uid()
  );
$$;

alter table public.vaccinations enable row level security;
create policy "vaccinations_all_own" on public.vaccinations
  for all using (public.owns_dog(dog_id)) with check (public.owns_dog(dog_id));

alter table public.medications enable row level security;
create policy "medications_all_own" on public.medications
  for all using (public.owns_dog(dog_id)) with check (public.owns_dog(dog_id));

alter table public.health_records enable row level security;
create policy "health_records_all_own" on public.health_records
  for all using (public.owns_dog(dog_id)) with check (public.owns_dog(dog_id));

alter table public.photos enable row level security;
create policy "photos_all_own" on public.photos
  for all using (public.owns_dog(dog_id)) with check (public.owns_dog(dog_id));

-- ---------------------------------------------------------------------------
-- chat
-- ---------------------------------------------------------------------------
alter table public.chat_sessions enable row level security;
create policy "chat_sessions_all_own" on public.chat_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.owns_session(target uuid)
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.chat_sessions s
    where s.id = target and s.user_id = auth.uid()
  );
$$;

alter table public.chat_messages enable row level security;
create policy "chat_messages_all_own" on public.chat_messages
  for all using (public.owns_session(session_id)) with check (public.owns_session(session_id));

-- ---------------------------------------------------------------------------
-- scans
-- ---------------------------------------------------------------------------
alter table public.scans enable row level security;
create policy "scans_all_own" on public.scans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- rate_limits — nur serverseitig (service_role umgeht RLS).
-- Kein Policy => Clients haben keinen Zugriff.
-- ---------------------------------------------------------------------------
alter table public.rate_limits enable row level security;
