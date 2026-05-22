/**
 * Tipp des Tages — kuratierte, allgemeine Hunde-Alltagstipps.
 * Funktioniert vollständig offline (kein Backend nötig) und wechselt
 * deterministisch pro Kalendertag.
 */

type Tip = { de: string; en: string };

const TIPS: Tip[] = [
  {
    de: 'Frisches Wasser sollte deinem Hund den ganzen Tag zur Verfügung stehen — wechsle es täglich.',
    en: 'Fresh water should be available to your dog all day — change it daily.',
  },
  {
    de: 'Kurze, regelmäßige Trainingseinheiten (5–10 Min.) wirken besser als seltene lange.',
    en: 'Short, regular training sessions (5–10 min) work better than rare long ones.',
  },
  {
    de: 'Belohne erwünschtes Verhalten sofort — Hunde verknüpfen Lob nur im Moment der Handlung.',
    en: 'Reward desired behavior immediately — dogs link praise only to the moment.',
  },
  {
    de: 'Kontrolliere nach Spaziergängen im Grünen auf Zecken, besonders an Kopf und Pfoten.',
    en: 'After walks in green areas, check for ticks, especially on head and paws.',
  },
  {
    de: 'Bei Hitze: Gassi früh morgens oder spät abends — Asphalt kann die Pfoten verbrennen.',
    en: 'In heat: walk early or late — hot asphalt can burn your dog’s paws.',
  },
  {
    de: 'Zahnpflege nicht vergessen: Kauartikel und gelegentliches Zähneputzen beugen Problemen vor.',
    en: 'Don’t forget dental care: chews and occasional brushing prevent problems.',
  },
  {
    de: 'Ein fester Tagesrhythmus für Futter, Gassi und Ruhe gibt deinem Hund Sicherheit.',
    en: 'A fixed daily routine for food, walks and rest gives your dog security.',
  },
  {
    de: 'Geistige Auslastung (Schnüffelspiele, Suchaufgaben) ermüdet oft mehr als reine Bewegung.',
    en: 'Mental work (sniffing games, search tasks) often tires more than exercise alone.',
  },
  {
    de: 'Wiege deinen Hund regelmäßig — schleichende Gewichtszunahme belastet Gelenke und Herz.',
    en: 'Weigh your dog regularly — creeping weight gain strains joints and heart.',
  },
  {
    de: 'Gib neuem Futter mehrere Tage Zeit: langsam unter das alte mischen vermeidet Magenprobleme.',
    en: 'Introduce new food over several days: mixing it in slowly avoids stomach upset.',
  },
  {
    de: 'Sozialkontakte mit anderen Hunden sollten positiv und entspannt sein — Qualität vor Quantität.',
    en: 'Contact with other dogs should be positive and relaxed — quality over quantity.',
  },
  {
    de: 'Achte auf Körpersprache: Gähnen, Lecken oder Wegdrehen zeigen oft Stress.',
    en: 'Watch body language: yawning, licking or turning away often signal stress.',
  },
  {
    de: 'Krallen sind zu lang, wenn sie beim Laufen auf hartem Boden klackern — dann kürzen.',
    en: 'Nails are too long if they click on hard floors when walking — trim them.',
  },
  {
    de: 'Jährliche Tierarzt-Checks erkennen Probleme früh, auch wenn dein Hund gesund wirkt.',
    en: 'Annual vet checkups catch problems early, even if your dog seems healthy.',
  },
  {
    de: 'Lass deinen Hund beim Gassi schnüffeln — das ist für ihn wie Zeitunglesen.',
    en: 'Let your dog sniff on walks — for them it’s like reading the news.',
  },
  {
    de: 'Reste vom Tisch meiden: Schokolade, Zwiebeln, Trauben und Xylit sind für Hunde giftig.',
    en: 'Avoid table scraps: chocolate, onions, grapes and xylitol are toxic to dogs.',
  },
];

/** Liefert den Tipp für den heutigen Tag in der gewünschten Sprache. */
export function dailyTip(locale: string): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const tip = TIPS[dayOfYear % TIPS.length];
  return locale === 'en' ? tip.en : tip.de;
}
