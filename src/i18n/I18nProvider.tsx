"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, isLocale, localeStorageKey, locales, type Dictionary, type Locale } from "@/i18n";

type I18nContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: Dictionary };
const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    if (isLocale(storedLocale)) updateLocale(storedLocale);
  }, []);

  useEffect(() => {
    const dictionary = locales[locale];
    document.documentElement.lang = locale;
    document.title = dictionary.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", dictionary.metadata.description);
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    if (nextLocale === locale) return;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    window.localStorage.setItem(localeStorageKey, nextLocale);
    updateLocale(nextLocale);
    window.requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t: locales[locale] }), [locale, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useTranslation must be used within I18nProvider");
  return context;
}
