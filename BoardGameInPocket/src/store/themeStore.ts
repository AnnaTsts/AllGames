import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { themes as initialThemes } from "@/data/themes";
import type { Difficulty, ThemeCategory } from "@/types/game";

export const MIN_WORD_COUNT = 5;
export const MAX_WORD_COUNT = 50;
const DEFAULT_WORD_COUNT = 20;

const DEFAULT_DIFFICULTIES: Record<Difficulty, boolean> = {
  easy: false,
  normal: false,
  hard: true,
};

type ThemeState = {
  themes: ThemeCategory[];
  wordCount: number;
  allThemesSelected: boolean;
  difficulties: Record<Difficulty, boolean>;
  setWordCount: (count: number) => void;
  toggleTheme: (id: string) => void;
  setAllThemesSelected: (enabled: boolean) => void;
  addTheme: (name: string) => void;
  renameTheme: (id: string, name: string) => void;
  addWordToTheme: (id: string, word: string) => void;
  updateWordInTheme: (id: string, wordIndex: number, word: string) => void;
  removeWordFromTheme: (id: string, wordIndex: number) => void;
  toggleDifficulty: (difficulty: Difficulty) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themes: initialThemes,
      wordCount: DEFAULT_WORD_COUNT,
      allThemesSelected: true,
      difficulties: DEFAULT_DIFFICULTIES,
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
            {
              id: Date.now().toString(),
              name,
              emoji: "✏️",
              enabled: true,
              customWords: [],
              isCustom: true,
            },
          ],
        })),
      renameTheme: (id, name) =>
        set((state) => ({
          themes: state.themes.map((theme) => (theme.id === id ? { ...theme, name } : theme)),
        })),
      addWordToTheme: (id, word) =>
        set((state) => ({
          themes: state.themes.map((theme) =>
            theme.id === id
              ? { ...theme, customWords: [...theme.customWords, word] }
              : theme
          ),
        })),
      updateWordInTheme: (id, wordIndex, word) =>
        set((state) => ({
          themes: state.themes.map((theme) =>
            theme.id === id
              ? {
                  ...theme,
                  customWords: theme.customWords.map((existing, index) =>
                    index === wordIndex ? word : existing
                  ),
                }
              : theme
          ),
        })),
      removeWordFromTheme: (id, wordIndex) =>
        set((state) => ({
          themes: state.themes.map((theme) =>
            theme.id === id
              ? { ...theme, customWords: theme.customWords.filter((_, index) => index !== wordIndex) }
              : theme
          ),
        })),
      toggleDifficulty: (difficulty) =>
        set((state) => ({
          difficulties: {
            ...state.difficulties,
            [difficulty]: !state.difficulties[difficulty],
          },
        })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as ThemeState;
        const customThemes = state?.themes?.filter((theme) => theme.isCustom) ?? [];
        return { ...state, themes: [...initialThemes, ...customThemes] };
      },
    }
  )
);
