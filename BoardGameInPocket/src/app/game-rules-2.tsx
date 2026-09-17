import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { images } from "@/constants/images";
import { crocodileRules } from "@/data/gameRules";
import { useGameStore } from "@/store/gameStore";

export default function GameRulesRound2() {
  const router = useRouter();
  const startGame = useGameStore((state) => state.startGame);
  const [soundOn, setSoundOn] = useState(true);

  return (
    <View className="flex-1 bg-orange">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between px-6 pt-2">
          <Pressable onPress={() => router.push("/")} hitSlop={8}>
            <Text className="text-2xl">🏠</Text>
          </Pressable>

          <Pressable
            onPress={() => setSoundOn((prev) => !prev)}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-khaki"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text className="text-lg">{soundOn ? "🔊" : "🔈"}</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center px-10 pb-4 pt-2">
            <Image
              source={images.crocodileMascot}
              style={{ width: 220, height: 218 }}
              resizeMode="contain"
            />
          </View>

          <View className="-mt-6 gap-4 rounded-3xl bg-cream px-6 pb-6 pt-6">
            <Text className="text-center font-nunito-regular text-h4 text-brown">
              {crocodileRules.round} тур
            </Text>

            <Text className="text-center font-nunito-bold text-h1 text-error">
              {crocodileRules.gameTitle}
            </Text>

            <Text className="text-center font-nunito-regular text-h4 text-brown">
              {crocodileRules.task}
            </Text>

            <Text className="text-center font-nunito-bold text-h3 text-error">
              × × × × ЗАБОРОНЕНО × × × ×
            </Text>

            <View className="gap-4">
              {crocodileRules.forbidden.map((item) => (
                <View key={item} className="flex-row items-center gap-3">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-error">
                    <Text className="font-nunito-bold text-body-sm text-cream">✕</Text>
                  </View>
                  <Text className="flex-1 font-nunito-semibold text-h4 text-brown">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <Pressable
          onPress={() => {
            startGame();
            router.push("/team-turn");
          }}
          className="items-center justify-center bg-olive py-6"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <Text className="font-nunito-bold text-h3 text-cream">Далі</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
