/**
 * Lokales Nutzerprofil — Name, Avatar, Akzentfarbe und Lieblingsrassen.
 * Vollständig auf dem Gerät gespeichert (AsyncStorage), kein Server, kein Konto.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AccentName } from '@/theme/accents';

export const AVATARS = ['🐶', '🐕', '🦮', '🐕‍🦺', '🐩', '🐾'] as const;

type ProfileState = {
  name: string | null;
  avatar: string;
  accent: AccentName;
  favorites: string[];
  hydrated: boolean;
  setProfile: (name: string, avatar: string) => void;
  setAccent: (accent: AccentName) => void;
  toggleFavorite: (breedId: string) => void;
  signOut: () => void;
};

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      name: null,
      avatar: '🐶',
      accent: 'orange',
      favorites: [],
      hydrated: false,
      setProfile: (name, avatar) => set({ name: name.trim(), avatar }),
      setAccent: (accent) => set({ accent }),
      toggleFavorite: (breedId) =>
        set((s) => ({
          favorites: s.favorites.includes(breedId)
            ? s.favorites.filter((id) => id !== breedId)
            : [...s.favorites, breedId],
        })),
      signOut: () => set({ name: null }),
    }),
    {
      name: 'dogai-profile',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        name: s.name,
        avatar: s.avatar,
        accent: s.accent,
        favorites: s.favorites,
      }),
      onRehydrateStorage: () => () => {
        useProfile.setState({ hydrated: true });
      },
    },
  ),
);
