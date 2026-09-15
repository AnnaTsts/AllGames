import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { roundTypes } from "@/data/rounds";

type RoundState = {
  selectedRoundIds: string[];
  toggleRound: (id: string) => void;
};

export const useRoundStore = create<RoundState>()(
  persist(
    (set) => ({
      selectedRoundIds: roundTypes.map((round) => round.id),
      toggleRound: (id) =>
        set((state) => ({
          selectedRoundIds: state.selectedRoundIds.includes(id)
            ? state.selectedRoundIds.filter((roundId) => roundId !== id)
            : [...state.selectedRoundIds, id],
        })),
    }),
    {
      name: "round-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
