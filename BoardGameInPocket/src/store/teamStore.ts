import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { players } from "@/data/players";
import { teams as initialTeams } from "@/data/teams";
import type { Team } from "@/types/game";

const DEFAULT_MEMBER_COUNT = 2;

function pickRandomName(exclude: string[]): string {
  const available = players.map((player) => player.name).filter((name) => !exclude.includes(name));
  const pool = available.length > 0 ? available : players.map((player) => player.name);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickRandomMembers(count: number): string[] {
  const members: string[] = [];
  for (let i = 0; i < count; i++) {
    members.push(pickRandomName(members));
  }
  return members;
}

type TeamState = {
  teams: Team[];
  selectedTeamName: string | null;
  selectTeam: (name: string) => void;
  addTeam: (name: string) => void;
  addMember: (teamId: string) => void;
};

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      teams: initialTeams,
      selectedTeamName: null,
      selectTeam: (name) => set({ selectedTeamName: name }),
      addTeam: (name) =>
        set((state) => ({
          teams: [
            ...state.teams,
            {
              id: Date.now().toString(),
              name,
              members: pickRandomMembers(DEFAULT_MEMBER_COUNT),
            },
          ],
        })),
      addMember: (teamId) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? { ...team, members: [...team.members, pickRandomName(team.members)] }
              : team
          ),
        })),
    }),
    {
      name: "team-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
