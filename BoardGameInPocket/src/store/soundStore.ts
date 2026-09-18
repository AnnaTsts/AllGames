import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SoundState = {
  soundEnabled: boolean;
  toggleSound: () => void;
};

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: "sound-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
