// Holt für alle gebündelten Rassen ein Foto vom englischen Wikipedia-Artikel
// und schreibt data/breedImages.json (breedId -> Bild-URL).
// Wiederaufnehmbar: bereits gefundene Rassen werden übersprungen.
// Aufruf: node scripts/fetch-breed-images.mjs

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'data', 'breedImages.json');

const breeds = [];
for (let i = 1; i <= 10; i++) {
  breeds.push(...JSON.parse(readFileSync(join(root, 'data', 'breeds', `g${i}.json`), 'utf8')));
}
breeds.push(...JSON.parse(readFileSync(join(root, 'data', 'breeds', 'extra.json'), 'utf8')));

const result = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {};

const UA = 'DogAI/0.1 (breed image fetch; contact marcelfehse22@gmx.de)';
const API = 'https://en.wikipedia.org/w/api.php';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wikipedia-API-Aufruf mit Retry bei Drosselung (429/5xx). */
async function getJson(params, attempt = 0) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (res.status === 429 || res.status >= 500) {
    if (attempt >= 5) throw new Error(`HTTP ${res.status} nach ${attempt} Versuchen`);
    await sleep(1000 * 2 ** attempt);
    return getJson(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function imageForTitle(title) {
  const data = await getJson({
    action: 'query',
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '800',
    redirects: '1',
    titles: title,
  });
  return data?.query?.pages?.[0]?.thumbnail?.source ?? null;
}

async function imageViaSearch(name) {
  const data = await getJson({
    action: 'query',
    list: 'search',
    srsearch: `${name} dog breed`,
    srlimit: '1',
  });
  const hit = data?.query?.search?.[0]?.title;
  return hit ? imageForTitle(hit) : null;
}

const todo = breeds.filter((b) => !result[b.id]);
console.log(`${Object.keys(result).length} bereits vorhanden, ${todo.length} offen.`);

let done = 0;
for (const breed of todo) {
  try {
    let url = await imageForTitle(breed.nameEn);
    if (!url) url = await imageViaSearch(breed.nameEn);
    if (url) result[breed.id] = url;
  } catch (e) {
    console.warn(`\n${breed.id}: ${e.message}`);
  }
  done++;
  if (done % 10 === 0 || done === todo.length) {
    const sorted = Object.fromEntries(Object.entries(result).sort());
    writeFileSync(outPath, JSON.stringify(sorted, null, 0) + '\n', 'utf8');
    process.stdout.write(`\r${done}/${todo.length} bearbeitet — ${Object.keys(result).length} Treffer gesamt`);
  }
  await sleep(250);
}

console.log(`\ndata/breedImages.json — ${Object.keys(result).length}/${breeds.length} Rassen mit Foto.`);
