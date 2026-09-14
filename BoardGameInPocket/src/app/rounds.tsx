import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { RoundCard } from "@/components/RoundCard";
import { roundTypes, roundVisuals } from "@/data/rounds";
import { useRoundStore } from "@/store/roundStore";

function pluralizeRounds(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "тур";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "тури";
  return "турів";
}

export default function Rounds() {
  const router = useRouter();
  const selectedRoundIds = useRoundStore((state) => state.selectedRoundIds);
  const toggleRound = useRoundStore((state) => state.toggleRound);

  return (
    <View className="flex-1 bg-brown">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="bg-brown px-6 py-5">
          <Text className="text-center font-nunito-bold text-h1 text-cream">
            Кількість турів у грі
          </Text>
        </View>

        <View className="flex-1 bg-orange">
          <ScrollView
            className="flex-1 px-6 pt-6"
            contentContainerStyle={{ gap: 20, paddingBottom: 24 }}
          >
            {roundTypes.map((round) => {
              const visual = roundVisuals[round.id];
              return (
                <RoundCard
                  key={round.id}
                  title={round.title}
                  description={round.description}
                  icon={visual.icon}
                  badgeClassName={visual.badgeClassName}
                  selected={selectedRoundIds.includes(round.id)}
                  onToggle={() => toggleRound(round.id)}
                />
              );
            })}
          </ScrollView>

          <View className="mb-[10%] bg-orange px-6 pb-6 pt-2">
            <Pressable
              onPress={() => router.back()}
              className="button--outline"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="font-nunito-bold text-h3 text-brown">
                Вибрано {selectedRoundIds.length} {pluralizeRounds(selectedRoundIds.length)}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
