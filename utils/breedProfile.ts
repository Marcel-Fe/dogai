/**
 * Steckbrief-Bewertungen einer Rasse — aus den strukturierten Rassendaten
 * berechnet. Werte 1–5, vollständig offline, kein Backend nötig.
 */

import type { Breed } from '@/types';

export type BreedRating = { key: string; label: string; value: number };

/** true, wenn eines der Wesensmerkmale eines der Stichwörter enthält. */
function tagHas(tags: string[], words: string[]): boolean {
  return tags.some((t) => {
    const low = t.toLowerCase();
    return words.some((w) => low.includes(w));
  });
}

const clamp = (n: number): number => Math.max(1, Math.min(5, Math.round(n)));

const SIZE_RANK: Record<Breed['sizeClass'], number> = {
  toy: 1,
  small: 2,
  medium: 3,
  large: 4,
  giant: 5,
};

/** Liefert sieben bewertete Steckbrief-Merkmale für eine Rasse. */
export function breedRatings(breed: Breed, locale: string): BreedRating[] {
  const en = locale === 'en';
  const t = breed.temperament;
  const coat = breed.coat.toLowerCase();
  const size = SIZE_RANK[breed.sizeClass];

  // Pflegeaufwand — aus der Fellbeschreibung.
  let grooming = 3;
  if (coat.includes('lang') || coat.includes('locken') || coat.includes('lockig')) grooming = 5;
  else if (coat.includes('drahthaar') || coat.includes('rauhaar') || coat.includes('stockhaar')) grooming = 4;
  else if (coat.includes('kurz')) grooming = 2;

  // Bewegungsbedarf — entspricht dem Aktivitätslevel.
  const exercise = breed.activity;

  // Lernfreude / Trainierbarkeit.
  let trainability = 3;
  if (tagHas(t, ['lernfreudig', 'intelligent', 'gelehrig', 'arbeitswillig', 'aufmerksam', 'klug', 'gehorsam', 'folgsam']))
    trainability += 2;
  if (tagHas(t, ['eigenständig', 'eigensinnig', 'stur', 'unabhängig', 'dickköpfig']))
    trainability -= 2;
  trainability = clamp(trainability);

  // Familieneignung.
  let family = 3;
  if (tagHas(t, ['familie', 'kinderlieb', 'kinderfreundlich', 'gutmütig', 'sanft', 'freundlich', 'verschmust', 'liebevoll', 'geduldig', 'verträglich']))
    family += 2;
  if (tagHas(t, ['aggressiv', 'dominant', 'reserviert', 'misstrauisch', 'territorial']))
    family -= 1;
  if (breed.activity >= 5) family -= 1;
  family = clamp(family);

  // Anfänger-Tauglichkeit.
  let beginner = 3 + (trainability - 3) * 0.5;
  if (breed.activity >= 5) beginner -= 1;
  if (size >= 5) beginner -= 1;
  if (tagHas(t, ['eigenständig', 'dominant', 'eigensinnig', 'stur', 'schützend', 'temperamentvoll']))
    beginner -= 1;
  if (tagHas(t, ['gutmütig', 'freundlich', 'ausgeglichen', 'anpassungsfähig', 'sanft', 'gelassen']))
    beginner += 1;
  beginner = clamp(beginner);

  // Wohnungstauglichkeit — kleine, ruhige Hunde eignen sich besser.
  const apartment = clamp(6 - (size + breed.activity) / 2);

  // Wachsamkeit.
  let watch = 2;
  if (tagHas(t, ['wachsam', 'wachhund', 'schützend', 'territorial', 'misstrauisch', 'aufmerksam']))
    watch += 2;
  if (breed.fciGroup === 2) watch += 1;
  watch = clamp(watch);

  return [
    { key: 'family', label: en ? 'Family-friendly' : 'Familieneignung', value: family },
    { key: 'beginner', label: en ? 'Good for beginners' : 'Anfänger-Tauglichkeit', value: beginner },
    { key: 'apartment', label: en ? 'Apartment-friendly' : 'Wohnungstauglich', value: apartment },
    { key: 'trainability', label: en ? 'Trainability' : 'Lernfreude', value: trainability },
    { key: 'exercise', label: en ? 'Exercise need' : 'Bewegungsbedarf', value: exercise },
    { key: 'grooming', label: en ? 'Grooming effort' : 'Pflegeaufwand', value: grooming },
    { key: 'watchfulness', label: en ? 'Watchfulness' : 'Wachsamkeit', value: watch },
  ];
}
