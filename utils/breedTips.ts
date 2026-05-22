/**
 * Rassen-Alltagstipps — aus den strukturierten Rassendaten abgeleitet.
 * Funktioniert offline für alle Rassen, ohne Backend oder KI.
 * Die ausführlichen KI-Texte (app/breed/[id].tsx) bleiben davon unberührt.
 */

import type { Breed } from '@/types';

export type BreedTip = { title: string; text: string };

const isEn = (locale: string) => locale === 'en';

/** Bewegung — abhängig vom Aktivitätslevel 1–5. */
function exerciseTip(breed: Breed, en: boolean): BreedTip {
  const a = breed.activity;
  if (a >= 4) {
    return {
      title: en ? 'Exercise' : 'Bewegung',
      text: en
        ? 'A very active breed — plan for 1–2 hours of movement and a job to do every day.'
        : 'Eine sehr aktive Rasse — plane täglich 1–2 Stunden Bewegung und eine Aufgabe ein.',
    };
  }
  if (a <= 2) {
    return {
      title: en ? 'Exercise' : 'Bewegung',
      text: en
        ? 'A calm breed — moderate daily walks are enough; avoid overexertion.'
        : 'Eine ruhige Rasse — moderate tägliche Spaziergänge genügen; nicht überfordern.',
    };
  }
  return {
    title: en ? 'Exercise' : 'Bewegung',
    text: en
      ? 'Balanced energy — daily walks plus a bit of play or training keep this breed happy.'
      : 'Ausgeglichene Energie — tägliche Spaziergänge plus etwas Spiel oder Training reichen.',
  };
}

/** Fellpflege — anhand von Schlüsselwörtern im Fell-Text. */
function coatTip(breed: Breed, en: boolean): BreedTip {
  const coat = breed.coat.toLowerCase();
  const title = en ? 'Grooming' : 'Fellpflege';
  if (coat.includes('lang') || coat.includes('stockhaar')) {
    return {
      title,
      text: en
        ? 'Longer coat — brush several times a week to prevent matting and reduce shedding.'
        : 'Längeres Fell — mehrmals wöchentlich bürsten, um Verfilzen und Haaren vorzubeugen.',
    };
  }
  if (coat.includes('drahthaar') || coat.includes('rauhaar')) {
    return {
      title,
      text: en
        ? 'Wiry coat — needs regular brushing and occasional hand-stripping or trimming.'
        : 'Drahthaar — regelmäßig bürsten und gelegentlich trimmen lassen.',
    };
  }
  if (coat.includes('locken') || coat.includes('lockig')) {
    return {
      title,
      text: en
        ? 'Curly coat — clip or trim regularly and brush often to avoid knots.'
        : 'Lockiges Fell — regelmäßig scheren und häufig bürsten, damit keine Knoten entstehen.',
    };
  }
  return {
    title,
    text: en
      ? 'Short coat — easy to care for; a weekly brush keeps it clean and healthy.'
      : 'Kurzes Fell — pflegeleicht; einmal pro Woche bürsten hält es sauber und gesund.',
  };
}

/** Ernährung — abhängig von der Größenklasse. */
function nutritionTip(breed: Breed, en: boolean): BreedTip {
  const title = en ? 'Nutrition' : 'Ernährung';
  if (breed.sizeClass === 'large' || breed.sizeClass === 'giant') {
    return {
      title,
      text: en
        ? 'Large breed — use food formulated for large dogs and feed two smaller meals to ease the stomach.'
        : 'Große Rasse — Futter für große Hunde verwenden und auf zwei kleinere Mahlzeiten verteilen.',
    };
  }
  if (breed.sizeClass === 'toy' || breed.sizeClass === 'small') {
    return {
      title,
      text: en
        ? 'Small breed — measure portions carefully; small dogs gain weight quickly from extra treats.'
        : 'Kleine Rasse — Portionen genau abmessen; kleine Hunde nehmen durch Extras schnell zu.',
    };
  }
  return {
    title,
    text: en
      ? 'Feed a quality food matched to age and activity, and keep treats under 10% of daily intake.'
      : 'Hochwertiges Futter passend zu Alter und Aktivität füttern; Leckerlis unter 10 % des Tagesbedarfs halten.',
  };
}

/** Gesundheit — nutzt bekannte Veranlagungen, sonst allgemeine Vorsorge. */
function healthTip(breed: Breed, en: boolean): BreedTip {
  const title = en ? 'Health' : 'Gesundheit';
  if (breed.predispositions.length > 0) {
    const list = breed.predispositions.slice(0, 3).join(', ');
    return {
      title,
      text: en
        ? `Known predispositions in this breed: ${list}. Mention them to your vet and keep up preventive checkups.`
        : `Bekannte Veranlagungen dieser Rasse: ${list}. Sprich sie beim Tierarzt an und halte Vorsorge-Checks ein.`,
    };
  }
  return {
    title,
    text: en
      ? 'No major breed-typical issues listed — annual checkups and vaccinations still keep your dog healthy.'
      : 'Keine ausgeprägten rassetypischen Probleme gelistet — jährliche Checks und Impfungen halten ihn dennoch fit.',
  };
}

/** Erziehung — allgemein, leicht durch Größe akzentuiert. */
function trainingTip(breed: Breed, en: boolean): BreedTip {
  const title = en ? 'Training' : 'Erziehung';
  const big = breed.sizeClass === 'large' || breed.sizeClass === 'giant';
  return {
    title,
    text: en
      ? `Start socialization early and train with calm, positive consistency.${
          big ? ' With a strong dog, reliable recall and leash manners matter most.' : ''
        }`
      : `Früh sozialisieren und mit ruhiger, positiver Konsequenz erziehen.${
          big ? ' Bei einem kräftigen Hund sind sicherer Rückruf und Leinenführigkeit besonders wichtig.' : ''
        }`,
  };
}

/** Liefert 5 abgeleitete Alltagstipps für eine Rasse. */
export function breedTips(breed: Breed, locale: string): BreedTip[] {
  const en = isEn(locale);
  return [
    exerciseTip(breed, en),
    coatTip(breed, en),
    nutritionTip(breed, en),
    healthTip(breed, en),
    trainingTip(breed, en),
  ];
}
