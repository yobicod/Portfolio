"use client";

import { useSound } from "@/components/SoundProvider";
import { useTranslation } from "@/i18n/I18nProvider";

export default function SoundToggle() {
  const { enabled, toggle } = useSound();
  const { t } = useTranslation();
  const label = enabled ? t.nav.soundOn : t.nav.soundOff;

  return (
    <button
      type="button"
      className={enabled ? "sound-toggle is-enabled" : "sound-toggle"}
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10v4h3l4 3V7l-4 3H4Z" />
        <path className="sound-toggle__wave sound-toggle__wave--near" d="M15 9.2a4 4 0 0 1 0 5.6" />
        <path className="sound-toggle__wave sound-toggle__wave--far" d="M17.8 6.5a7.8 7.8 0 0 1 0 11" />
      </svg>
      <span className="sr-only">{label}</span>
    </button>
  );
}
