import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

import { useGameStore } from "@/store/gameStore";
import { useTeamStore } from "@/store/teamStore";

const ROUND_SECONDS = 60;

type ReadyStatCardProps = {
  icon: string;
  label: string;
  value: string;
};

function ReadyStatCard({ icon, label, value }: ReadyStatCardProps) {
  return (
    <View className="card--stat-outline">
      <View className="absolute -top-5 h-10 w-10 items-center justify-center rounded-full border-2 border-brown bg-cream">
        <Text className="text-lg">{icon}</Text>
      </View>
      <Text className="font-nunito-regular text-body-md text-muted-foreground">{label}</Text>
      <Text className="mt-1 font-nunito-bold text-h3 text-brown">{value}</Text>
    </View>
  );
}

export default function TeamTurn() {
  const router = useRouter();
  const teams = useTeamStore((state) => state.teams);
  const currentTeamIndex = useGameStore((state) => state.currentTeamIndex);
  const wordPool = useGameStore((state) => state.wordPool);

  const [soundOn, setSoundOn] = useState(true);

  const currentTeam = teams[currentTeamIndex] ?? teams[0];

  return (
    <View className="flex-1 bg-cream">
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

        <View className="flex-1 justify-between px-6 pb-8 pt-4">
          <View className="items-center">
            <Text className="font-nunito-bold text-body-lg text-rust">
              КОМАНДА №{currentTeamIndex + 1}
            </Text>
            <Text className="mt-2 text-center font-nunito-bold text-h1 text-brown">
              {currentTeam.name}
            </Text>

            <View className="mt-10 w-full flex-row gap-4">
              <ReadyStatCard icon="🕐" label="Час" value={`${ROUND_SECONDS} сек`} />
              <ReadyStatCard icon="🎴" label="У капелюсі" value={`${wordPool.length} слів`} />
            </View>
          </View>

          <Pressable
            onPress={() => router.replace("/game-round")}
            className="mb-[10%] items-center justify-center rounded-3xl bg-brown py-[22px]"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Text className="font-nunito-bold text-[22px] text-cream">Грати</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
