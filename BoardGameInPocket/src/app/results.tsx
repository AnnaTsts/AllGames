import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { roundTypes } from "@/data/rounds";
import { useGameStore } from "@/store/gameStore";
import { useTeamStore } from "@/store/teamStore";
import type { Round, Team } from "@/types/game";

const TOP_RESULT_COUNT = 3;

const BADGES = [
  { icon: "🌿", className: "bg-primary" },
  { icon: "🔮", className: "bg-violet" },
  { icon: "🛡️", className: "bg-info" },
  { icon: "⚡", className: "bg-brown" },
  { icon: "🛡️", className: "bg-rust" },
  { icon: "☀️", className: "bg-amber" },
  { icon: "🌙", className: "bg-teal" },
  { icon: "🌀", className: "bg-gray-700" },
];

type TeamResult = {
  team: Team;
  roundScores: number[];
  total: number;
};

export default function Results() {
  const router = useRouter();
  const teams = useTeamStore((state) => state.teams);
  const activeRoundIds = useGameStore((state) => state.activeRoundIds);
  const roundScores = useGameStore((state) => state.roundScores);

  const playedRounds = useMemo<Round[]>(
    () =>
      activeRoundIds
        .map((roundId) => roundTypes.find((round) => round.id === roundId))
        .filter((round): round is Round => round !== undefined),
    [activeRoundIds]
  );

  const results = useMemo<TeamResult[]>(() => {
    return teams
      .map((team) => {
        const scoresByRound = playedRounds.map(
          (round) => roundScores[round.id]?.[team.id] ?? 0
        );
        const total = scoresByRound.reduce((sum, score) => sum + score, 0);
        return { team, roundScores: scoresByRound, total };
      })
      .sort((a, b) => b.total - a.total);
  }, [teams, playedRounds, roundScores]);

  const winner = results[0];
  const runnerUp = results[1];
  const margin = winner && runnerUp ? winner.total - runnerUp.total : null;

  return (
    <View className="flex-1 bg-tan">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between px-6 pt-2">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="flex-row items-center gap-3"
          >
            <Text className="font-nunito-bold text-h1 text-teal">←</Text>
            <Text className="font-nunito-bold text-h1 text-teal">РЕЗУЛЬТАТИ</Text>
          </Pressable>

          <Text className="text-4xl">🎲</Text>
        </View>

        {winner && (
          <View className="mx-6 mt-6 flex-row items-center justify-between rounded-3xl border-2 border-amber bg-cream px-5 py-5">
            <View className="flex-1 pr-3">
              <Text className="font-nunito-bold text-body-md text-teal">ПЕРЕМОЖЕЦЬ</Text>
              <Text
                className="mt-1 font-nunito-bold text-h2 text-brown"
                numberOfLines={1}
              >
                {winner.team.name}
              </Text>
              {margin !== null && (
                <Text className="mt-1 font-nunito-regular text-body-md text-brown">
                  Перемогли з відривом {margin} очок
                </Text>
              )}
            </View>

            <View className="items-end">
              <Text className="font-nunito-bold text-h1 text-error">{winner.total}</Text>
              <Text className="font-nunito-bold text-caption text-error">ОЧОК</Text>
            </View>
          </View>
        )}

        <View className="mx-6 mt-6 flex-row items-center gap-2 px-1">
          <Text className="w-5 font-nunito-semibold text-body-sm text-muted-foreground">#</Text>
          <Text className="flex-1 font-nunito-semibold text-body-sm text-muted-foreground">
            Назва команди
          </Text>
          {playedRounds.map((round) => (
            <Text
              key={round.id}
              className="w-12 text-center font-nunito-semibold text-body-sm text-muted-foreground"
              numberOfLines={1}
            >
              {round.title}
            </Text>
          ))}
          <Text
            className="w-16 text-right font-nunito-semibold text-body-sm text-muted-foreground"
            numberOfLines={1}
          >
            ЗАГАЛОМ
          </Text>
        </View>

        <ScrollView
          className="mt-3 flex-1 px-6"
          contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
        >
          {results.map((result, index) => {
            const badge = BADGES[index % BADGES.length];
            const isTopResult = index < TOP_RESULT_COUNT;

            return (
              <View
                key={result.team.id}
                className="flex-row items-center gap-2 rounded-2xl bg-cream px-3 py-4"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                <Text className="w-5 font-nunito-bold text-h4 text-brown">{index + 1}</Text>

                <View
                  className={`h-8 w-8 items-center justify-center rounded-xl ${badge.className}`}
                >
                  <Text className="text-sm">{badge.icon}</Text>
                </View>

                <Text
                  className="flex-1 font-nunito-semibold text-body-md text-brown"
                  numberOfLines={1}
                >
                  {result.team.name}
                </Text>

                {result.roundScores.map((score, scoreIndex) => (
                  <Text
                    key={scoreIndex}
                    className="w-12 text-center font-nunito-bold text-body-md text-brown"
                  >
                    {score}
                  </Text>
                ))}

                <Text
                  className={`w-16 text-right font-nunito-bold text-body-lg ${
                    isTopResult ? "text-error" : "text-violet"
                  }`}
                >
                  {result.total}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View className="px-6 pb-6 pt-2">
          <Pressable
            onPress={() => router.replace("/")}
            className="button--teal"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Text className="font-nunito-bold text-h3 text-cream">ГОТОВО</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
