-- DogAI — Datenminimierung (DSGVO)
-- Migration 0004: Scan-Fotos und Scan-Datensätze nach 90 Tagen löschen.
--
-- Benötigt die Erweiterung pg_cron (im Supabase-Dashboard unter
-- Database > Extensions aktivieren). Ohne pg_cron kann die Funktion
-- public.purge_old_scans() auch manuell oder per Edge-Function-Cron laufen.

create or replace function public.purge_old_scans()
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  cutoff timestamptz := now() - interval '90 days';
begin
  -- Storage-Objekte der abgelaufenen Scans entfernen.
  delete from storage.objects
  where bucket_id = 'scan-photos'
    and id in (
      select o.id
      from storage.objects o
      join public.scans s on s.storage_path = o.name
      where s.created_at < cutoff
    );

  -- Scan-Datensätze entfernen.
  delete from public.scans where created_at < cutoff;
end;
$$;

-- Täglich um 03:30 UTC ausführen (nur wenn pg_cron verfügbar ist).
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'dogai-purge-old-scans',
      '30 3 * * *',
      $cron$ select public.purge_old_scans(); $cron$
    );
  end if;
end;
$$;
