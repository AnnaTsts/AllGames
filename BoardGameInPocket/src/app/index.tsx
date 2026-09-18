import { useRouter } from "expo-router";
import { Image, ImageBackground, Pressable, SafeAreaView, Text, View } from "react-native";

import { StatCard } from "@/components/StatCard";
import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/languageStore";
import { useTeamStore } from "@/store/teamStore";
import { useRoundStore } from "@/store/roundStore";
import { useThemeStore } from "@/store/themeStore";

export default function Index() {
  const router = useRouter();
  const teamCount = useTeamStore((state) => state.teams.length);
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);
  const roundCount = useRoundStore((state) => state.selectedRoundIds.length);
  const wordCount = useThemeStore((state) => state.wordCount);

  return (
    <ImageBackground source={images.backgroundWelcome} className="flex-1" resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 px-6">
          <View className="flex-row justify-end pt-2">
            <Pressable
              onPress={toggleLanguage}
              className="h-14 w-14 flex-col overflow-hidden rounded-full border-4 border-cream"
            >
              <View className="flex-1 bg-[#0057B7]" />
              <View className="flex-1 bg-[#FFD700]" />
            </Pressable>
          </View>

          <View className="items-center">
            <Image
              source={images.mascotPocket}
              style={{ width: 180, height: 180 }}
              resizeMode="contain"
            />
            <Text className="mt-2 font-nunito-bold text-4xl text-primary">GameInPocket</Text>
          </View>

          <View className="mt-8 gap-6">
            <View className="flex-row gap-4">
              <StatCard icon="👥" value={String(teamCount)} label="команди" onPress={() => router.push("/teams")} />
              <StatCard icon="🚀" value={String(roundCount)} label="тури" onPress={() => router.push("/rounds")}/>
            </View>
            <View className="flex-row gap-4">
              <StatCard icon="📖" value={String(wordCount)} label="слів" onPress={() => router.push("/themes")} />
              <StatCard icon="⏱️" value="60" label="секунд" />
            </View>
          </View>

        </View>

        <View
          className="absolute right-0 top-[26%] w-12 items-center justify-center rounded-l-3xl bg-rust py-8"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 4,
            shadowOffset: { width: -2, height: 2 },
            elevation: 3,
          }}
        >
          <Text
            className="w-28 text-center font-nunito-bold text-body-lg text-cream"
            style={{ transform: [{ rotate: "-90deg" }] }}
          >
            Про гру
          </Text>
        </View>

        <View className="mb-[10%] px-2 pb-6">
          <Pressable
            onPress={() => router.push("/teams")}
            className="button--cta"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Text className="font-nunito-bold text-h3 text-brown">Розпочати гру</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
