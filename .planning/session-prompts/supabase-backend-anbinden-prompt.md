# Supabase-Backend anbinden — Session Prompt for Claude Code
## Copy the prompt below and paste as first message in a new Claude Code session
---

```
Du arbeitest am Projekt DogAI (c:\Users\admin\Desktop\Hunde App\dogai).
Lies ZUERST die CLAUDE.md / AGENTS.md im Projektwurzelverzeichnis — sie enthalten
Architektur, Regeln und Workflow. Antworte auf Deutsch.

## Aufgabe: Supabase-Backend anbinden (Demo-Modus → Echtbetrieb)

### Worum geht es?
DogAI läuft aktuell im DEMO-MODUS — komplett ohne Backend. Ist keine
`EXPO_PUBLIC_SUPABASE_URL` gesetzt, ist `isDemoMode` true: feste Demo-Sitzung,
Hunde liegen in AsyncStorage, KI-Funktionen (Chat, Bilderkennung, Rassen-
Detailtexte) zeigen nur einen Hinweis. Ziel dieser Session: ein echtes Supabase-
Projekt (EU-Region) anbinden, sodass Auth, Datenbank, Storage und die KI-Edge-
Functions live laufen. Sobald `.env` echte Werte enthält, schaltet die App
automatisch in den Echtbetrieb — die Demo-Zweige deaktivieren sich selbst.

### Was BEREITS EXISTIERT (~90 % — nichts davon neu bauen!)

Lies diese Dateien VOLLSTÄNDIG, bevor du etwas änderst:

1. `supabase/README.md` — Schritt-für-Schritt-Setup-Anleitung (Projekt, CLI,
   Migrationen, Seed, Functions, Secrets). Der rote Faden dieser Session.
2. `lib/env.ts` — `isDemoMode` (~Z.13) erkennt fehlende Env; `env` (~Z.15)
   liefert Platzhalter im Demo-Modus. STATUS: COMPLETE.
3. `.env.example` — Vorlage für die anzulegende `.env`. Nur `EXPO_PUBLIC_*`.
4. `lib/supabase.ts` — Supabase-Client (~Z.11), `signedUrl`, `publicUrl`.
   STATUS: COMPLETE.
5. `supabase/migrations/0001_init.sql … 0004_retention.sql` — Schema, RLS,
   Storage-Buckets, 90-Tage-Retention. STATUS: COMPLETE, noch nicht eingespielt.
6. `supabase/functions/{chat,vision,delete-user}/index.ts` — Edge Functions
   (Deno). `chat` streamt + Modus `breed`; `vision` = Bildanalyse. STATUS:
   COMPLETE, noch nicht deployed. Lesen aus DB-Tabelle `breeds` (siehe `handleBreed`).
7. `scripts/build-breeds-seed.mjs` — erzeugt `supabase/seed_breeds.sql` aus den
   347 Rassen (`npm run seed:breeds`). STATUS: COMPLETE.
8. `features/auth/AuthContext.tsx` + `features/dogs/api.ts` — enthalten
   `isDemoMode`-Verzweigungen; im Echtbetrieb greifen automatisch die Supabase-
   Pfade. STATUS: COMPLETE — nur verifizieren, nicht umbauen.

### Was FEHLT (deine Aufgabe — 4 Lücken schließen)

**Lücke 1: Supabase-Projekt + `.env`**
- Es gibt kein `.env` → App bleibt im Demo-Modus.
- Der Nutzer muss das Supabase-Projekt im Browser anlegen (EU/Frankfurt, kein
  Konto kann ich anlegen). Danach: `.env` aus `.env.example` erstellen mit echter
  `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Vorgehen: Nutzer durch `supabase/README.md` Schritt 1 führen, Werte abfragen,
  `.env` schreiben.

**Lücke 2: Datenbank-Schema einspielen**
- Migrationen 0001–0004 sind nicht in der Cloud-DB.
- Vorgehen: `npx supabase login`, `npx supabase link --project-ref <ref>`,
  `npx supabase db push`. pg_cron im Dashboard für Migration 0004 aktivieren.

