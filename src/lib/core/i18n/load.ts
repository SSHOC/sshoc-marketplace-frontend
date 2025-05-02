import type { Dictionary } from "@/dictionaries";
import type { Locale } from "~/config/i18n.config";

export async function load<K extends keyof Dictionary>(
	locale: Locale,
	namespaces: Array<K>,
): Promise<Pick<Dictionary, K>> {
	const translations = await Promise.all(
		namespaces.map(async (namespace) => {
			/**
			 * The path must be provided as string literal or template string literal.
			 *
			 * @see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
			 */
			const dictionary = await import(`@/dictionaries/${namespace}/${locale}.ts`).then((module) => {
				return module.dictionary;
			});

			return [namespace, dictionary];
		}),
	);

	return Object.fromEntries(translations);
}
