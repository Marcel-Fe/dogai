import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Scan, ScanCategory, ScanResult } from '@/types';

/** Datenlayer für KI-Bilderkennung (Scans). */

type ScanRow = {
  id: string;
  user_id: string;
  dog_id: string | null;
  storage_path: string;
  category: string;
  result: ScanResult | null;
  created_at: string;
};

const toScan = (r: ScanRow): Scan => ({
  id: r.id,
  userId: r.user_id,
  dogId: r.dog_id,
  storagePath: r.storage_path,
  category: r.category as ScanCategory,
  result: r.result,
  createdAt: r.created_at,
});

/** Verlauf aller Scans des Nutzers, neueste zuerst. */
export function useScans() {
  return useQuery({
    queryKey: ['scans'],
    queryFn: async (): Promise<Scan[]> => {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as ScanRow[]).map(toScan);
    },
  });
}

/** Einzelner Scan per ID. */
export function useScan(id: string | undefined) {
  return useQuery({
    queryKey: ['scan', id],
    enabled: !!id,
    queryFn: async (): Promise<Scan | null> => {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data ? toScan(data as ScanRow) : null;
    },
  });
}

/** Legt einen Scan-Datensatz an und gibt die ID zurück. */
export async function createScanRecord(
  storagePath: string,
  category: ScanCategory,
  dogId: string | null,
): Promise<string> {
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('scans')
    .insert({
      user_id: auth.user!.id,
      dog_id: dogId,
      storage_path: storagePath,
      category,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

/** Nach erfolgreichem Scan den Verlauf aktualisieren. */
export function useInvalidateScans() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['scans'] });
}
