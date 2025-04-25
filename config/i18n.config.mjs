/** @typedef {Mutable<typeof supportedLocales>} Locales */
/** @typedef {Locales[number]} Locale */

const supportedLocales = /** @type {const} */ (["en"]);

export const defaultLocale = /** @type {Locale} */ ("en");

export const locales = /** @type {Locales} */ (supportedLocales);
