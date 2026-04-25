"use client";

import { useRef, useCallback } from "react";

const SOUND_PATHS = {
  earth: "/kapil-sounds/earth.wav",
  neptune: "/kapil-sounds/neptune.wav",
  click: "/kapil-sounds/click sfx (1).wav",
  bells: "/kapil-sounds/Toy Bells.wav",
} as const;

type SoundKey = keyof typeof SOUND_PATHS;

const audioCache: Record<SoundKey, HTMLAudioElement | null> = {
  earth: null,
  neptune: null,
  click: null,
  bells: null,
};

const getAudio = (key: SoundKey): HTMLAudioElement => {
  if (!audioCache[key]) {
    audioCache[key] = new Audio(SOUND_PATHS[key]);
  }
  return audioCache[key];
};

export function useSound() {
  const playSound = useCallback((key: SoundKey, options?: { volume?: number; loop?: boolean }) => {
    try {
      const audio = getAudio(key);
      if (options?.volume !== undefined) {
        audio.volume = Math.min(1, Math.max(0, options.volume));
      }
      if (options?.loop !== undefined) {
        audio.loop = options.loop;
      }
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.warn(`Failed to play sound ${key}:`, err);
      });
    } catch (err) {
      console.warn(`Error playing sound ${key}:`, err);
    }
  }, []);

  const stopSound = useCallback((key: SoundKey) => {
    try {
      const audio = audioCache[key];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } catch (err) {
      console.warn(`Error stopping sound ${key}:`, err);
    }
  }, []);

  const playClick = useCallback(() => playSound("click", { volume: 0.3 }), [playSound]);
  const playBells = useCallback(() => playSound("bells", { volume: 0.4 }), [playSound]);
  const playEarth = useCallback((options?: { volume?: number; loop?: boolean }) => 
    playSound("earth", { volume: 0.5, ...options }), [playSound]);
  const playNeptune = useCallback((options?: { volume?: number; loop?: boolean }) => 
    playSound("neptune", { volume: 0.5, ...options }), [playSound]);

  return {
    playSound,
    stopSound,
    playClick,
    playBells,
    playEarth,
    playNeptune,
  };
}
