# DogAI — Supabase-Setup

Backend: Postgres + Auth + Storage + Edge Functions. **Region: EU (eu-central-1)**
für DSGVO-Konformität.

## 1. Projekt anlegen

1. Auf [supabase.com](https://supabase.com) ein neues Projekt erstellen — Region
   **Central EU (Frankfurt)**.
2. `Project URL` und `anon`-Key notieren → in die `.env` der App eintragen
   (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`).

## 2. Supabase CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref <dein-project-ref>
```

## 3. Datenbank migrieren

```bash
supabase db push
```

Spielt `migrations/0001`–`0004` ein: Schema, RLS, Storage-Buckets, 90-Tage-Retention.
Für die Retention im Dashboard unter **Database → Extensions** `pg_cron` aktivieren.

## 4. Rassen-Stammdaten seeden

Die App funktioniert offline mit der gebündelten `breeds.json`. Für KI-Rassendetails
müssen die Rassen zusätzlich in der DB liegen:

```bash
npm run seed:breeds   # erzeugt supabase/seed_breeds.sql aus breeds.json
psql "<connection-string>" -f supabase/seed_breeds.sql
```

## 5. Edge Functions deployen

```bash
supabase functions deploy chat
supabase functions deploy vision
supabase functions deploy delete-user
```

## 6. Function-Secrets setzen

Niemals im App-Bundle — ausschließlich hier:

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` und `SUPABASE_SERVICE_ROLE_KEY` werden von
Supabase automatisch in jede Function injiziert.

## 7. Auth konfigurieren

Im Dashboard unter **Authentication → Providers** E-Mail aktivieren. Für den Start
ist „Confirm email" empfehlenswert. Redirect-URL für die App: `dogai://`.

## DSGVO-Hinweise

- Auftragsverarbeitungsverträge (AVV) mit **Supabase** und **Anthropic** abschließen.
- `delete-user` entfernt Konto, alle DB-Zeilen (CASCADE) und Storage-Objekte.
- Scan-Fotos werden nach 90 Tagen automatisch gelöscht (Migration 0004).
