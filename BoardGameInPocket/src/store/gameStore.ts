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
  roundScores: Record<string, Record<string, number>>;
  currentTeamIndex: number;
  activeRoundIds: string[];
  currentRoundIndex: number;
  turnCorrect: number;
  turnSkipped: number;
  startGame: () => void;
  startNextRound: () => void;
  markCorrect: () => void;
  markSkipped: () => void;
  awardWord: (teamId: string) => void;
  discardWord: () => void;
  nextTeam: () => void;
};

function addToRoundScore(
  roundScores: Record<string, Record<string, number>>,
  roundId: string,
  teamId: string,
  delta: number
): Record<string, Record<string, number>> {
  const currentRoundScores = roundScores[roundId] ?? {};
  return {
    ...roundScores,
    [roundId]: {
      ...currentRoundScores,
      [teamId]: (currentRoundScores[teamId] ?? 0) + delta,
    },
  };
}

export const useGameStore = create<GameState>()((set, get) => ({
  wordPool: [],
  roundScores: {},
  currentTeamIndex: 0,
  activeRoundIds: [],
  currentRoundIndex: 0,
  turnCorrect: 0,
  turnSkipped: 0,

  startGame: () => {
    const { wordCount } = useThemeStore.getState();

    set({
      wordPool: buildWordPool(wordCount),
      roundScores: {},
      currentTeamIndex: 0,
      activeRoundIds: buildActiveRoundIds(),
      currentRoundIndex: 0,
      turnCorrect: 0,
      turnSkipped: 0,
    });
  },

  startNextRound: () => {
    const { wordCount } = useThemeStore.getState();

    set((state) => ({
      wordPool: buildWordPool(wordCount),
      currentRoundIndex: state.currentRoundIndex + 1,
    }));
  },

  markCorrect: () => {
    const { wordPool, currentTeamIndex, activeRoundIds, currentRoundIndex } = get();
    const team = useTeamStore.getState().teams[currentTeamIndex];
    const roundId = activeRoundIds[currentRoundIndex];
    if (!team || !roundId || wordPool.length === 0) return;

    set((state) => ({
      wordPool: state.wordPool.slice(1),
      roundScores: addToRoundScore(state.roundScores, roundId, team.id, 1),
      turnCorrect: state.turnCorrect + 1,
    }));
  },

  markSkipped: () => {
    const { wordPool, currentTeamIndex, activeRoundIds, currentRoundIndex } = get();
    const team = useTeamStore.getState().teams[currentTeamIndex];
    const roundId = activeRoundIds[currentRoundIndex];
    if (!team || !roundId || wordPool.length === 0) return;

    set((state) => ({
      wordPool: [...state.wordPool.slice(1), state.wordPool[0]],
      roundScores: addToRoundScore(state.roundScores, roundId, team.id, -1),
      turnSkipped: state.turnSkipped + 1,
    }));
  },

  awardWord: (teamId) => {
    const { activeRoundIds, currentRoundIndex } = get();
    const roundId = activeRoundIds[currentRoundIndex];

    set((state) => {
      if (!roundId || state.wordPool.length === 0) return state;
      return {
        wordPool: state.wordPool.slice(1),
        roundScores: addToRoundScore(state.roundScores, roundId, teamId, 1),
        turnCorrect: state.turnCorrect + 1,
      };
    });
  },

  discardWord: () => {
    set((state) => ({
      wordPool:
        state.wordPool.length > 0
          ? [...state.wordPool.slice(1), state.wordPool[0]]
          : state.wordPool,
      turnSkipped: state.turnSkipped + 1,
    }));
  },

  nextTeam: () => {
    const teamCount = useTeamStore.getState().teams.length;
    set((state) => ({
      currentTeamIndex: teamCount > 0 ? (state.currentTeamIndex + 1) % teamCount : 0,
      turnCorrect: 0,
      turnSkipped: 0,
    }));
  },
}));
