import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Schlanker, typisierter Cache auf AsyncStorage-Basis.
 * Genutzt für Offline-Daten: Einstellungen, KI-generierte Rassen-Details.
 */

type Entry<T> = { value: T; savedAt: number };

const PREFIX = 'dogai:';

export async function cacheSet<T>(key: string, value: T): Promise<void> {
  const entry: Entry<T> = { value, savedAt: Date.now() };
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry));
}

/**
 * Liest einen Cache-Eintrag. `maxAgeMs` verwirft zu alte Werte (gibt null zurück).
 */
export async function cacheGet<T>(key: string, maxAgeMs?: number): Promise<T | null> {
  const raw = await AsyncStorage.getItem(PREFIX + key);
  if (!raw) return null;
  try {
    const entry = JSON.parse(raw) as Entry<T>;
    if (maxAgeMs && Date.now() - entry.savedAt > maxAgeMs) return null;
    return entry.value;
  } catch {
    return null;
  }
}

export async function cacheRemove(key: string): Promise<void> {
  await AsyncStorage.removeItem(PREFIX + key);
}

/** Entfernt alle DogAI-Cache-Einträge (z. B. bei Logout). */
export async function cacheClear(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const own = keys.filter((k) => k.startsWith(PREFIX));
  if (own.length) await AsyncStorage.multiRemove(own);
}
