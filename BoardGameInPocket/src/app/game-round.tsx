import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Share, Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

import { roundRulesRoute } from "@/data/rounds";
import { soundEffects } from "@/lib/soundEffects";
import { useGameStore } from "@/store/gameStore";
import { useSoundStore } from "@/store/soundStore";

const ROUND_SECONDS = 60;
const SKIP_PENALTY = 1;
const SWIPE_OUT_DURATION = 220;

export default function GameRound() {
  const router = useRouter();
  const wordPool = useGameStore((state) => state.wordPool);
  const markCorrect = useGameStore((state) => state.markCorrect);
  const markSkipped = useGameStore((state) => state.markSkipped);
  const startNextRound = useGameStore((state) => state.startNextRound);
  const nextTeam = useGameStore((state) => state.nextTeam);

  const soundEnabled = useSoundStore((state) => state.soundEnabled);
  const toggleSound = useSoundStore((state) => state.toggleSound);

  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

  const { width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const swipeThreshold = screenWidth * 0.25;

  useEffect(() => {
    if (isPaused || secondsLeft === 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) {
      soundEffects.playTimerEnd();
      router.replace("/who-guessed");
    }
  }, [secondsLeft, router]);

  useEffect(() => {
    if (wordPool.length === 0) {
      const { activeRoundIds, currentRoundIndex } = useGameStore.getState();
      const nextRoundId = activeRoundIds[currentRoundIndex + 1];
      if (nextRoundId) {
        nextTeam();
        startNextRound();
        router.replace(roundRulesRoute[nextRoundId]);
      } else {
        router.replace("/results");
      }
    }
  }, [wordPool.length, router, startNextRound, nextTeam]);

  const currentWord = wordPool[0];
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const handleShare = () => {
    if (!currentWord) return;
    Share.share({ message: currentWord.text }).catch(() => {});
  };

  const handleSwipeComplete = (direction: "left" | "right") => {
    if (direction === "right") {
      soundEffects.playCorrect();
      markCorrect();
    } else {
      soundEffects.playSkip();
      markSkipped();
    }
    setIsSwiping(false);
  };

  const swipeCard = (direction: "left" | "right") => {
    if (isSwiping) return;
    setIsSwiping(true);

    const target = direction === "right" ? screenWidth * 1.5 : -screenWidth * 1.5;
    translateX.value = withTiming(target, { duration: SWIPE_OUT_DURATION }, (finished) => {
      if (finished) {
        translateX.value = 0;
        runOnJS(handleSwipeComplete)(direction);
      }
    });
  };

  const panGesture = Gesture.Pan()
    .enabled(!isSwiping)
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > swipeThreshold) {
        runOnJS(swipeCard)("right");
      } else if (event.translationX < -swipeThreshold) {
        runOnJS(swipeCard)("left");
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-screenWidth, 0, screenWidth], [-12, 0, 12]);
    return {
      transform: [{ translateX: translateX.value }, { rotate: `${rotate}deg` }],
    };
  });

  if (!currentWord) return null;

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
            onPress={toggleSound}
            className="h-10 w-10 items-center justify-center rounded-full bg-rust"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text className="text-lg">{soundEnabled ? "🔊" : "🔈"}</Text>
          </Pressable>
        </View>

        <View className="flex-1 px-6 pt-6">
          <GestureDetector gesture={panGesture}>
            <Animated.View className="card--word" style={animatedCardStyle}>
              <Text className="text-right font-nunito-regular text-body-lg italic text-amber">
                О, які люди!
              </Text>

              <View className="flex-1 items-center justify-center">
                <Text className="text-center font-nunito-bold text-h1 text-brown">
                  {currentWord.text}
                </Text>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        <View className="flex-row items-center justify-between px-10 py-8">
          <View className="relative">
            <Pressable
              onPress={() => swipeCard("left")}
              className="button--round-action bg-error"
              style={({ pressed }) => ({ opacity: pressed || isSwiping ? 0.85 : 1 })}
            >
              <Text className="font-nunito-bold text-h1 text-cream">✕</Text>
            </Pressable>
            <View className="absolute -right-1 -top-1 h-7 w-7 items-center justify-center rounded-full bg-brown">
              <Text className="font-nunito-bold text-caption text-cream">-{SKIP_PENALTY}</Text>
            </View>
          </View>

          <Pressable
            onPress={() => swipeCard("right")}
            className="button--round-action bg-teal"
            style={({ pressed }) => ({ opacity: pressed || isSwiping ? 0.85 : 1 })}
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
