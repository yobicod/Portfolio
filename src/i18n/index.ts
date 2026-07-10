import { en } from "@/locales/en";
import { th } from "@/locales/th";
import type { Dictionary } from "@/locales/types";

export const locales = { en, th } as const;
export type Locale = keyof typeof locales;
export type { Dictionary };
export const defaultLocale: Locale = "en";
export const localeStorageKey = "visal-portfolio-locale";

export function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "th";
}
