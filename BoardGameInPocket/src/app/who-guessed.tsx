import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { useGameStore } from "@/store/gameStore";
import { useTeamStore } from "@/store/teamStore";

export default function WhoGuessed() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const teams = useTeamStore((state) => state.teams);
  const selectedTeamName = useTeamStore((state) => state.selectedTeamName);
  const awardWord = useGameStore((state) => state.awardWord);
  const discardWord = useGameStore((state) => state.discardWord);

  const [soundOn, setSoundOn] = useState(true);
  const [selection, setSelection] = useState<string | "nobody" | null>(null);

  const handleDone = () => {
    if (!selection) return;
    if (selection === "nobody") {
      discardWord();
    } else {
      awardWord(selection);
    }
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
              const selected = selection === team.id;
              const isYou = team.name === selectedTeamName;

              return (
                <Pressable
                  key={team.id}
                  onPress={() => setSelection(team.id)}
                  className={`card--select-team${selected ? " card--select-team--selected" : ""}`}
                  style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                >
                  <Text
                    className="flex-1 font-nunito-semibold text-body-lg text-brown"
                    numberOfLines={1}
                  >
                    {index + 1}. {team.name}
                  </Text>

                  {isYou && (
                    <View
                      className={`rounded-full px-3 py-1 ${
                        selected ? "bg-cream" : "bg-tan"
                      }`}
                    >
                      <Text className="font-nunito-bold text-caption text-brown">це ви</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}

            <Pressable
              onPress={() => setSelection("nobody")}
              className={`button--outline-error${
                selection === "nobody" ? " button--outline-error--selected" : ""
              }`}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Text
                className={`font-nunito-bold text-h3 ${
                  selection === "nobody" ? "text-cream" : "text-error"
                }`}
              >
                Ніхто не відгадав
              </Text>
            </Pressable>
          </ScrollView>

          <View className="gap-3 pt-2" style={{ paddingBottom: screenHeight * 0.1 }}>
            <Pressable
              onPress={handleDone}
              disabled={!selection}
              className="button--primary"
              style={({ pressed }) => ({ opacity: pressed || !selection ? 0.7 : 1 })}
            >
              <Text className="font-nunito-bold text-h3 text-cream">Готово</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
