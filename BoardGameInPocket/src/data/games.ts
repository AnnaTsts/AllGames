import type { Game } from "@/types/game";

export const games: Game[] = [
  {
    id: "1",
    title: "Крокодил",
    description: "Пояснюйте слова своїй команді, не називаючи їх напряму.",
    minPlayers: 4,
    maxPlayers: 12,
    rounds: [
      {
        id: "1",
        order: 1,
        title: "Поясни словами",
        description: "Опишіть слово словами, не використовуючи однокореневих слів.",
      },
      {
        id: "2",
        order: 2,
        title: "Одне слово",
        description: "Поясніть те саме слово лише одним словом.",
      },
      {
        id: "3",
        order: 3,
        title: "Покажи жестами",
        description: "Покажіть слово без слів, лише жестами та мімікою.",
      },
    ],
  },
];
