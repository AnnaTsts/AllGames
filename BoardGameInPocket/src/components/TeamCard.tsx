import { Pressable, Text, View } from "react-native";

type TeamCardProps = {
  name: string;
  members: string[];
  onAddMember?: () => void;
};

export function TeamCard({ name, members, onAddMember }: TeamCardProps) {
  return (
    <View className="card--team">
      <View className="flex-row items-center justify-between gap-3 px-4 py-4">
        <View className="flex-1 flex-row items-center gap-3">
          <Text className="text-3xl">🎲</Text>
          <Text
            className="flex-1 font-nunito-bold text-lg text-brown"
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>

        <Pressable
          onPress={onAddMember}
          className="flex-row items-center gap-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Text className="font-nunito-bold text-lg text-cream">+</Text>
          </View>
          <Text className="w-16 font-nunito-bold text-caption text-brown">
            Додати учасника
          </Text>
        </Pressable>
      </View>

      <View className="h-[2px] bg-brown" />

      <View className="gap-2 px-4 py-4">
        {members.map((member) => (
          <Text key={member} className="font-nunito-regular text-body-lg text-brown">
            {member}
          </Text>
        ))}
      </View>
    </View>
  );
}
