import type { en } from "@/locales/en";

type WidenStrings<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? readonly WidenStrings<Item>[]
    : T extends object
      ? { [Key in keyof T]: WidenStrings<T[Key]> }
      : T;

export type Dictionary = WidenStrings<typeof en>;
