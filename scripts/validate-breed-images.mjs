// Prüft alle URLs in data/breedImages.json und entfernt nicht erreichbare.
// Danach kann fetch-breed-images.mjs die Lücken neu auffüllen.
// Aufruf: node scripts/validate-breed-images.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'data', 'breedImages.json');
const map = JSON.parse(readFileSync(outPath, 'utf8'));

const entries = Object.entries(map);
const dead = [];
const BATCH = 12;

for (let i = 0; i < entries.length; i += BATCH) {
  const slice = entries.slice(i, i + BATCH);
  await Promise.all(
    slice.map(async ([id, url]) => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (!res.ok) dead.push(id);
      } catch {
        dead.push(id);
      }
    }),
  );
  process.stdout.write(`\r${Math.min(i + BATCH, entries.length)}/${entries.length} geprüft — ${dead.length} defekt`);
}

for (const id of dead) delete map[id];
writeFileSync(outPath, JSON.stringify(map, null, 0) + '\n', 'utf8');
console.log(`\n${dead.length} defekte Bilder entfernt. ${Object.keys(map).length} bleiben.`);
