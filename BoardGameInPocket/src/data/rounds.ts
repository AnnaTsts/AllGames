import type { Round } from "@/types/game";

export const roundTypes: Round[] = [
  {
    id: "1",
    order: 1,
    title: "Оратор",
    description: "Покажіть своє красномовство — пояснюйте лише словами",
  },
  {
    id: "2",
    order: 2,
    title: "Крокодил",
    description: "Дайте волю артистизму — пояснюйте лише жестами та мімікою",
  },
  {
    id: "3",
    order: 3,
    title: "Антон-Палич",
    description: "Будьте лаконічні та поясніть одним словом",
  },
  {
    id: "4",
    order: 4,
    title: "Художник",
    description: "Увімкніть уяву і поясніть за допомогою малюнків",
  },
];

export const roundVisuals: Record<string, { icon: string; badgeClassName: string }> = {
  "1": { icon: "🎤", badgeClassName: "bg-rust" },
  "2": { icon: "🎭", badgeClassName: "bg-amber" },
  "3": { icon: "📜", badgeClassName: "bg-primary" },
  "4": { icon: "🎨", badgeClassName: "bg-violet" },
};
