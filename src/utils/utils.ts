/**
 * Audio utility functions
 */

/**
 * Gradually fades out audio volume over 1 second intervals
 * @param audio - HTMLAudioElement to fade out
 */
export const fadeOutSound = (audio: HTMLAudioElement): void => {
  const FADE_STEP = 0.05;
  const FADE_INTERVAL_MS = 1000;

  const fade = setInterval(() => {
    if (audio.volume > FADE_STEP) {
      audio.volume -= FADE_STEP;
    } else {
      audio.volume = 0;
      audio.pause();
      audio.currentTime = 0;
      clearInterval(fade);
    }
  }, FADE_INTERVAL_MS);
};

/**
 * @deprecated Use named exports instead. Kept for backward compatibility.
 */
export const utilsService = { fadeOutSound };
