import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme/colors";

type ToggleProps = {
  value: boolean;
  onValueChange: () => void;
  showLabel?: boolean;
};

export function Toggle({ value, onValueChange, showLabel = false }: ToggleProps) {
  return (
    <Pressable onPress={onValueChange} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <View
        className={
          showLabel
            ? "h-10 w-24 flex-row items-center rounded-full px-2"
            : "h-9 w-16 flex-row items-center rounded-full px-1"
        }
        style={{
          backgroundColor: value ? colors.primary : colors.gray700,
          justifyContent: showLabel ? "space-between" : value ? "flex-end" : "flex-start",
        }}
      >
        {showLabel && (
          <Text className="font-nunito-bold text-body-sm text-cream">{value ? "ON" : "OFF"}</Text>
        )}
        <View className="h-7 w-7 rounded-full bg-gray-50" />
      </View>
    </Pressable>
  );
}
