import type { Breed } from '@/types';
import g1 from './breeds/g1.json';
import g2 from './breeds/g2.json';
import g3 from './breeds/g3.json';
import g4 from './breeds/g4.json';
import g5 from './breeds/g5.json';
import g6 from './breeds/g6.json';
import g7 from './breeds/g7.json';
import g8 from './breeds/g8.json';
import g9 from './breeds/g9.json';
import g10 from './breeds/g10.json';
import extra from './breeds/extra.json';

/**
 * Vollständiger Rassen-Katalog (alle FCI-Gruppen), gebündelt und offline verfügbar.
 * Die JSON-Tupel werden bewusst breit getypt; daher der Cast auf Breed[].
 */
export const breeds: Breed[] = [
  ...g1,
  ...g2,
  ...g3,
  ...g4,
  ...g5,
  ...g6,
  ...g7,
  ...g8,
  ...g9,
  ...g10,
  ...extra,
].sort((a, b) => a.nameDe.localeCompare(b.nameDe, 'de')) as unknown as Breed[];

/** Schneller Zugriff per ID. */
export const breedsById: Record<string, Breed> = Object.fromEntries(
  breeds.map((b) => [b.id, b]),
);

/** Eine Rasse per ID; undefined wenn unbekannt. */
export function getBreed(id: string | null | undefined): Breed | undefined {
  return id ? breedsById[id] : undefined;
}

/** Volltextsuche über deutschen und englischen Namen. */
export function searchBreeds(query: string): Breed[] {
  const q = query.trim().toLowerCase();
  if (!q) return breeds;
  return breeds.filter(
    (b) =>
      b.nameDe.toLowerCase().includes(q) || b.nameEn.toLowerCase().includes(q),
  );
}

/** Alle vorkommenden FCI-Gruppen, sortiert — für Filter-Chips. */
export const fciGroups: { group: number; name: string }[] = Array.from(
  new Map(breeds.map((b) => [b.fciGroup, b.fciGroupName])).entries(),
)
  .map(([group, name]) => ({ group, name }))
  .sort((a, b) => a.group - b.group);

export const breedCount = breeds.length;
