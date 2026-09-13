import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { themes as initialThemes } from "@/data/themes";
import type { ThemeCategory } from "@/types/game";

export const MIN_WORD_COUNT = 5;
export const MAX_WORD_COUNT = 50;
const DEFAULT_WORD_COUNT = 20;

type ThemeState = {
  themes: ThemeCategory[];
  wordCount: number;
  allThemesSelected: boolean;
  setWordCount: (count: number) => void;
  toggleTheme: (id: string) => void;
  setAllThemesSelected: (enabled: boolean) => void;
  addTheme: (name: string) => void;
  addWordToTheme: (id: string, word: string) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themes: initialThemes,
      wordCount: DEFAULT_WORD_COUNT,
      allThemesSelected: true,
      setWordCount: (count) =>
        set({
          wordCount: Math.min(MAX_WORD_COUNT, Math.max(MIN_WORD_COUNT, count)),
        }),
      toggleTheme: (id) =>
        set((state) => ({
          themes: state.themes.map((theme) =>
            theme.id === id ? { ...theme, enabled: !theme.enabled } : theme
          ),
        })),
      setAllThemesSelected: (enabled) =>
        set((state) => ({
          allThemesSelected: enabled,
          themes: state.themes.map((theme) => ({ ...theme, enabled })),
        })),
      addTheme: (name) =>
        set((state) => ({
          themes: [
            ...state.themes,
            { id: Date.now().toString(), name, enabled: true, customWords: [] },
          ],
        })),
      addWordToTheme: (id, word) =>
        set((state) => ({
          themes: state.themes.map((theme) =>
            theme.id === id
              ? { ...theme, customWords: [...theme.customWords, word] }
              : theme
          ),
        })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
