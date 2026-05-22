import { cacheGet, cacheSet } from '@/lib/storage';
import type { Dog, Medication, Vaccination } from '@/types';
import type { DogInput } from './api';

/**
 * Lokaler Daten-Speicher für den Demo-Modus (ohne Backend).
 * Hunde, Impfungen und Medikamente liegen in AsyncStorage statt in Supabase.
 */

const DEMO_USER_ID = 'demo-user';

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// --- Dogs --------------------------------------------------------------------

export async function demoGetDogs(): Promise<Dog[]> {
  return (await cacheGet<Dog[]>('demo:dogs')) ?? [];
}

export async function demoGetDog(dogId: string): Promise<Dog | null> {
  const dogs = await demoGetDogs();
  return dogs.find((d) => d.id === dogId) ?? null;
}

export async function demoCreateDog(input: DogInput): Promise<Dog> {
  const dogs = await demoGetDogs();
  const dog: Dog = {
    id: id(),
    userId: DEMO_USER_ID,
    name: input.name,
    breedId: input.breedId ?? null,
    birthDate: input.birthDate ?? null,
    weightKg: input.weightKg ?? null,
    sex: input.sex ?? null,
    neutered: input.neutered ?? null,
    avatarPath: input.avatarPath ?? null,
    createdAt: new Date().toISOString(),
  };
  await cacheSet('demo:dogs', [...dogs, dog]);
  return dog;
}

export async function demoUpdateDog(dogId: string, input: DogInput): Promise<Dog> {
  const dogs = await demoGetDogs();
  const updated = dogs.map((d) =>
    d.id === dogId
      ? {
          ...d,
          name: input.name,
          breedId: input.breedId ?? null,
          birthDate: input.birthDate ?? null,
          weightKg: input.weightKg ?? null,
          sex: input.sex ?? null,
          neutered: input.neutered ?? null,
          avatarPath: input.avatarPath ?? null,
        }
      : d,
  );
  await cacheSet('demo:dogs', updated);
  return updated.find((d) => d.id === dogId)!;
}

export async function demoDeleteDog(dogId: string): Promise<void> {
  const dogs = await demoGetDogs();
  await cacheSet(
    'demo:dogs',
    dogs.filter((d) => d.id !== dogId),
  );
}

// --- Vaccinations ------------------------------------------------------------

export async function demoGetVaccinations(dogId: string): Promise<Vaccination[]> {
  return (await cacheGet<Vaccination[]>(`demo:vax:${dogId}`)) ?? [];
}

export async function demoAddVaccination(v: {
  dogId: string;
  type: string;
  date: string;
  nextDue?: string | null;
  note?: string | null;
}): Promise<void> {
  const list = await demoGetVaccinations(v.dogId);
  const entry: Vaccination = {
    id: id(),
    dogId: v.dogId,
    type: v.type,
    date: v.date,
    nextDue: v.nextDue ?? null,
    note: v.note ?? null,
  };
  await cacheSet(`demo:vax:${v.dogId}`, [entry, ...list]);
}

// --- Medications -------------------------------------------------------------

export async function demoGetMedications(dogId: string): Promise<Medication[]> {
  return (await cacheGet<Medication[]>(`demo:meds:${dogId}`)) ?? [];
}

export async function demoAddMedication(m: {
  dogId: string;
  name: string;
  dose?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}): Promise<void> {
  const list = await demoGetMedications(m.dogId);
  const entry: Medication = {
    id: id(),
    dogId: m.dogId,
    name: m.name,
    dose: m.dose ?? null,
    startDate: m.startDate ?? null,
    endDate: m.endDate ?? null,
  };
  await cacheSet(`demo:meds:${m.dogId}`, [entry, ...list]);
}
