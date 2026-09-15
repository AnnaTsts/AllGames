import { Pressable, Text, View } from "react-native";

type RoundCardProps = {
  title: string;
  description: string;
  icon: string;
  badgeClassName: string;
  selected: boolean;
  onToggle: () => void;
};

export function RoundCard({
  title,
  description,
  icon,
  badgeClassName,
  selected,
  onToggle,
}: RoundCardProps) {
  return (
    <Pressable
      onPress={onToggle}
      className="card--round"
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : selected ? 1 : 0.5 })}
    >
      <View className={`h-16 w-16 items-center justify-center rounded-2xl ${badgeClassName}`}>
        <Text className="text-3xl">{icon}</Text>
      </View>

      <View className="flex-1 gap-1">
        <Text className="font-nunito-bold text-lg text-brown">{title}</Text>
        <Text className="font-nunito-regular text-body-md text-muted-foreground">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}
