import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";

import { useThemeStore } from "@/store/themeStore";

export default function ThemeEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useThemeStore((state) => state.themes.find((item) => item.id === id));
  const renameTheme = useThemeStore((state) => state.renameTheme);
  const addWordToTheme = useThemeStore((state) => state.addWordToTheme);
  const updateWordInTheme = useThemeStore((state) => state.updateWordInTheme);
  const removeWordFromTheme = useThemeStore((state) => state.removeWordFromTheme);

  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  const allRevealed = useMemo(
    () => (theme?.customWords.length ?? 0) > 0 && revealedIndices.size === theme?.customWords.length,
    [revealedIndices, theme?.customWords.length]
  );

  if (!theme) {
    return null;
  }

  const toggleRevealed = (index: number) => {
    setRevealedIndices((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleRevealAll = () => {
    setRevealedIndices(
      allRevealed ? new Set() : new Set(theme.customWords.map((_, index) => index))
    );
  };

  return (
    <View className="flex-1 bg-teal">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center px-6 pt-2">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text className="font-nunito-bold text-h1 text-cream">←</Text>
          </Pressable>
        </View>

        <View className="px-6 pt-6">
          <TextInput
            value={theme.name}
            onChangeText={(text) => renameTheme(theme.id, text)}
            placeholder="Моя тема"
            placeholderTextColor="#FDF0AE99"
            className="rounded-2xl border-2 border-cream/40 px-5 py-4 font-nunito-bold text-h3 text-cream"
          />
        </View>

        <View className="px-6 pt-4">
          <Pressable
            onPress={toggleRevealAll}
            className="button--outline-cream self-start"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className="text-body-lg">👀</Text>
            <Text className="font-nunito-bold text-body-sm text-cream">
              {allRevealed ? "Приховати все" : "Показати все"}
            </Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
          {theme.customWords.map((word, index) => {
            const revealed = revealedIndices.has(index);
            return (
              <View key={index} className="flex-row items-center gap-3">
                <Pressable onPress={() => toggleRevealed(index)} hitSlop={8}>
                  <Text className="text-body-lg">{revealed ? "👁" : "🙈"}</Text>
                </Pressable>

                <Text className="font-nunito-bold text-body-lg text-cream/70">{index + 1}.</Text>

                <TextInput
                  value={word}
                  onChangeText={(text) => updateWordInTheme(theme.id, index, text)}
                  secureTextEntry={!revealed}
                  placeholder="Слово"
                  placeholderTextColor="#FDF0AE99"
                  className="flex-1 font-nunito-regular text-body-lg text-cream"
                />

                <Pressable onPress={() => removeWordFromTheme(theme.id, index)} hitSlop={8}>
                  <Text className="font-nunito-bold text-h3 text-cream/70">×</Text>
                </Pressable>
              </View>
            );
          })}

          <Pressable
            onPress={() => addWordToTheme(theme.id, "")}
            className="flex-row items-center gap-2 self-start"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className="font-nunito-bold text-h3 text-amber">+</Text>
            <Text className="font-nunito-bold text-body-lg text-amber">Додати слово</Text>
          </Pressable>
        </ScrollView>

        <View className="px-6 pb-6 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="button--cta"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text className="font-nunito-bold text-h3 text-brown">ГОТОВО</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
