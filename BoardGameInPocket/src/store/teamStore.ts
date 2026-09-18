import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { players } from "@/data/players";
import { teamNames } from "@/data/teamNames";
import { teams as initialTeams } from "@/data/teams";
import type { Team } from "@/types/game";

const DEFAULT_MEMBER_COUNT = 2;
const MIN_MEMBER_COUNT = 2;

function pickRandomName(exclude: string[]): string {
  const available = players.map((player) => player.name).filter((name) => !exclude.includes(name));
  const pool = available.length > 0 ? available : players.map((player) => player.name);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickRandomTeamName(exclude: string[]): string {
  const available = teamNames.filter((name) => !exclude.includes(name));
  const pool = available.length > 0 ? available : teamNames;
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
  deleteTeam: (teamId: string) => void;
  deleteMember: (teamId: string, member: string) => void;
  renameTeam: (teamId: string, name: string) => void;
  renameMember: (teamId: string, oldName: string, newName: string) => void;
  randomizeTeamName: (teamId: string) => void;
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
      deleteTeam: (teamId) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== teamId),
        })),
      deleteMember: (teamId, member) =>
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.id !== teamId || team.members.length <= MIN_MEMBER_COUNT) {
              return team;
            }
            const index = team.members.indexOf(member);
            if (index === -1) return team;
            return {
              ...team,
              members: [
                ...team.members.slice(0, index),
                ...team.members.slice(index + 1),
              ],
            };
          }),
        })),
      renameTeam: (teamId, name) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId ? { ...team, name } : team
          ),
        })),
      renameMember: (teamId, oldName, newName) =>
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.id !== teamId) return team;
            const index = team.members.indexOf(oldName);
            if (index === -1) return team;
            return {
              ...team,
              members: [
                ...team.members.slice(0, index),
                newName,
                ...team.members.slice(index + 1),
              ],
            };
          }),
        })),
      randomizeTeamName: (teamId) =>
        set((state) => {
          const usedNames = state.teams.map((team) => team.name);
          return {
            teams: state.teams.map((team) =>
              team.id === teamId
                ? { ...team, name: pickRandomTeamName(usedNames) }
                : team
            ),
          };
        }),
    }),
    {
      name: "team-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
