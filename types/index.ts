/** Zentrale Domain-Typen für DogAI. Spiegeln das DB-Schema und die KI-Verträge. */

// ---------------------------------------------------------------------------
// Rassen
// ---------------------------------------------------------------------------

export type SizeClass = 'toy' | 'small' | 'medium' | 'large' | 'giant';
export type ActivityLevel = 1 | 2 | 3 | 4 | 5;

/** Kernfakten einer Rasse — gebündelt in breeds.json, offline verfügbar. */
export type Breed = {
  id: string; // kebab-case slug, z. B. 'labrador-retriever'
  nameDe: string;
  nameEn: string;
  fciGroup: number; // FCI-Gruppe 1–10
  fciGroupName: string;
  origin: string; // Herkunftsland
  sizeClass: SizeClass;
  weightKg: [number, number]; // [min, max]
  heightCm: [number, number];
  lifespanYears: [number, number];
  coat: string;
  activity: ActivityLevel;
  temperament: string[]; // Eigenschafts-Tags
  shortDe: string;
  shortEn: string;
  predispositions: string[]; // bekannte gesundheitliche Veranlagungen (grob)
};

/** Detailtexte einer Rasse — per KI erzeugt, lokal gecacht. */
export type BreedDetail = {
  care: string;
  training: string;
  nutrition: string;
  health: string;
  behavior: string;
  generatedAt: string; // ISO
};

// ---------------------------------------------------------------------------
// Hunde & Gesundheit
// ---------------------------------------------------------------------------

export type DogSex = 'm' | 'f';

export type Dog = {
  id: string;
  userId: string;
  name: string;
  breedId: string | null;
  birthDate: string | null; // ISO date
  weightKg: number | null;
  sex: DogSex | null;
  neutered: boolean | null;
  avatarPath: string | null;
  createdAt: string;
};

export type Vaccination = {
  id: string;
  dogId: string;
  type: string;
  date: string;
  nextDue: string | null;
  note: string | null;
};

export type Medication = {
  id: string;
  dogId: string;
  name: string;
  dose: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type HealthRecord = {
  id: string;
  dogId: string;
  kind: string;
  date: string;
  summary: string;
};

// ---------------------------------------------------------------------------
// KI-Chat
// ---------------------------------------------------------------------------

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ChatSession = {
  id: string;
  userId: string;
  dogId: string | null;
  title: string;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// KI-Bilderkennung
// ---------------------------------------------------------------------------

export type ScanCategory =
  | 'skin'
  | 'wound'
  | 'coat'
  | 'eye'
  | 'tick'
  | 'allergy'
  | 'other';

export type ScanSeverity = 'info' | 'low' | 'medium' | 'high';
export type Confidence = 'low' | 'mid' | 'high';

export type ScanFinding = {
  label: string;
  confidence: Confidence;
  note: string;
};

/** Strukturierte Antwort der Vision-Edge-Function. */
export type ScanResult = {
  severity: ScanSeverity;
  findings: ScanFinding[];
  recommendation: string;
  vetRequired: boolean;
  disclaimer: string; // immer gesetzt
};

export type Scan = {
  id: string;
  userId: string;
  dogId: string | null;
  storagePath: string;
  category: ScanCategory;
  result: ScanResult | null;
  createdAt: string;
};
