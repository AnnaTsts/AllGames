import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { useGameStore } from "@/store/gameStore";
import { useTeamStore } from "@/store/teamStore";

export default function WhoGuessed() {
  const router = useRouter();
  const teams = useTeamStore((state) => state.teams);
  const selectedTeamName = useTeamStore((state) => state.selectedTeamName);
  const awardWord = useGameStore((state) => state.awardWord);
  const discardWord = useGameStore((state) => state.discardWord);

  const [soundOn, setSoundOn] = useState(true);
  const [guesserId, setGuesserId] = useState<string | null>(null);

  const handleDone = () => {
    if (!guesserId) return;
    awardWord(guesserId);
    router.replace("/turn-result");
  };

  const handleNobodyGuessed = () => {
    discardWord();
    router.replace("/turn-result");
  };

  return (
    <View className="flex-1 bg-brown">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-start justify-between px-6 pt-2">
          <View className="w-10" />

          <View className="items-center">
            <Text className="font-nunito-bold text-body-lg text-amber">
              УЧАСТЬ БЕРУТЬ УСІ
            </Text>
            <Text className="font-nunito-bold text-h1 text-cream">00:00</Text>
          </View>

          <Pressable
            onPress={() => setSoundOn((prev) => !prev)}
            className="h-10 w-10 items-center justify-center rounded-full bg-rust"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text className="text-lg">{soundOn ? "🔊" : "🔈"}</Text>
          </Pressable>
        </View>

        <View className="mt-6 flex-1 rounded-t-3xl bg-cream px-6 pt-6">
          <Text className="text-center font-nunito-bold text-h3 text-brown">
            Хто відгадав?
          </Text>

          <ScrollView
            className="mt-5 flex-1"
            contentContainerStyle={{ gap: 14, paddingBottom: 12 }}
          >
            {teams.map((team, index) => {
              const selected = guesserId === team.id;
              const isYou = team.name === selectedTeamName;

              return (
                <Pressable
                  key={team.id}
                  onPress={() => setGuesserId(team.id)}
                  className="card--select-team"
                  style={({ pressed }) => ({ opacity: pressed ? 0.85 : selected ? 1 : 0.5 })}
                >
                  <Text
                    className="flex-1 font-nunito-semibold text-body-lg text-brown"
                    numberOfLines={1}
                  >
                    {index + 1}. {team.name}
                  </Text>

                  {isYou && (
                    <View className="rounded-full bg-tan px-3 py-1">
                      <Text className="font-nunito-bold text-caption text-brown">це ви</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          <View className="gap-3 pb-6 pt-2">
            <Pressable
              onPress={handleDone}
              disabled={!guesserId}
              className="button--primary"
              style={({ pressed }) => ({ opacity: pressed || !guesserId ? 0.7 : 1 })}
            >
              <Text className="font-nunito-bold text-h3 text-cream">Готово</Text>
            </Pressable>

            <Pressable
              onPress={handleNobodyGuessed}
              className="button--outline-error"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="font-nunito-bold text-h3 text-error">Ніхто не відгадав</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
