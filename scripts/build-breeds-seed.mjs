// Erzeugt supabase/seed_breeds.sql aus den gebündelten Rassen-JSON-Dateien.
// Aufruf: npm run seed:breeds

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const breeds = [];
for (let i = 1; i <= 10; i++) {
  const file = join(root, 'data', 'breeds', `g${i}.json`);
  breeds.push(...JSON.parse(readFileSync(file, 'utf8')));
}
breeds.push(...JSON.parse(readFileSync(join(root, 'data', 'breeds', 'extra.json'), 'utf8')));

const esc = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const jsonb = (v) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;

const rows = breeds.map((b) => {
  const cols = [
    esc(b.id),
    esc(b.nameDe),
    esc(b.nameEn),
    b.fciGroup,
    esc(b.fciGroupName),
    esc(b.origin),
    esc(b.sizeClass),
    b.weightKg[0],
    b.weightKg[1],
    b.heightCm[0],
    b.heightCm[1],
    b.lifespanYears[0],
    b.lifespanYears[1],
    esc(b.coat),
    b.activity,
    jsonb(b.temperament),
    esc(b.shortDe),
    esc(b.shortEn),
    jsonb(b.predispositions),
  ];
  return `  (${cols.join(', ')})`;
});

const sql = `-- AUTO-GENERIERT von scripts/build-breeds-seed.mjs — nicht von Hand bearbeiten.
-- ${breeds.length} Rassen.

insert into public.breeds
  (id, name_de, name_en, fci_group, fci_group_name, origin, size_class,
   weight_min, weight_max, height_min, height_max, lifespan_min, lifespan_max,
   coat, activity, temperament, short_de, short_en, predispositions)
values
${rows.join(',\n')}
on conflict (id) do update set
  name_de = excluded.name_de,
  name_en = excluded.name_en,
  fci_group = excluded.fci_group,
  fci_group_name = excluded.fci_group_name,
  origin = excluded.origin,
  size_class = excluded.size_class,
  weight_min = excluded.weight_min,
  weight_max = excluded.weight_max,
  height_min = excluded.height_min,
  height_max = excluded.height_max,
  lifespan_min = excluded.lifespan_min,
  lifespan_max = excluded.lifespan_max,
  coat = excluded.coat,
  activity = excluded.activity,
  temperament = excluded.temperament,
  short_de = excluded.short_de,
  short_en = excluded.short_en,
  predispositions = excluded.predispositions;
`;

writeFileSync(join(root, 'supabase', 'seed_breeds.sql'), sql, 'utf8');
console.log(`supabase/seed_breeds.sql erzeugt — ${breeds.length} Rassen.`);
