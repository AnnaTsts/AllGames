import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

import { TeamCard } from "@/components/TeamCard";
import { useTeamStore } from "@/store/teamStore";

export default function Teams() {
  const router = useRouter();
  const teams = useTeamStore((state) => state.teams);
  const selectTeam = useTeamStore((state) => state.selectTeam);
  const addTeam = useTeamStore((state) => state.addTeam);
  const addMember = useTeamStore((state) => state.addMember);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const closeModal = () => {
    setIsModalVisible(false);
    setNewTeamName("");
  };

  const handleAddTeam = () => {
    const name = newTeamName.trim();
    if (!name) return;
    addTeam(name.toUpperCase());
    closeModal();
  };

  return (
    <View className="flex-1 bg-brown">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="bg-brown px-6 py-5">
          <Text className="text-center font-nunito-bold text-h2 text-cream">
            КЕРУВАННЯ КОМАНДАМИ
          </Text>
        </View>

        <View className="flex-1 bg-orange">
          <ScrollView
            className="flex-1 px-6 pt-6"
            contentContainerStyle={{ gap: 20, paddingBottom: 24 }}
          >
            {teams.map((team) => (
              <Pressable key={team.id} onPress={() => selectTeam(team.name)}>
                <TeamCard
                  name={team.name}
                  members={team.members}
                  onAddMember={() => addMember(team.id)}
                />
              </Pressable>
            ))}

            <Pressable
              onPress={() => setIsModalVisible(true)}
              className="button--outline"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="font-nunito-bold text-h3 text-brown">+</Text>
              <Text className="font-nunito-bold text-body-lg text-brown">
                Додати нову команду
              </Text>
            </Pressable>
          </ScrollView>

          <View className="bg-orange px-6 pb-6 pt-2">
            <Pressable
              onPress={() => router.back()}
              className="button--primary"
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <Text className="font-nunito-bold text-h3 text-cream">✓ ГОТОВО</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View
          className="flex-1 items-center justify-center bg-brown/60 px-6"
        >
          <View className="w-full gap-4 rounded-3xl bg-cream p-6">
            <Text className="font-nunito-bold text-h3 text-brown">
              Нова команда
            </Text>

            <TextInput
              value={newTeamName}
              onChangeText={setNewTeamName}
              placeholder="Назва команди"
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
                <Text className="font-nunito-bold text-body-lg text-brown">
                  Скасувати
                </Text>
              </Pressable>

              <Pressable
                onPress={handleAddTeam}
                disabled={!newTeamName.trim()}
                className="flex-1 items-center justify-center rounded-full bg-primary py-3"
                style={({ pressed }) => ({
                  opacity: pressed || !newTeamName.trim() ? 0.7 : 1,
                })}
              >
                <Text className="font-nunito-bold text-body-lg text-cream">
                  Додати
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
