import type { Locale } from "@/config/i18n.config";

export async function load(locale: Locale, namespaces: Array<"common" | "authenticated">) {
	const translations = await Promise.all(
		namespaces.map(async (namespace) => {
			/**
			 * The path must be provided as string literal or template string literal.
			 *
			 * @see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
			 */
			const messages = await import(`@/messages/${locale}/${namespace}.json`).then((module) => {
				return module.default;
			});

			return [namespace, messages];
		}),
	);

	return Object.fromEntries(translations);
}
