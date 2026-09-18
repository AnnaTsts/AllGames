import { createAudioPlayer, type AudioPlayer } from "expo-audio";

import { sounds } from "@/constants/sounds";
import { useSoundStore } from "@/store/soundStore";

const players = {
  correct: createAudioPlayer(sounds.correct),
  skip: createAudioPlayer(sounds.skip),
  timerEnd: createAudioPlayer(sounds.timerEnd),
};

function play(player: AudioPlayer) {
  if (!useSoundStore.getState().soundEnabled) return;
  player.seekTo(0);
  player.play();
}

export const soundEffects = {
  playCorrect: () => play(players.correct),
  playSkip: () => play(players.skip),
  playTimerEnd: () => play(players.timerEnd),
};
