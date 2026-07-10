"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SoundEffect = "entry" | "navigation" | "language" | "action" | "success";

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  playEffect: (effect: SoundEffect) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);
const preferenceKey = "visal-portfolio-sound";
const ambientVolume = 0.1;
const ambientSource = "/ambient-focus.m4a";

type ActiveEffect = { oscillators: OscillatorNode[]; timeout: number } | null;

/**
 * Keeps the optional soundscape to one ambient element and a small, on-demand
 * Web Audio voice for interaction cues. Nothing is downloaded or played until
 * a visitor deliberately enables sound.
 */
export default function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const activeEffectRef = useRef<ActiveEffect>(null);
  const lastEffectRef = useRef(0);

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setAudioRef = useCallback((audio: HTMLAudioElement | null) => {
    audioRef.current = audio;
    if (audio) audio.volume = 0;
  }, []);

  const getContext = useCallback(async () => {
    if (!contextRef.current) contextRef.current = new AudioContext();
    if (contextRef.current.state === "suspended") await contextRef.current.resume();
    return contextRef.current;
  }, []);

  const getAmbient = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return null;
    if (!audio.src) {
      // The source is assigned only after an explicit opt-in, keeping it out
      // of the critical loading path.
      audio.src = ambientSource;
    }
    return audio;
  }, []);

  const stopFade = useCallback(() => {
    if (fadeFrameRef.current !== null) cancelAnimationFrame(fadeFrameRef.current);
    fadeFrameRef.current = null;
  }, []);

  const fadeAmbient = useCallback((target: number, duration: number, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    stopFade();
    const startVolume = audio.volume;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      audio.volume = startVolume + (target - startVolume) * progress;
      if (progress < 1) fadeFrameRef.current = requestAnimationFrame(tick);
      else {
        fadeFrameRef.current = null;
        onComplete?.();
      }
    };
    fadeFrameRef.current = requestAnimationFrame(tick);
  }, [stopFade]);

  const stopEffect = useCallback(() => {
    const active = activeEffectRef.current;
    if (!active) return;
    window.clearTimeout(active.timeout);
    active.oscillators.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* The voice has already naturally ended. */ }
    });
    activeEffectRef.current = null;
  }, []);

  const playEffect = useCallback((effect: SoundEffect) => {
    if (!enabledRef.current || document.hidden) return;
    const now = performance.now();
    if (effect !== "entry" && now - lastEffectRef.current < 85) return;
    lastEffectRef.current = now;

    void getContext().then((context) => {
      stopEffect();
      const gain = context.createGain();
      gain.connect(context.destination);
      const start = context.currentTime;
      const reduced = prefersReducedMotion();
      const settings: Record<SoundEffect, { frequencies: number[]; duration: number; volume: number; type: OscillatorType }> = {
        entry: { frequencies: [220, 329.63], duration: reduced ? 0.16 : 0.42, volume: 0.026, type: "sine" },
        navigation: { frequencies: [440], duration: 0.11, volume: 0.018, type: "sine" },
        language: { frequencies: [587.33], duration: 0.13, volume: 0.018, type: "triangle" },
        action: { frequencies: [523.25], duration: 0.12, volume: 0.022, type: "sine" },
        success: { frequencies: [523.25, 659.25], duration: 0.28, volume: 0.026, type: "sine" },
      };
      const { frequencies, duration, volume, type } = settings[effect];
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      const oscillators = frequencies.map((frequency, index) => {
        const oscillator = context.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, start + index * 0.028);
        oscillator.connect(gain);
        oscillator.start(start + index * 0.028);
        oscillator.stop(start + duration + 0.03);
        return oscillator;
      });
      const timeout = window.setTimeout(() => {
        gain.disconnect();
        activeEffectRef.current = null;
      }, (duration + 0.08) * 1000);
      activeEffectRef.current = { oscillators, timeout };
    }).catch(() => {
      // A browser can decline an audio context; the site remains fully usable.
    });
  }, [getContext, stopEffect]);

  const startAmbient = useCallback(() => {
    if (!enabledRef.current || document.hidden) return;
    const audio = getAmbient();
    if (!audio) return;
    void audio.play().then(() => {
      fadeAmbient(ambientVolume, prefersReducedMotion() ? 1 : 900);
    }).catch(() => {
      // Playback is retried by the next direct interaction if the browser
      // requires an additional user gesture.
    });
  }, [fadeAmbient, getAmbient]);

  const enable = useCallback(() => {
    enabledRef.current = true;
    setEnabled(true);
    window.localStorage.setItem(preferenceKey, "on");
    startAmbient();
    playEffect("entry");
  }, [playEffect, startAmbient]);

  const disable = useCallback(() => {
    enabledRef.current = false;
    setEnabled(false);
    window.localStorage.setItem(preferenceKey, "off");
    stopEffect();
    const audio = audioRef.current;
    if (!audio) return;
    fadeAmbient(0, prefersReducedMotion() ? 1 : 520, () => audio.pause());
  }, [fadeAmbient, stopEffect]);

  const toggle = useCallback(() => {
    if (enabledRef.current) disable();
    else enable();
  }, [disable, enable]);

  useEffect(() => {
    const restorePreference = () => {
      // Sound is on by default; only an explicit opt-out overrides it.
      if (window.localStorage.getItem(preferenceKey) !== "off") return;
      enabledRef.current = false;
      setEnabled(false);
    };
    // Defer storage work until the first paint has settled.
    const idle = window.setTimeout(restorePreference, 0);
    return () => window.clearTimeout(idle);
  }, []);

  useEffect(() => {
    const resumeFromInteraction = () => startAmbient();
    const onVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        stopFade();
        audio.pause();
      } else if (enabledRef.current) {
        startAmbient();
      }
    };
    window.addEventListener("pointerdown", resumeFromInteraction, { passive: true });
    window.addEventListener("keydown", resumeFromInteraction);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pointerdown", resumeFromInteraction);
      window.removeEventListener("keydown", resumeFromInteraction);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [startAmbient, stopFade]);

  useEffect(() => () => {
    stopFade();
    stopEffect();
    audioRef.current?.pause();
    void contextRef.current?.close();
  }, [stopEffect, stopFade]);

  const value = useMemo(() => ({ enabled, toggle, playEffect }), [enabled, playEffect, toggle]);
  return (
    <SoundContext.Provider value={value}>
      {children}
      <audio ref={setAudioRef} loop preload="none" aria-hidden="true" />
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used within SoundProvider");
  return context;
}
