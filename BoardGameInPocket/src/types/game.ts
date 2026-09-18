export type Player = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  members: string[];
};

export type Difficulty = "easy" | "normal" | "hard";

export type Word = {
  id: string;
  text: string;
  themeId: string;
  difficulty: Difficulty;
};

export type ThemeCategory = {
  id: string;
  name: string;
  enabled: boolean;
  customWords: string[];
};

export type Round = {
  id: string;
  order: number;
  title: string;
  description: string;
};

export type Game = {
  id: string;
  title: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  rounds: Round[];
};
