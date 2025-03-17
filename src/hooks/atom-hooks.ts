import {
  audioDetailsActiveTab,
  currentAudioDetails,
  currentAudioLrcDetails,
  currentSongIndexAtom,
  isPlayerInitAtom,
  isTypingAtom,
  playerCurrentTimeAtom,
  queueAtom,
} from "@/atoms";
import { store } from "@/atoms/store";
import { useAtom } from "jotai";

export const useQueue = () => useAtom(queueAtom, { store });
export const useCurrentAudioIndex = () =>
  useAtom(currentSongIndexAtom, { store });
export const usePlayerCurrentTime = () =>
  useAtom(playerCurrentTimeAtom, { store });
export const useIsPlayerInit = () => useAtom(isPlayerInitAtom, { store });
export const useIsTyping = () => useAtom(isTypingAtom, { store });
export const useAudioDetailsActiveTab = () =>
  useAtom(audioDetailsActiveTab, { store });
export const useCurrentAudioDetails = () =>
  useAtom(currentAudioDetails, { store });
export const useCurrentAudioLrcDetails = () =>
  useAtom(currentAudioLrcDetails, { store });
