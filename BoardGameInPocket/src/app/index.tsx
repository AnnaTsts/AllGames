import { useRouter } from "expo-router";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";

import { StatCard } from "@/components/StatCard";
import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/languageStore";
import { useTeamStore } from "@/store/teamStore";

export default function Index() {
  const router = useRouter();
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);
  const teamCount = useTeamStore((state) => state.teams.length);

  return (
    <View className="flex-1 bg-background">
      <Image
        source={images.backgroundWelcome}
        resizeMode="cover"
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 px-6 pt-2">
          <View className="flex-row justify-end">
            <Pressable
              onPress={toggleLanguage}
              className="h-14 w-14 flex-col overflow-hidden rounded-full border-4 border-cream"
            >
              <View className="flex-1 bg-[#0057B7]" />
              <View className="flex-1 bg-[#FFD700]" />
            </Pressable>
          </View>

          <View className="-mt-8 items-center">
            <Image
              source={images.mascotPocket}
              resizeMode="contain"
              style={{ width: 192, height: 192 }}
            />
          </View>

          <Text className="text-center font-nunito-bold text-h1 text-primary">GameInPocket</Text>

          <View className="mt-6 gap-4">
            <View className="flex-row gap-4">
              <StatCard
                icon="👥"
                value={String(teamCount)}
                label="команди"
                onPress={() => router.push("/teams")}
              />
              <StatCard icon="🚀" value="3" label="тури" />
            </View>
            <View className="flex-row gap-4">
              <StatCard icon="📖" value="30" label="слів" />
              <StatCard icon="⏱️" value="60" label="секунд" />
            </View>
          </View>

          <Text className="mt-6 text-center font-nunito-semibold text-body-lg text-primary">
            Будь-які слова, 8 тем
          </Text>

          <View className="flex-1" />

          <Pressable
            onPress={() => router.push("/teams")}
            className="button--cta mb-6"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text className="font-nunito-bold text-h3 text-brown">Розпочати гру</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <View className="absolute right-0 top-[30%] rounded-l-2xl bg-rust px-2 py-4">
        <Text
          style={{ transform: [{ rotate: "90deg" }] }}
          className="font-nunito-bold text-body-md text-cream"
        >
          Про гру
        </Text>
      </View>
    </View>
  );
}
