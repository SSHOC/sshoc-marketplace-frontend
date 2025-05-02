export const locales = ["en"] as const;

export type Locale = (typeof locales)[number];
export type Locales = Array<Locale>;

export const defaultLocale = "en";
