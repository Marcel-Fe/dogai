/** Formatierungs-Helfer für Anzeige-Werte. */

/** Alter eines Hundes aus dem Geburtsdatum, lokalisiert. */
export function dogAge(birthDate: string | null, locale: string): string | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) return null;

  const years = Math.floor(months / 12);
  const rem = months % 12;
  const isDe = locale !== 'en';

  if (years === 0) {
    return isDe
      ? `${rem} ${rem === 1 ? 'Monat' : 'Monate'}`
      : `${rem} ${rem === 1 ? 'month' : 'months'}`;
  }
  const y = isDe ? `${years} ${years === 1 ? 'Jahr' : 'Jahre'}` : `${years} yr`;
  if (rem === 0) return y;
  const m = isDe ? `${rem} Mon.` : `${rem} mo`;
  return `${y}, ${m}`;
}

/** Zahlenbereich kompakt, z. B. "25–34". */
export function formatRange([min, max]: [number, number], unit = ''): string {
  const range = min === max ? `${min}` : `${min}–${max}`;
  return unit ? `${range} ${unit}` : range;
}

/** ISO-Datum lokalisiert anzeigen. */
export function formatDate(iso: string | null, locale: string): string {
  if (!iso) return '–';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '–';
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
