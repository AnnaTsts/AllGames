import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";

import { ThemeCard } from "@/components/ThemeCard";
import { Toggle } from "@/components/Toggle";
import { WordCountSlider } from "@/components/WordCountSlider";
import { MAX_WORD_COUNT, MIN_WORD_COUNT, useThemeStore } from "@/store/themeStore";

type AddModalState = { type: "theme" } | { type: "word"; themeId: string; themeName: string } | null;

export default function Themes() {
  const router = useRouter();
  const themes = useThemeStore((state) => state.themes);
  const wordCount = useThemeStore((state) => state.wordCount);
  const allThemesSelected = useThemeStore((state) => state.allThemesSelected);
  const setWordCount = useThemeStore((state) => state.setWordCount);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setAllThemesSelected = useThemeStore((state) => state.setAllThemesSelected);
  const addTheme = useThemeStore((state) => state.addTheme);
  const addWordToTheme = useThemeStore((state) => state.addWordToTheme);

  const [modalState, setModalState] = useState<AddModalState>(null);
  const [inputValue, setInputValue] = useState("");

  const closeModal = () => {
    setModalState(null);
    setInputValue("");
  };

  const handleSubmit = () => {
    const value = inputValue.trim();
    if (!value || !modalState) return;

    if (modalState.type === "theme") {
      addTheme(value);
    } else {
      addWordToTheme(modalState.themeId, value);
    }
    closeModal();
  };

  return (
    <View className="flex-1 bg-brown">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="bg-brown px-6 py-5">
          <Text className="text-center font-nunito-bold text-h1 text-cream">Теми</Text>
        </View>

        <View className="flex-row items-center justify-between gap-4 bg-tan px-6 py-5">
          <View className="flex-1 gap-1">
            <Text className="font-nunito-bold text-body-lg text-brown">КІЛЬКІСТЬ СЛІВ</Text>

            <WordCountSlider
              min={MIN_WORD_COUNT}
              max={MAX_WORD_COUNT}
              value={wordCount}
              onChange={setWordCount}
            />
          </View>

          <View className="flex-row items-center gap-3">
            <Text className="text-right font-nunito-bold text-body-sm text-brown">
              Вибрати{"\n"}Всі{"\n"}Теми
            </Text>
            <Toggle
              value={allThemesSelected}
              onValueChange={() => setAllThemesSelected(!allThemesSelected)}
              showLabel
            />
          </View>
        </View>

        <View className="flex-1 bg-orange">
          <ScrollView
            className="flex-1 px-6 pt-6"
            contentContainerStyle={{ gap: 20, paddingBottom: 24 }}
          >
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                name={theme.name}
                enabled={theme.enabled}
                onToggle={() => toggleTheme(theme.id)}
                onAddWord={() => setModalState({ type: "word", themeId: theme.id, themeName: theme.name })}
              />
            ))}

            <Pressable
              onPress={() => setModalState({ type: "theme" })}
              className="button--outline"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="font-nunito-bold text-h3 text-brown">+</Text>
              <Text className="font-nunito-bold text-h3 text-brown">ДОДАТИ СВОЮ ТЕМУ</Text>
            </Pressable>
          </ScrollView>

          <View className="bg-orange px-6 pb-6 pt-2">
            <Pressable
              onPress={() => router.back()}
              className="button--teal"
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <Text className="font-nunito-bold text-h3 text-cream">ГОТОВО</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <Modal visible={modalState !== null} transparent animationType="fade" onRequestClose={closeModal}>
        <View className="flex-1 items-center justify-center bg-brown/60 px-6">
          <View className="w-full gap-4 rounded-3xl bg-cream p-6">
            <Text className="font-nunito-bold text-h3 text-brown">
              {modalState?.type === "word" ? `Нове слово — ${modalState.themeName}` : "Нова тема"}
            </Text>

            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={modalState?.type === "word" ? "Слово" : "Назва теми"}
              placeholderTextColor="#786459"
              autoFocus
              className="rounded-2xl border-2 border-brown px-4 py-3 font-nunito-regular text-body-lg text-brown"
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={closeModal}
                className="flex-1 items-center justify-center rounded-full border-2 border-brown py-3"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text className="font-nunito-bold text-body-lg text-brown">Скасувати</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={!inputValue.trim()}
                className="flex-1 items-center justify-center rounded-full bg-primary py-3"
                style={({ pressed }) => ({
                  opacity: pressed || !inputValue.trim() ? 0.7 : 1,
                })}
              >
                <Text className="font-nunito-bold text-body-lg text-cream">Додати</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
