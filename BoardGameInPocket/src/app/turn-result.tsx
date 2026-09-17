import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

import { roundRulesRoute, roundTypes } from "@/data/rounds";
import { useGameStore } from "@/store/gameStore";

function pluralizePoints(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "очко";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "очки";
  return "очок";
}

export default function TurnResult() {
  const router = useRouter();
  const activeRoundIds = useGameStore((state) => state.activeRoundIds);
  const currentRoundIndex = useGameStore((state) => state.currentRoundIndex);
  const turnCorrect = useGameStore((state) => state.turnCorrect);
  const turnSkipped = useGameStore((state) => state.turnSkipped);
  const nextTeam = useGameStore((state) => state.nextTeam);
  const startNextRound = useGameStore((state) => state.startNextRound);

  const [soundOn, setSoundOn] = useState(true);

  const currentRoundId = activeRoundIds[currentRoundIndex];
  const currentRound = roundTypes.find((round) => round.id === currentRoundId);
  const score = turnCorrect - turnSkipped;

  const handleNextTeam = () => {
    nextTeam();
    const { wordPool, activeRoundIds: rounds, currentRoundIndex: roundIndex } =
      useGameStore.getState();

    if (wordPool.length > 0) {
      router.replace("/team-turn");
      return;
    }

    const nextRoundId = rounds[roundIndex + 1];
    if (nextRoundId) {
      startNextRound();
      router.replace(roundRulesRoute[nextRoundId]);
    } else {
      router.replace("/results");
    }
  };

  return (
    <View className="flex-1 bg-tan">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between px-6 pt-2">
          <Pressable onPress={() => router.push("/")} hitSlop={8}>
            <Text className="text-2xl">🏠</Text>
          </Pressable>

          <Pressable
            onPress={() => setSoundOn((prev) => !prev)}
            className="h-10 w-10 items-center justify-center rounded-full bg-rust"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text className="text-lg">{soundOn ? "🔊" : "🔈"}</Text>
          </Pressable>
        </View>

        <View className="flex-1 items-center px-6 pt-6">
          <Text className="text-center font-nunito-bold text-h1 uppercase text-brown">
            {currentRound?.title}
          </Text>

          <Text className="mt-10 text-center font-nunito-regular text-body-lg text-brown">
            Ваша команда набрала:
          </Text>
          <Text className="mt-2 font-nunito-bold text-6xl text-brown">{score}</Text>
          <Text className="mt-1 font-nunito-regular text-body-lg text-brown">
            {pluralizePoints(score)}
          </Text>

          <View className="mt-10 items-center gap-1 rounded-full bg-cream px-8 py-5">
            <Text className="font-nunito-semibold text-body-lg text-brown">
              {turnCorrect} вгадано, {turnSkipped} пропущено
            </Text>
            <Pressable hitSlop={8} className="flex-row items-center gap-1">
              <Text className="font-nunito-regular text-body-md text-muted-foreground">
                Редагувати
              </Text>
              <Text className="text-body-md">✏️</Text>
            </Pressable>
          </View>
        </View>

        <View className="-translate-y-[10%] px-6 pb-6 pt-2">
          <Pressable
            onPress={handleNextTeam}
            className="button--brown"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Text className="font-nunito-bold text-h3 text-cream">Наступна команда</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
