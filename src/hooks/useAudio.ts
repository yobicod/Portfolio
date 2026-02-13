"use client";
import { useRef, useCallback } from "react";

interface UseAudioOptions {
  loop?: boolean;
  fadeOutDuration?: number;
}

/**
 * Custom hook for managing audio playback
 * Provides play, stop, and fade-out functionality
 */
export const useAudio = (src: string, options: UseAudioOptions = {}) => {
  const { loop = false, fadeOutDuration = 1000 } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = loop;
    }
    return audioRef.current;
  }, [src, loop]);

  const play = useCallback(() => {
    const audio = getAudio();
    audio.currentTime = 0;
    audio.volume = 1;
    audio.play().catch(() => {
      // Autoplay blocked - user interaction required
    });
  }, [getAudio]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const fadeOut = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const steps = 20;
    const stepDuration = fadeOutDuration / steps;
    const volumeStep = audio.volume / steps;

    const fade = setInterval(() => {
      if (audio.volume > volumeStep) {
        audio.volume -= volumeStep;
      } else {
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
        clearInterval(fade);
      }
    }, stepDuration);
  }, [fadeOutDuration]);

  return { play, stop, fadeOut };
};
