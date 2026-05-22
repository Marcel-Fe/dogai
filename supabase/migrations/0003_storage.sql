-- DogAI — Storage-Buckets & Policies
-- Migration 0003
--
-- dog-avatars : öffentlich lesbar, Schreiben nur im eigenen Ordner.
-- scan-photos : privat, Zugriff nur über signierte URLs / eigenen Ordner.
-- breed-images: öffentlich lesbar (Rassenbilder), Schreiben nur Service-Role.
--
-- Konvention: erster Pfadabschnitt ist die user_id, z. B. "<uid>/<datei>.jpg".

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('dog-avatars',  'dog-avatars',  true,  5242880, array['image/jpeg','image/png','image/webp']),
  ('scan-photos',  'scan-photos',  false, 5242880, array['image/jpeg','image/png','image/webp']),
  ('breed-images', 'breed-images', true,  5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- dog-avatars: jeder darf lesen; schreiben/ändern nur im eigenen Ordner.
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'dog-avatars');
create policy "avatars_write_own" on storage.objects
  for insert with check (
    bucket_id = 'dog-avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "avatars_update_own" on storage.objects
  for update using (
    bucket_id = 'dog-avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "avatars_delete_own" on storage.objects
  for delete using (
    bucket_id = 'dog-avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- scan-photos: ausschließlich eigener Ordner, kein öffentliches Lesen.
create policy "scans_read_own" on storage.objects
  for select using (
    bucket_id = 'scan-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "scans_write_own" on storage.objects
  for insert with check (
    bucket_id = 'scan-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "scans_delete_own" on storage.objects
  for delete using (
    bucket_id = 'scan-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- breed-images: öffentlich lesbar; Schreiben nur Service-Role (kein Insert-Policy).
create policy "breed_images_public_read" on storage.objects
  for select using (bucket_id = 'breed-images');
