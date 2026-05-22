import { useQuery } from '@tanstack/react-query';
import { generateBreedDetail } from '@/lib/claude';
import { cacheGet, cacheSet } from '@/lib/storage';
import type { BreedDetail } from '@/types';

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

/**
 * Lädt die ausführlichen KI-Detailtexte zu einer Rasse.
 * Hybrid-Modell: Ergebnis wird lokal gecacht und offline weiterverwendet.
 */
export function useBreedDetail(breedId: string, locale: string) {
  return useQuery({
    queryKey: ['breedDetail', breedId, locale],
    staleTime: THIRTY_DAYS,
    queryFn: async (): Promise<BreedDetail> => {
      const cacheKey = `breedDetail:${breedId}:${locale}`;
      const cached = await cacheGet<BreedDetail>(cacheKey, THIRTY_DAYS);
      if (cached) return cached;

      const detail = await generateBreedDetail(breedId, locale);
      await cacheSet(cacheKey, detail);
      return detail;
    },
  });
}
