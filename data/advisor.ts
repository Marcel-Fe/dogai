/**
 * Wissensbasis des Hunde-Beraters — kuratierte Fragen & Antworten.
 * Vollständig offline, kein Server, keine KI-API. Keyword-Suche ordnet
 * eine Nutzerfrage der besten Antwort zu.
 */

export type AdvisorCategory =
  | 'nutrition'
  | 'training'
  | 'health'
  | 'puppy'
  | 'behavior'
  | 'grooming';

export type AdvisorEntry = {
  id: string;
  category: AdvisorCategory;
  questionDe: string;
  questionEn: string;
  answerDe: string;
  answerEn: string;
  keywords: string[];
};

export const advisorCategories: { key: AdvisorCategory; de: string; en: string }[] = [
  { key: 'nutrition', de: 'Ernährung', en: 'Nutrition' },
  { key: 'training', de: 'Erziehung', en: 'Training' },
  { key: 'health', de: 'Gesundheit', en: 'Health' },
  { key: 'puppy', de: 'Welpen', en: 'Puppies' },
  { key: 'behavior', de: 'Verhalten', en: 'Behavior' },
  { key: 'grooming', de: 'Pflege', en: 'Grooming' },
];

export const advisorEntries: AdvisorEntry[] = [
  // --- Ernährung -----------------------------------------------------------
  {
    id: 'feeding-frequency',
    category: 'nutrition',
    questionDe: 'Wie oft soll ich meinen Hund füttern?',
    questionEn: 'How often should I feed my dog?',
    answerDe:
      'Erwachsene Hunde bekommen meist zwei Mahlzeiten am Tag, Welpen drei bis vier kleinere. Feste Zeiten geben Sicherheit und helfen der Verdauung. Nach dem Fressen etwa eine Stunde Ruhe einplanen.',
    answerEn:
      'Adult dogs usually do best with two meals a day, puppies with three to four smaller ones. Fixed times give security and help digestion. Plan about an hour of rest after eating.',
    keywords: ['wie oft fütter', 'füttern', 'fütter', 'mahlzeit', 'wie oft fressen', 'feed', 'how often'],
  },
  {
    id: 'feeding-amount',
    category: 'nutrition',
    questionDe: 'Wie viel Futter braucht mein Hund?',
    questionEn: 'How much food does my dog need?',
    answerDe:
      'Die Menge hängt von Gewicht, Alter und Aktivität ab. Nutze die Packungsangabe als Startwert und beobachte das Gewicht: Die Rippen sollten fühlbar, aber nicht sichtbar sein. Leckerlis zählen mit — höchstens 10 % des Tagesbedarfs.',
    answerEn:
      'The amount depends on weight, age and activity. Use the package guideline as a starting point and watch the weight: ribs should be easy to feel but not visible. Treats count too — keep them under 10% of daily intake.',
    keywords: ['wie viel futter', 'menge', 'portion', 'how much food', 'futtermenge'],
  },
  {
    id: 'toxic-foods',
    category: 'nutrition',
    questionDe: 'Welche Lebensmittel sind für Hunde giftig?',
    questionEn: 'Which foods are toxic to dogs?',
    answerDe:
      'Giftig sind unter anderem Schokolade, Zwiebeln, Knoblauch, Weintrauben und Rosinen, Avocado, Alkohol sowie der Süßstoff Xylit (in zuckerfreien Produkten). Bewahre diese sicher auf. Bei Verdacht auf Vergiftung sofort zum Tierarzt.',
    answerEn:
      'Toxic foods include chocolate, onions, garlic, grapes and raisins, avocado, alcohol and the sweetener xylitol (in sugar-free products). Keep them out of reach. If you suspect poisoning, see a vet immediately.',
    keywords: ['giftig', 'gift', 'schokolade', 'zwiebel', 'trauben', 'xylit', 'toxic', 'poison', 'gefährlich'],
  },
  {
    id: 'bones',
    category: 'nutrition',
    questionDe: 'Darf mein Hund Knochen fressen?',
    questionEn: 'Can my dog eat bones?',
    answerDe:
      'Gekochte Knochen niemals — sie splittern und können innere Verletzungen verursachen. Rohe, große Knochen nur unter Aufsicht. Sicherer sind spezielle Kauartikel aus dem Fachhandel.',
    answerEn:
      'Never give cooked bones — they splinter and can cause internal injuries. Give raw, large bones only under supervision. Purpose-made chews are the safer choice.',
    keywords: ['knochen', 'bone', 'kauen', 'kauartikel'],
  },
  {
    id: 'overweight',
    category: 'nutrition',
    questionDe: 'Mein Hund ist zu dick — was kann ich tun?',
    questionEn: 'My dog is overweight — what can I do?',
    answerDe:
      'Futter genau abwiegen statt schätzen, Leckerlis stark reduzieren und mehr Bewegung einbauen. Lass die ideale Futtermenge vom Tierarzt bestimmen — Übergewicht belastet Gelenke und Herz spürbar.',
    answerEn:
      'Weigh food precisely instead of guessing, cut treats sharply and add more exercise. Have the vet set the ideal amount — excess weight clearly strains joints and heart.',
    keywords: ['dick', 'übergewicht', 'abnehmen', 'zu fett', 'diät', 'overweight', 'fat'],
  },

  // --- Erziehung -----------------------------------------------------------
  {
    id: 'teach-sit',
    category: 'training',
    questionDe: "Wie bringe ich meinem Hund 'Sitz' bei?",
    questionEn: "How do I teach my dog to 'sit'?",
    answerDe:
      'Halte ein Leckerli über die Nase und führe es langsam nach hinten über den Kopf. Senkt sich das Hinterteil, sagst du „Sitz" und belohnst sofort. In kurzen Einheiten von wenigen Minuten üben, oft genug am Tag.',
    answerEn:
      'Hold a treat above the nose and move it slowly back over the head. When the rear lowers, say "sit" and reward at once. Practise in short sessions of a few minutes, several times a day.',
    keywords: ['sitz', 'beibringen', 'kommando', 'trick', 'teach', 'sit'],
  },
  {
    id: 'recall',
    category: 'training',
    questionDe: 'Mein Hund kommt nicht, wenn ich ihn rufe',
    questionEn: 'My dog does not come when I call',
    answerDe:
      'Lade den Rückruf positiv auf: Belohne jedes Kommen reichlich und schimpfe nie, wenn er ankommt — sonst lernt er, dass Kommen sich nicht lohnt. Übe zuerst an einer langen Leine mit wenig Ablenkung.',
    answerEn:
      'Make the recall positive: reward every return generously and never scold once the dog arrives — otherwise it learns that coming is not worth it. Practise first on a long line with few distractions.',
    keywords: ['rückruf', 'hört nicht', 'kommt nicht', 'abrufen', 'recall', 'come'],
  },
  {
    id: 'leash-pulling',
    category: 'training',
    questionDe: 'Mein Hund zieht an der Leine',
    questionEn: 'My dog pulls on the leash',
    answerDe:
      'Bleib stehen, sobald die Leine spannt, und geh erst weiter, wenn sie wieder locker ist. Belohne das Laufen an lockerer Leine. Das braucht Geduld und viele Wiederholungen, wirkt aber zuverlässig.',
    answerEn:
      'Stop the moment the leash goes tight and only move on when it is loose again. Reward walking on a loose leash. It takes patience and many repetitions but works reliably.',
    keywords: ['leine', 'zieht', 'ziehen', 'leinenführigkeit', 'pull', 'leash'],
  },
  {
    id: 'alone-training',
    category: 'training',
    questionDe: 'Wie gewöhne ich meinen Hund ans Alleinbleiben?',
    questionEn: 'How do I train my dog to stay alone?',
    answerDe:
      'In winzigen Schritten: erst Sekunden, dann Minuten, langsam steigern. Komm und geh ruhig, ohne großes Theater. Laste den Hund vorher aus, damit er entspannt ruhen kann.',
    answerEn:
      'In tiny steps: first seconds, then minutes, slowly increasing. Leave and return calmly, without a big fuss. Exercise the dog beforehand so it can rest relaxed.',
    keywords: ['allein', 'alleine', 'alleinbleiben', 'trennungsangst', 'alone', 'separation'],
  },
  {
    id: 'barking',
    category: 'training',
    questionDe: 'Mein Hund bellt zu viel',
    questionEn: 'My dog barks too much',
    answerDe:
      'Finde zuerst die Ursache: Langeweile, Angst, Wachverhalten oder Aufregung. Laste den Hund körperlich und geistig aus, belohne ruhiges Verhalten und reduziere Auslöser. Schimpfen verstärkt das Bellen oft eher.',
    answerEn:
      'First find the cause: boredom, fear, guarding or excitement. Exercise the dog physically and mentally, reward calm behavior and reduce triggers. Scolding often makes barking worse.',
    keywords: ['bellt', 'bellen', 'laut', 'bark', 'barking'],
  },

  // --- Gesundheit ----------------------------------------------------------
  {
    id: 'vet-frequency',
    category: 'health',
    questionDe: 'Wie oft muss mein Hund zum Tierarzt?',
    questionEn: 'How often should my dog see the vet?',
    answerDe:
      'Mindestens einmal im Jahr zur Vorsorgeuntersuchung mit Impfungen. Welpen und ältere Hunde sollten häufiger untersucht werden. Regelmäßige Checks erkennen Probleme früh.',
    answerEn:
      'At least once a year for a checkup with vaccinations. Puppies and senior dogs should be seen more often. Regular checks catch problems early.',
    keywords: ['tierarzt', 'check', 'untersuchung', 'vet', 'checkup'],
  },
  {
    id: 'vaccinations',
    category: 'health',
    questionDe: 'Welche Impfungen braucht mein Hund?',
    questionEn: 'Which vaccinations does my dog need?',
    answerDe:
      'Üblich sind Impfungen gegen Staupe, Hepatitis, Parvovirose, Leptospirose und Tollwut. Den genauen Plan und die Auffrischungen legt der Tierarzt fest — abhängig von Alter und Lebensumständen.',
    answerEn:
      'Common vaccinations cover distemper, hepatitis, parvovirus, leptospirosis and rabies. The vet sets the exact schedule and boosters, depending on age and lifestyle.',
    keywords: ['impfung', 'impfen', 'tollwut', 'vaccin', 'shot'],
  },
  {
    id: 'pain-signs',
    category: 'health',
    questionDe: 'Woran erkenne ich, dass mein Hund Schmerzen hat?',
    questionEn: 'How do I tell if my dog is in pain?',
    answerDe:
      'Anzeichen sind verändertes Verhalten, Rückzug, vermehrtes Hecheln, Lecken einer bestimmten Stelle, weniger Appetit oder Lahmen. Hunde verbergen Schmerzen oft — im Zweifel immer zum Tierarzt.',
    answerEn:
      'Signs include changed behavior, withdrawal, more panting, licking one spot, less appetite or limping. Dogs often hide pain — when in doubt, always see the vet.',
    keywords: ['schmerzen', 'schmerz', 'weh', 'pain', 'hurt', 'lahm'],
  },
  {
    id: 'diarrhea',
    category: 'health',
    questionDe: 'Mein Hund hat Durchfall — was tun?',
    questionEn: 'My dog has diarrhea — what should I do?',
    answerDe:
      'Bei mildem Durchfall hilft 12–24 Stunden leichte Schonkost (z. B. gekochtes Huhn mit Reis) und immer frisches Wasser. Bei Blut, Fieber, Apathie, Erbrechen oder wenn es länger als zwei Tage dauert: zum Tierarzt.',
    answerEn:
      'For mild diarrhea, 12–24 hours of bland food (e.g. boiled chicken with rice) and fresh water helps. With blood, fever, apathy, vomiting or if it lasts more than two days: see the vet.',
    keywords: ['durchfall', 'magen', 'erbrechen', 'kotzt', 'übergeben', 'diarrhea', 'vomit'],
  },
  {
    id: 'ticks-fleas',
    category: 'health',
    questionDe: 'Wie schütze ich meinen Hund vor Zecken und Flöhen?',
    questionEn: 'How do I protect my dog from ticks and fleas?',
    answerDe:
      'Nutze einen Zeckenschutz nach Empfehlung des Tierarztes (Spot-on, Tablette oder Halsband). Suche den Hund nach Spaziergängen ab und entferne Zecken früh mit einer Zeckenzange, ganz nah an der Haut.',
    answerEn:
      'Use a tick treatment recommended by your vet (spot-on, tablet or collar). Check the dog after walks and remove ticks early with a tick tool, close to the skin.',
    keywords: ['zecken', 'zecke', 'flöhe', 'floh', 'parasiten', 'tick', 'flea'],
  },

  // --- Welpen --------------------------------------------------------------
  {
    id: 'housetraining',
    category: 'puppy',
    questionDe: 'Wie wird mein Welpe stubenrein?',
    questionEn: 'How do I house-train my puppy?',
    answerDe:
      'Bring den Welpen nach Schlafen, Fressen und Spielen sofort nach draußen und lobe jedes Geschäft draußen ausgiebig. Missgeschicke drinnen ruhig ignorieren — schimpfen verunsichert nur. Mit Geduld klappt es meist in einigen Wochen.',
    answerEn:
      'Take the puppy outside right after sleeping, eating and playing, and praise every success outdoors warmly. Calmly ignore accidents indoors — scolding only unsettles. With patience it usually works within a few weeks.',
    keywords: ['stubenrein', 'pipi', 'sauber', 'pinkelt', 'house train', 'housetrain', 'potty'],
  },
  {
    id: 'puppy-school',
    category: 'puppy',
    questionDe: 'Wann sollte mein Welpe in die Hundeschule?',
    questionEn: 'When should my puppy start training class?',
    answerDe:
      'Früh — Welpenstunden beginnen oft schon mit etwa 10 bis 12 Wochen. Die frühe Sozialisierung mit anderen Hunden, Menschen und Umweltreizen prägt den Hund fürs ganze Leben.',
    answerEn:
      'Early — puppy classes often start at around 10 to 12 weeks. Early socialization with other dogs, people and everyday stimuli shapes the dog for life.',
    keywords: ['hundeschule', 'welpenstunde', 'sozialisierung', 'puppy class', 'wann beginnen'],
  },
  {
    id: 'puppy-sleep',
    category: 'puppy',
    questionDe: 'Wie viel Schlaf braucht ein Welpe?',
    questionEn: 'How much sleep does a puppy need?',
    answerDe:
      'Sehr viel — etwa 18 bis 20 Stunden am Tag. Sorge aktiv für Ruhephasen und bespiele den Welpen nicht ständig. Übermüdung zeigt sich oft als Hibbeligkeit oder Zwicken.',
    answerEn:
      'A lot — about 18 to 20 hours a day. Actively provide rest periods and do not play with the puppy constantly. Overtiredness often shows as restlessness or nipping.',
    keywords: ['welpe schlaf', 'schläft', 'ruhe', 'puppy sleep', 'müde'],
  },
  {
    id: 'puppy-feeding',
    category: 'puppy',
    questionDe: 'Wie oft und was muss ein Welpe fressen?',
    questionEn: 'How often and what should a puppy eat?',
    answerDe:
      'Welpen fressen drei bis vier kleine Mahlzeiten am Tag. Verwende hochwertiges Welpenfutter, das zur erwarteten Endgröße passt. Große Rassen brauchen spezielles Futter für langsames, gelenkschonendes Wachstum.',
    answerEn:
      'Puppies eat three to four small meals a day. Use a quality puppy food matched to the expected adult size. Large breeds need special food for slow, joint-friendly growth.',
    keywords: ['welpe füttern', 'welpe fressen', 'welpenfutter', 'puppy food', 'puppy feed'],
  },
  {
    id: 'puppy-exercise',
    category: 'puppy',
    questionDe: 'Wie viel Bewegung darf ein Welpe?',
    questionEn: 'How much exercise can a puppy have?',
    answerDe:
      'Nur dosiert: eine Faustregel sind etwa 5 Minuten pro Lebensmonat, zwei- bis dreimal täglich. Vermeide Treppensteigen, Joggen und weite Sprünge — die Gelenke wachsen noch.',
    answerEn:
      'Only in measured amounts: a rule of thumb is about 5 minutes per month of age, two to three times a day. Avoid stairs, jogging and big jumps — the joints are still growing.',
    keywords: ['welpe bewegung', 'welpe spazieren', 'gassi welpe', 'puppy exercise', 'puppy walk'],
  },

  // --- Verhalten -----------------------------------------------------------
  {
    id: 'eating-grass',
    category: 'behavior',
    questionDe: 'Warum frisst mein Hund Gras?',
    questionEn: 'Why does my dog eat grass?',
    answerDe:
      'Gelegentliches Grasfressen ist meist harmlos und kann mit Verdauung, Neugier oder schlicht Geschmack zu tun haben. Bei häufigem Erbrechen danach oder gierigem Fressen solltest du den Tierarzt fragen.',
    answerEn:
      'Occasional grass eating is usually harmless and may be linked to digestion, curiosity or simply taste. If it is often followed by vomiting or done greedily, ask the vet.',
    keywords: ['gras', 'grass', 'gras fressen', 'gras frisst'],
  },
  {
    id: 'noise-fear',
    category: 'behavior',
    questionDe: 'Mein Hund hat Angst vor Geräuschen oder Silvester',
    questionEn: 'My dog is afraid of noises or fireworks',
    answerDe:
      'Biete einen sicheren Rückzugsort und bleib selbst ruhig — übertriebenes Trösten bestätigt die Angst. Mit leisem Geräusch-Training kann man die Empfindlichkeit senken. Bei starker Angst hilft der Tierarzt mit Konzepten.',
    answerEn:
      'Offer a safe retreat and stay calm yourself — over-comforting can confirm the fear. Quiet sound training can reduce sensitivity over time. For strong fear, the vet can help with a plan.',
    keywords: ['angst', 'silvester', 'feuerwerk', 'geräusche', 'gewitter', 'fear', 'fireworks', 'thunder'],
  },
  {
    id: 'chasing',
    category: 'behavior',
    questionDe: 'Mein Hund jagt allem hinterher',
    questionEn: 'My dog chases everything',
    answerDe:
      'Jagdverhalten ist natürlich und nicht „böse". Arbeite an Impulskontrolle und einem starken Rückruf und biete erlaubte Alternativen wie eine Reizangel. Nutze anfangs eine Schleppleine zur Sicherheit.',
    answerEn:
      'Chasing is natural, not "bad". Work on impulse control and a strong recall, and offer allowed alternatives like a flirt pole. Use a long line at first for safety.',
    keywords: ['jagd', 'jagt', 'hetzt', 'jagdtrieb', 'chase', 'hunt'],
  },
  {
    id: 'dog-aggression',
    category: 'behavior',
    questionDe: 'Mein Hund reagiert aggressiv auf andere Hunde',
    questionEn: 'My dog reacts aggressively to other dogs',
    answerDe:
      'Geh frühzeitig auf Abstand und führe ruhig, bevor die Situation eskaliert. Bestrafe das Verhalten nicht — meist steckt Unsicherheit oder Angst dahinter. Hol dir Unterstützung von einem erfahrenen Hundetrainer.',
    answerEn:
      'Create distance early and lead calmly before the situation escalates. Do not punish the behavior — it usually comes from insecurity or fear. Get support from an experienced dog trainer.',
    keywords: ['aggressiv', 'aggression', 'andere hunde', 'beißt', 'knurrt', 'aggressive', 'reactive'],
  },
  {
    id: 'body-language',
    category: 'behavior',
    questionDe: 'Wie verstehe ich die Körpersprache meines Hundes?',
    questionEn: "How do I read my dog's body language?",
    answerDe:
      'Gähnen, Lecken der Schnauze oder Wegdrehen sind oft Stresssignale. Ein lockerer Körper mit weicher, wedelnder Rute zeigt Entspannung. Eine steife Haltung mit hoch getragener Rute bedeutet Anspannung.',
    answerEn:
      'Yawning, lip licking or turning away are often stress signals. A loose body with a soft, wagging tail shows relaxation. A stiff posture with a high tail means tension.',
    keywords: ['körpersprache', 'signale', 'verstehen', 'body language', 'stress'],
  },

  // --- Pflege --------------------------------------------------------------
  {
    id: 'bathing',
    category: 'grooming',
    questionDe: 'Wie oft soll ich meinen Hund baden?',
    questionEn: 'How often should I bathe my dog?',
    answerDe:
      'Nur bei Bedarf — meist reicht alle paar Monate. Zu häufiges Baden trocknet die Haut aus. Verwende immer ein mildes Hunde-Shampoo, niemals Produkte für Menschen.',
    answerEn:
      'Only when needed — usually every few months is enough. Bathing too often dries out the skin. Always use a mild dog shampoo, never products made for people.',
    keywords: ['baden', 'waschen', 'shampoo', 'bath', 'wash'],
  },
  {
    id: 'brushing',
    category: 'grooming',
    questionDe: 'Wie oft muss ich meinen Hund bürsten?',
    questionEn: 'How often should I brush my dog?',
    answerDe:
      'Kurzhaarige Hunde reichen meist einmal pro Woche, lang- oder stockhaarige brauchen es mehrmals wöchentlich. Im Fellwechsel hilft tägliches Bürsten gegen Verfilzen und lose Haare.',
    answerEn:
      'Short-haired dogs usually need brushing once a week, long- or double-coated dogs several times a week. During shedding season, daily brushing helps against matting and loose hair.',
    keywords: ['bürsten', 'fell', 'kämmen', 'haaren', 'brush', 'coat', 'shedding'],
  },
  {
    id: 'nail-trimming',
    category: 'grooming',
    questionDe: 'Wie schneide ich die Krallen meines Hundes?',
    questionEn: "How do I trim my dog's nails?",
    answerDe:
      'Kürze nur die Spitze und spare den durchbluteten Teil (das „Leben") aus. Krallen sind zu lang, wenn sie auf hartem Boden klackern. Wenn du unsicher bist, übernimmt das der Tierarzt oder Hundefriseur.',
    answerEn:
      'Trim only the tip and avoid the blood-filled part (the "quick"). Nails are too long if they click on hard floors. If unsure, let the vet or groomer do it.',
    keywords: ['krallen', 'nägel', 'krallen schneiden', 'nail', 'claw'],
  },
  {
    id: 'dental-care',
    category: 'grooming',
    questionDe: 'Wie pflege ich die Zähne meines Hundes?',
    questionEn: "How do I care for my dog's teeth?",
    answerDe:
      'Am besten regelmäßig die Zähne mit Hunde-Zahnpasta putzen, ergänzt durch Kauartikel. Der Tierarzt kontrolliert Zahnstein und entfernt ihn bei Bedarf. Gesunde Zähne beugen Schmerzen und Erkrankungen vor.',
    answerEn:
      "Ideally brush the teeth regularly with dog toothpaste, supported by chews. The vet checks for tartar and removes it when needed. Healthy teeth prevent pain and disease.",
    keywords: ['zähne', 'zahn', 'zahnpflege', 'zahnstein', 'zähneputzen', 'teeth', 'dental'],
  },
  {
    id: 'ear-care',
    category: 'grooming',
    questionDe: 'Wie pflege ich die Ohren meines Hundes?',
    questionEn: "How do I care for my dog's ears?",
    answerDe:
      'Kontrolliere die Ohren regelmäßig und reinige nur den sichtbaren Bereich mit einem Ohrreiniger für Hunde. Niemals mit Wattestäbchen tief hineingehen. Bei Geruch, Rötung oder häufigem Kratzen zum Tierarzt.',
    answerEn:
      'Check the ears regularly and clean only the visible area with a dog ear cleaner. Never push cotton swabs deep inside. With odor, redness or frequent scratching, see the vet.',
    keywords: ['ohren', 'ohr', 'ohrenpflege', 'ear', 'ears'],
  },
];

/** Sucht die Antwort, deren Stichwörter am besten zur Frage passen. */
export function findAnswer(query: string): AdvisorEntry | null {
  const q = query.toLowerCase();
  let best: AdvisorEntry | null = null;
  let bestScore = 0;
  for (const entry of advisorEntries) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return bestScore > 0 ? best : null;
}
