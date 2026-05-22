import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { isDemoMode } from '@/lib/env';
import type { Dog, Medication, Vaccination } from '@/types';
import {
  demoAddMedication,
  demoAddVaccination,
  demoCreateDog,
  demoDeleteDog,
  demoGetDog,
  demoGetDogs,
  demoGetMedications,
  demoGetVaccinations,
  demoUpdateDog,
} from './demoStore';

/**
 * Datenlayer für Hundeprofile (React Query + Supabase).
 * DB-Spalten sind snake_case, die App nutzt camelCase — Mapping hier zentral.
 */

type DogRow = {
  id: string;
  user_id: string;
  name: string;
  breed_id: string | null;
  birth_date: string | null;
  weight_kg: number | null;
  sex: 'm' | 'f' | null;
  neutered: boolean | null;
  avatar_path: string | null;
  created_at: string;
};

const toDog = (r: DogRow): Dog => ({
  id: r.id,
  userId: r.user_id,
  name: r.name,
  breedId: r.breed_id,
  birthDate: r.birth_date,
  weightKg: r.weight_kg,
  sex: r.sex,
  neutered: r.neutered,
  avatarPath: r.avatar_path,
  createdAt: r.created_at,
});

export type DogInput = {
  name: string;
  breedId?: string | null;
  birthDate?: string | null;
  weightKg?: number | null;
  sex?: 'm' | 'f' | null;
  neutered?: boolean | null;
  avatarPath?: string | null;
};

const toRow = (d: DogInput) => ({
  name: d.name,
  breed_id: d.breedId ?? null,
  birth_date: d.birthDate ?? null,
  weight_kg: d.weightKg ?? null,
  sex: d.sex ?? null,
  neutered: d.neutered ?? null,
  avatar_path: d.avatarPath ?? null,
});

// --- Dogs --------------------------------------------------------------------

export function useDogs() {
  return useQuery({
    queryKey: ['dogs'],
    queryFn: async (): Promise<Dog[]> => {
      if (isDemoMode) return demoGetDogs();
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data as DogRow[]).map(toDog);
    },
  });
}

export function useDog(id: string | undefined) {
  return useQuery({
    queryKey: ['dog', id],
    enabled: !!id,
    queryFn: async (): Promise<Dog | null> => {
      if (isDemoMode) return demoGetDog(id!);
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data ? toDog(data as DogRow) : null;
    },
  });
}

export function useCreateDog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: DogInput): Promise<Dog> => {
      if (isDemoMode) return demoCreateDog(input);
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('dogs')
        .insert({ ...toRow(input), user_id: auth.user!.id })
        .select('*')
        .single();
      if (error) throw error;
      return toDog(data as DogRow);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dogs'] }),
  });
}

export function useUpdateDog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: DogInput }): Promise<Dog> => {
      if (isDemoMode) return demoUpdateDog(id, input);
      const { data, error } = await supabase
        .from('dogs')
        .update(toRow(input))
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      return toDog(data as DogRow);
    },
    onSuccess: (dog) => {
      qc.invalidateQueries({ queryKey: ['dogs'] });
      qc.invalidateQueries({ queryKey: ['dog', dog.id] });
    },
  });
}

export function useDeleteDog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (isDemoMode) return demoDeleteDog(id);
      const { error } = await supabase.from('dogs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dogs'] }),
  });
}

// --- Vaccinations ------------------------------------------------------------

export function useVaccinations(dogId: string | undefined) {
  return useQuery({
    queryKey: ['vaccinations', dogId],
    enabled: !!dogId,
    queryFn: async (): Promise<Vaccination[]> => {
      if (isDemoMode) return demoGetVaccinations(dogId!);
      const { data, error } = await supabase
        .from('vaccinations')
        .select('*')
        .eq('dog_id', dogId!)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        dogId: r.dog_id,
        type: r.type,
        date: r.date,
        nextDue: r.next_due,
        note: r.note,
      }));
    },
  });
}

export function useAddVaccination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: {
      dogId: string;
      type: string;
      date: string;
      nextDue?: string | null;
      note?: string | null;
    }): Promise<void> => {
      if (isDemoMode) return demoAddVaccination(v);
      const { error } = await supabase.from('vaccinations').insert({
        dog_id: v.dogId,
        type: v.type,
        date: v.date,
        next_due: v.nextDue ?? null,
        note: v.note ?? null,
      });
      if (error) throw error;
    },
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ['vaccinations', v.dogId] }),
  });
}

// --- Medications -------------------------------------------------------------

export function useMedications(dogId: string | undefined) {
  return useQuery({
    queryKey: ['medications', dogId],
    enabled: !!dogId,
    queryFn: async (): Promise<Medication[]> => {
      if (isDemoMode) return demoGetMedications(dogId!);
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('dog_id', dogId!)
        .order('start_date', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        dogId: r.dog_id,
        name: r.name,
        dose: r.dose,
        startDate: r.start_date,
        endDate: r.end_date,
      }));
    },
  });
}

export function useAddMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (m: {
      dogId: string;
      name: string;
      dose?: string | null;
      startDate?: string | null;
      endDate?: string | null;
    }): Promise<void> => {
      if (isDemoMode) return demoAddMedication(m);
      const { error } = await supabase.from('medications').insert({
        dog_id: m.dogId,
        name: m.name,
        dose: m.dose ?? null,
        start_date: m.startDate ?? null,
        end_date: m.endDate ?? null,
      });
      if (error) throw error;
    },
    onSuccess: (_d, m) =>
      qc.invalidateQueries({ queryKey: ['medications', m.dogId] }),
  });
}