**Lücke 3: Rassen-Stammdaten seeden**
- Die Tabelle `breeds` ist leer → die `chat`-Function im Modus `breed` liefert
  404 (`handleBreed` in `supabase/functions/chat/index.ts` liest aus `breeds`).
- Vorgehen: `npm run seed:breeds`, dann `supabase/seed_breeds.sql` per psql
  oder SQL-Editor einspielen.

**Lücke 4: Edge Functions deployen + Anthropic-Secret**
- Functions sind nicht deployed, `ANTHROPIC_API_KEY` ist nicht gesetzt.
- Vorgehen: `npx supabase functions deploy chat vision delete-user`,
  `npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...` (Key hat der Nutzer).

### Constraints
- DEMO-MODUS MUSS WEITER FUNKTIONIEREN: ohne `.env` muss `isDemoMode` true
  bleiben und die App ohne Backend starten. Demo-Zweige nicht entfernen.
- Gepinnte Versionen NICHT ändern: `@supabase/supabase-js@2.49.8`,
  `babel-preset-expo@~54.0.0`, `metro.config.js` (`unstable_enablePackageExports
  = false`). Höhere supabase-js-Versionen brechen den Hermes-Build.
- `.env` ist in `.gitignore` — niemals committen.
- Supabase-Region MUSS EU (Frankfurt) sein — DSGVO.
- `ANTHROPIC_API_KEY` ausschließlich als Supabase Function Secret — niemals in
  `.env` oder im Client-Bundle.
- Die 347 Rassen in `data/breeds/*.json` und `data/breeds.ts` nicht anfassen.
- Edge Functions sind Deno-Code und in `tsconfig.json` ausgeschlossen — nicht
  in die App-Typprüfung aufnehmen.

### Workflow
1. Lies ALLE oben gelisteten Dateien vollständig, bevor du planst.
2. Behandle die 4 Lücken als getrennte, nacheinander abzuarbeitende Schritte.
3. Schritte mit Nutzeraktion (Projekt anlegen, Login, Key) klar ankündigen und
   die nötigen Werte abfragen — nicht raten.
4. Jeden Schritt sofort verifizieren (siehe Verifikation).
5. Abschluss-Regressionstest: voller Build + End-to-End-Durchlauf.
6. Kein Git-Commit ohne ausdrückliche Anweisung des Nutzers.

### Verifikation
- `npx tsc --noEmit` — fehlerfrei
- `npx expo-doctor` — 17/17
- `npx supabase migration list` — zeigt 0001–0004 als applied
- `npx supabase functions list` — chat, vision, delete-user deployed
- SQL: `select count(*) from breeds;` → 347
- `npx expo export --platform android --output-dir .expo-export-check`
  → "android bundles" ohne "Bundling failed"; danach Ordner löschen
- E2E: App starten (`npx expo start`), Account registrieren, einloggen,
  Hund anlegen, KI-Chat eine Frage stellen (Streaming kommt an), Foto-Scan
  durchführen (strukturiertes Ergebnis + Tierarzt-Hinweis)

### Was du NICHT tun darfst
- Den Demo-Modus entfernen oder die `isDemoMode`-Verzweigungen löschen.
- `@supabase/supabase-js`, `babel-preset-expo` oder `metro.config.js` upgraden/ändern.
- `.env` mit echten Schlüsseln committen oder den `service_role`-Key bzw.
  `ANTHROPIC_API_KEY` ins App-Bundle/`.env` schreiben.
- Migrationsdateien 0001–0004 oder das Rassen-JSON nachträglich umbauen.
- Ein Nicht-EU-Supabase-Projekt verwenden.
- Eigenmächtig `git push` oder `git commit` ohne Aufforderung.
```

Speicherpfad: `dogai/.planning/session-prompts/supabase-backend-anbinden-prompt.md`
