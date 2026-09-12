import { Pressable, Text, View } from "react-native";

type StatCardProps = {
  icon: string;
  value: string;
  label: string;
  onPress?: () => void;
};

export function StatCard({ icon, value, label, onPress }: StatCardProps) {
  const content = (
    <>
      <Text className="font-nunito-bold text-5xl text-brown">
        {icon} {value}
      </Text>
      <Text className="font-nunito-bold text-lg text-brown mt-1">{label}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className="card--stat flex-1"
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        {content}
      </Pressable>
    );
  }

  return <View className="card--stat flex-1">{content}</View>;
}
