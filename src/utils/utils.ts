const fadeOutSound = (audio: HTMLAudioElement) => {
  const fade = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      audio.volume = 0;
      audio.pause();
      audio.currentTime = 0;
      clearInterval(fade);
    }
  }, 1000);
};

export const utilsService = { fadeOutSound };
