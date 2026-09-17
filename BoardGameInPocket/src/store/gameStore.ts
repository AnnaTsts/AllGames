import { create } from "zustand";

import { roundTypes } from "@/data/rounds";
import { words as allWords } from "@/data/words";
import { useRoundStore } from "@/store/roundStore";
import { useTeamStore } from "@/store/teamStore";
import { useThemeStore } from "@/store/themeStore";
import type { Word } from "@/types/game";

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildWordPool(wordCount: number): Word[] {
  const { themes } = useThemeStore.getState();
  const enabledThemes = themes.filter((theme) => theme.enabled);
  const enabledThemeIds = new Set(enabledThemes.map((theme) => theme.id));

  const candidates: Word[] = allWords.filter((word) => enabledThemeIds.has(word.themeId));

  enabledThemes.forEach((theme) => {
    theme.customWords.forEach((text, index) => {
      candidates.push({ id: `custom-${theme.id}-${index}`, text, themeId: theme.id });
    });
  });

  return shuffle(candidates).slice(0, wordCount);
}

function buildActiveRoundIds(): string[] {
  const { selectedRoundIds } = useRoundStore.getState();
  const selected = roundTypes
    .filter((round) => selectedRoundIds.includes(round.id))
    .sort((a, b) => a.order - b.order)
    .map((round) => round.id);

  return selected.length > 0
    ? selected
    : [...roundTypes].sort((a, b) => a.order - b.order).map((round) => round.id);
}

type GameState = {
  wordPool: Word[];
  teamScores: Record<string, number>;
  currentTeamIndex: number;
  activeRoundIds: string[];
  currentRoundIndex: number;
  startGame: () => void;
  startNextRound: () => void;
  markCorrect: () => void;
  markSkipped: () => void;
  awardWord: (teamId: string) => void;
  discardWord: () => void;
  nextTeam: () => void;
};

export const useGameStore = create<GameState>()((set, get) => ({
  wordPool: [],
  teamScores: {},
  currentTeamIndex: 0,
  activeRoundIds: [],
  currentRoundIndex: 0,

  startGame: () => {
    const { teams } = useTeamStore.getState();
    const { wordCount } = useThemeStore.getState();

    set({
      wordPool: buildWordPool(wordCount),
      teamScores: Object.fromEntries(teams.map((team) => [team.id, 0])),
      currentTeamIndex: 0,
      activeRoundIds: buildActiveRoundIds(),
      currentRoundIndex: 0,
    });
  },

  startNextRound: () => {
    const { wordCount } = useThemeStore.getState();

    set((state) => ({
      wordPool: buildWordPool(wordCount),
      currentTeamIndex: 0,
      currentRoundIndex: state.currentRoundIndex + 1,
    }));
  },

  markCorrect: () => {
    const { wordPool, currentTeamIndex } = get();
    const team = useTeamStore.getState().teams[currentTeamIndex];
    if (!team || wordPool.length === 0) return;

    set((state) => ({
      wordPool: state.wordPool.slice(1),
      teamScores: {
        ...state.teamScores,
        [team.id]: (state.teamScores[team.id] ?? 0) + 1,
      },
    }));
  },

  markSkipped: () => {
    const { wordPool, currentTeamIndex } = get();
    const team = useTeamStore.getState().teams[currentTeamIndex];
    if (!team || wordPool.length === 0) return;

    set((state) => ({
      wordPool: [...state.wordPool.slice(1), state.wordPool[0]],
      teamScores: {
        ...state.teamScores,
        [team.id]: (state.teamScores[team.id] ?? 0) - 1,
      },
    }));
  },

  awardWord: (teamId) => {
    set((state) => {
      if (state.wordPool.length === 0) return state;
      return {
        wordPool: state.wordPool.slice(1),
        teamScores: {
          ...state.teamScores,
          [teamId]: (state.teamScores[teamId] ?? 0) + 1,
        },
      };
    });
  },

  discardWord: () => {
    set((state) => ({ wordPool: state.wordPool.slice(1) }));
  },

  nextTeam: () => {
    const teamCount = useTeamStore.getState().teams.length;
    set((state) => ({
      currentTeamIndex: teamCount > 0 ? (state.currentTeamIndex + 1) % teamCount : 0,
    }));
  },
}));
