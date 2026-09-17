import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { images } from "@/constants/images";
import { antonPalichRules } from "@/data/gameRules";

export default function GameRulesRound3() {
  const router = useRouter();
  const [soundOn, setSoundOn] = useState(true);

  return (
    <View className="flex-1 bg-orange">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between bg-brown px-4 py-4">
          <Pressable onPress={() => router.push("/")} hitSlop={8}>
            <Text className="text-2xl">🏠</Text>
          </Pressable>

          <Text
            className="flex-1 px-2 text-center font-nunito-bold text-h2 text-cream"
            numberOfLines={1}
          >
            ПРАВИЛА ГРИ: {antonPalichRules.gameTitle}
          </Text>

          <Pressable
            onPress={() => setSoundOn((prev) => !prev)}
            className="h-11 w-11 items-center justify-center rounded-full bg-rust"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text className="text-lg">{soundOn ? "🔊" : "🔈"}</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ gap: 20, paddingBottom: 24, paddingTop: 44 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ position: "relative" }}>
            <View
              className="flex-row items-end rounded-3xl bg-cream py-5 pr-5"
              style={{ paddingLeft: 150 }}
            >
              <View className="flex-1 gap-1 pb-1">
                <Text className="font-nunito-semibold text-h4 text-brown">
                  {antonPalichRules.round} тур
                </Text>
                <Text className="font-nunito-bold text-h1 text-brown">
                  {antonPalichRules.roundName ?? antonPalichRules.gameTitle}
                </Text>
              </View>
            </View>

            <Image
              source={images.antonPalichMascot}
              resizeMode="contain"
              style={{ position: "absolute", left: 8, top: -44, width: 132, height: 174 }}
            />
          </View>

          <View className="flex-row items-center gap-4 rounded-3xl bg-cream p-5">
            <Text className="text-4xl">🎲</Text>
            <Text className="flex-1 font-nunito-regular text-h4 text-brown">
              <Text className="font-nunito-bold">ЗАВДАННЯ: </Text>
              {antonPalichRules.task}
            </Text>
          </View>

          <Text className="text-center font-nunito-bold text-h3 text-error">
            × × × × ЗАБОРОНЕНО × × × ×
          </Text>

          {antonPalichRules.forbidden.map((item) => (
            <View
              key={item}
              className="flex-row items-center gap-4 rounded-3xl bg-cream p-5"
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-error">
                <Text className="font-nunito-bold text-h3 text-cream">✕</Text>
              </View>
              <Text className="flex-1 font-nunito-semibold text-h4 text-brown">
                {item}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View className="bg-orange px-6 pb-6 pt-2">
          <Pressable
            onPress={() => router.push("/team-turn")}
            className="button--outline-primary"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className="font-nunito-bold text-h3 text-primary">›</Text>
            <Text className="font-nunito-bold text-h3 text-primary">ДАЛІ</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
