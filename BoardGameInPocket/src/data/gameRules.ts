export type GameRules = {
  round: number;
  gameTitle: string;
  roundName?: string;
  task: string;
  forbidden: string[];
};

export const oratorRules: GameRules = {
  round: 1,
  gameTitle: "ОРАТОР",
  task: "Поясніть словами якнайбільше фраз своїй команді",
  forbidden: ["Спільнокореневі слова", "Іноземні аналоги", "Жести та міміка"],
};

export const crocodileRules: GameRules = {
  round: 2,
  gameTitle: "КРОКОДИЛ",
  task: "Поясніть жестами та мімікою якнайбільше понять своїй команді",
  forbidden: [
    "Вимовляти слова та будь-які звуки",
    "Використовувати предмети",
    "Вказувати на людей та предмети",
  ],
};

export const antonPalichRules: GameRules = {
  round: 3,
  gameTitle: "ОРАТОР",
  roundName: "АНТОН-ПАЛИЧ",
  task: "Поясніть фразу на екрані одним словом",
  forbidden: [
    "говорити більше одного слова",
    "використовувати спільнокореневі слова",
    "використовувати жести та міміку",
  ],
};

export const artistRules: GameRules = {
  round: 4,
  gameTitle: "ХУДОЖНИК",
  task: "Поясніть малюнком якомога більше фраз своїй команді",
  forbidden: [
    "писати слова та цифри",
    "видавати будь-які звуки",
    "використовувати жести та міміку",
  ],
};
