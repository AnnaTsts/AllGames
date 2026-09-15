export type GameRules = {
  round: number;
  gameTitle: string;
  task: string;
  forbidden: string[];
};

export const oratorRules: GameRules = {
  round: 1,
  gameTitle: "ОРАТОР",
  task: "Поясніть словами якнайбільше фраз своїй команді",
  forbidden: ["Спільнокореневі слова", "Іноземні аналоги", "Жести та міміка"],
};
