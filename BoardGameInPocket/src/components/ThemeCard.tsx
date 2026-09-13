import { Pressable, Text, View } from "react-native";

import { Toggle } from "@/components/Toggle";

type ThemeCardProps = {
  name: string;
  enabled: boolean;
  onToggle: () => void;
  onAddWord: () => void;
};

export function ThemeCard({ name, enabled, onToggle, onAddWord }: ThemeCardProps) {
  return (
    <View className="card--theme">
      <Text className="flex-1 font-nunito-bold text-lg text-brown" numberOfLines={1}>
        {name}
      </Text>

      <View className="flex-row items-center gap-3">
        <Toggle value={enabled} onValueChange={onToggle} />

        <Pressable
          onPress={onAddWord}
          className="h-10 w-10 items-center justify-center rounded-full bg-teal"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text className="font-nunito-bold text-lg text-cream">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
