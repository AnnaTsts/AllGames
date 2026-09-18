import { Pressable, Text, View } from "react-native";

type TeamCardProps = {
  name: string;
  members: string[];
  onAddMember?: () => void;
  onDeleteTeam?: () => void;
  onDeleteMember?: (member: string) => void;
  onEditTeamName?: () => void;
  onEditMember?: (member: string) => void;
  onRandomizeTeamName?: () => void;
};

const MIN_MEMBER_COUNT = 2;

export function TeamCard({
  name,
  members,
  onAddMember,
  onDeleteTeam,
  onDeleteMember,
  onEditTeamName,
  onEditMember,
  onRandomizeTeamName,
}: TeamCardProps) {
  const canDeleteMember = members.length > MIN_MEMBER_COUNT;

  return (
    <View className="card--team">
      <View className="flex-row items-center justify-between gap-3 px-4 py-4">
        <View className="flex-1 flex-row items-center gap-3">
          <Pressable
            onPress={onRandomizeTeamName}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-3xl">🎲</Text>
          </Pressable>
          <Text
            className="flex-1 font-nunito-bold text-base text-brown"
            numberOfLines={1}
          >
            {name}
          </Text>
          <Pressable
            onPress={onEditTeamName}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-lg">✏️</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={onAddMember}
            className="flex-row items-center gap-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Text className="font-nunito-bold text-lg text-cream">+</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={onDeleteTeam}
            className="h-10 w-10 items-center justify-center rounded-full border-2 border-error"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className="font-nunito-bold text-lg text-error">🗑</Text>
          </Pressable>
        </View>
      </View>

      <View className="h-[2px] bg-brown" />

      <View className="gap-2 px-4 py-4">
        {members.map((member) => (
          <View
            key={member}
            className="flex-row items-center justify-between gap-3"
          >
            <Text className="flex-1 font-nunito-regular text-body-lg text-brown">
              {member}
            </Text>
            <Pressable
              onPress={() => onEditMember?.(member)}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text className="text-body-lg">✏️</Text>
            </Pressable>
            <Pressable
              onPress={() => onDeleteMember?.(member)}
              disabled={!canDeleteMember}
              hitSlop={8}
              style={({ pressed }) => ({
                opacity: !canDeleteMember ? 0.3 : pressed ? 0.6 : 1,
              })}
            >
              <Text className="font-nunito-bold text-body-lg text-error">✕</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
