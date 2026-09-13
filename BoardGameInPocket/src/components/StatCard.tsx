import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type StatCardProps = {
  icon: string;
  value: string;
  label: string;
  onPress?: () => void;
};

export function StatCard({ icon, value, label, onPress }: StatCardProps) {
  const content: ReactNode = (
    <View className="card--stat flex-1">
      <View className="flex-row items-center gap-2">
        <Text className="text-2xl">{icon}</Text>
        <Text className="font-nunito-bold text-h1 text-brown">{value}</Text>
        <Text className="text-2xl">{icon}</Text>
      </View>
      <Text className="mt-1 font-nunito-bold text-body-lg text-brown">{label}</Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      className="flex-1"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      {content}
    </Pressable>
  );
}
