"use client";

import { useTranslation } from "@/i18n/I18nProvider";
import { useSound } from "@/components/SoundProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();
  const { playEffect } = useSound();
  const switchLanguage = (nextLocale: "en" | "th") => {
    if (nextLocale === locale) return;
    playEffect("language");
    setLocale(nextLocale);
  };
  return (
    <div className="language-switcher" role="group" aria-label={t.nav.languageLabel}>
      <button type="button" className={locale === "en" ? "is-active" : ""} aria-pressed={locale === "en"} onClick={() => switchLanguage("en")}>
        <span aria-hidden="true">EN</span><span className="sr-only">{t.nav.english}</span>
      </button>
      <span aria-hidden="true">/</span>
      <button type="button" className={locale === "th" ? "is-active" : ""} aria-pressed={locale === "th"} onClick={() => switchLanguage("th")}>
        <span aria-hidden="true">TH</span><span className="sr-only">{t.nav.thai}</span>
      </button>
    </div>
  );
}
