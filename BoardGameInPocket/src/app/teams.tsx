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
import { roundRulesRoute } from "@/data/rounds";
import { useGameStore } from "@/store/gameStore";
import { useTeamStore } from "@/store/teamStore";

export default function Teams() {
  const router = useRouter();
  const teams = useTeamStore((state) => state.teams);
  const startGame = useGameStore((state) => state.startGame);
  const selectTeam = useTeamStore((state) => state.selectTeam);
  const addTeam = useTeamStore((state) => state.addTeam);
  const addMember = useTeamStore((state) => state.addMember);
  const deleteTeam = useTeamStore((state) => state.deleteTeam);
  const deleteMember = useTeamStore((state) => state.deleteMember);
  const renameTeam = useTeamStore((state) => state.renameTeam);
  const renameMember = useTeamStore((state) => state.renameMember);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  type EditTarget =
    | { type: "team"; teamId: string }
    | { type: "member"; teamId: string; member: string };

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editName, setEditName] = useState("");

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

  const closeEditModal = () => {
    setEditTarget(null);
    setEditName("");
  };

  const handleSaveEdit = () => {
    const name = editName.trim();
    if (!name || !editTarget) return;
    if (editTarget.type === "team") {
      renameTeam(editTarget.teamId, name.toUpperCase());
    } else {
      renameMember(editTarget.teamId, editTarget.member, name);
    }
    closeEditModal();
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
                  onDeleteTeam={() => deleteTeam(team.id)}
                  onDeleteMember={(member) => deleteMember(team.id, member)}
                  onEditTeamName={() => {
                    setEditTarget({ type: "team", teamId: team.id });
                    setEditName(team.name);
                  }}
                  onEditMember={(member) => {
                    setEditTarget({ type: "member", teamId: team.id, member });
                    setEditName(member);
                  }}
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

          <View className="mb-[10%] bg-orange px-6 pb-6 pt-2">
            <Pressable
              onPress={() => {
                startGame();
                const firstRoundId = useGameStore.getState().activeRoundIds[0];
                router.push(roundRulesRoute[firstRoundId]);
              }}
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

      <Modal
        visible={editTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <View
          className="flex-1 items-center justify-center bg-brown/60 px-6"
        >
          <View className="w-full gap-4 rounded-3xl bg-cream p-6">
            <Text className="font-nunito-bold text-h3 text-brown">
              {editTarget?.type === "team"
                ? "Редагувати назву команди"
                : "Редагувати ім'я гравця"}
            </Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder={
                editTarget?.type === "team" ? "Назва команди" : "Ім'я гравця"
              }
              placeholderTextColor="#786459"
              autoFocus
              className="rounded-2xl border-2 border-brown px-4 py-3 font-nunito-regular text-body-lg text-brown"
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={closeEditModal}
                className="flex-1 items-center justify-center rounded-full border-2 border-brown py-3"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text className="font-nunito-bold text-body-lg text-brown">
                  Скасувати
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSaveEdit}
                disabled={!editName.trim()}
                className="flex-1 items-center justify-center rounded-full bg-primary py-3"
                style={({ pressed }) => ({
                  opacity: pressed || !editName.trim() ? 0.7 : 1,
                })}
              >
                <Text className="font-nunito-bold text-body-lg text-cream">
                  Зберегти
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
