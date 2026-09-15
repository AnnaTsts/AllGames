import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Share, Text, View } from "react-native";

import { words } from "@/data/words";

const ROUND_SECONDS = 60;
const SKIP_PENALTY = 1;

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function GameRound() {
  const router = useRouter();
  const [deck] = useState(() => shuffle(words));
  const [wordIndex, setWordIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    if (isPaused || secondsLeft === 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, secondsLeft]);

  const currentWord = deck[wordIndex % deck.length];
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const goToNextWord = () => setWordIndex((prev) => prev + 1);

  const handleShare = () => {
    Share.share({ message: currentWord.text }).catch(() => {});
  };

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-start justify-between px-6 pt-2">
          <View className="w-10" />

          <View className="items-center">
            <Pressable onPress={() => setIsPaused((prev) => !prev)} hitSlop={8}>
              <Text className="font-nunito-bold text-h1 text-brown">
                {isPaused ? "▶" : "II"}
              </Text>
            </Pressable>
            <Text className="font-nunito-bold text-h1 text-brown">
              {minutes}:{seconds}
            </Text>
          </View>

          <Pressable
            onPress={() => setSoundOn((prev) => !prev)}
            className="h-10 w-10 items-center justify-center rounded-full bg-rust"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text className="text-lg">{soundOn ? "🔊" : "🔈"}</Text>
          </Pressable>
        </View>

        <View className="flex-1 px-6 pt-6">
          <View className="card--word">
            <Text className="text-right font-nunito-regular text-body-lg italic text-amber">
              О, які люди!
            </Text>

            <View className="flex-1 items-center justify-center">
              <Text className="text-center font-nunito-bold text-h1 text-brown">
                {currentWord.text}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between px-10 py-8">
          <View className="relative">
            <Pressable
              onPress={goToNextWord}
              className="button--round-action bg-error"
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Text className="font-nunito-bold text-h1 text-cream">✕</Text>
            </Pressable>
            <View className="absolute -right-1 -top-1 h-7 w-7 items-center justify-center rounded-full bg-brown">
              <Text className="font-nunito-bold text-caption text-cream">-{SKIP_PENALTY}</Text>
            </View>
          </View>

          <Pressable
            onPress={goToNextWord}
            className="button--round-action bg-teal"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Text className="font-nunito-bold text-h1 text-cream">✓</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between px-10 pb-6">
          <Pressable onPress={handleShare} hitSlop={8}>
            <Text className="text-2xl">🔗</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/")} hitSlop={8}>
            <Text className="text-2xl">🏠</Text>
          </Pressable>

          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text className="font-nunito-bold text-2xl text-brown">←</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
