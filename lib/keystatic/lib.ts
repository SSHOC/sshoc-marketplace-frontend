import type { Collection, ComponentSchema, Singleton } from "@keystatic/core";
import type { ContentComponent } from "@keystatic/core/content-components";
import slugify from "@sindresorhus/slugify";

import { defaultLocale, getIntlLanguage } from "@/lib/i18n/locales";

const language = getIntlLanguage(defaultLocale);

export function createPaths<TPath extends `/${string}/`>(path: TPath) {
	return {
		assetPath: `/content/assets/${path}`,
		downloadPath: `/content/downloads/${path}`,
	} as const;
}

export type Paths<TPath extends `/${string}/`> = ReturnType<typeof createPaths<TPath>>;

export function createCollectionPaths<TPath extends `/${string}/`>(path: TPath) {
	return {
		...createPaths(path),
		contentPath: `./content/${language}${path}*/`,
	} as const;
}

export function createSingletonPaths<TPath extends `/${string}/`>(path: TPath) {
	return {
		...createPaths(path),
		contentPath: `./content/${language}${path}`,
	} as const;
}

export function createCollection<
	TPath extends `/${string}/`,
	TSchema extends Record<string, ComponentSchema>,
	TSlugField extends string,
>(
	path: TPath,
	createLocalisedCollectionFactory: (
		paths: ReturnType<typeof createCollectionPaths<TPath>>,
	) => Collection<TSchema, TSlugField>,
) {
	return function createLocalisedCollection() {
		const paths = createCollectionPaths(path);
		return createLocalisedCollectionFactory(paths);
	};
}

export function createSingleton<
	TPath extends `/${string}/`,
	TSchema extends Record<string, ComponentSchema>,
>(
	path: TPath,
	createLocalisedSingletonFactory: (
		paths: ReturnType<typeof createSingletonPaths<TPath>>,
	) => Singleton<TSchema>,
) {
	return function createLocalisedSingleton() {
		const paths = createSingletonPaths(path);
		return createLocalisedSingletonFactory(paths);
	};
}

export function createAssetOptions<TPath extends `/${string}/`>(
	path: Paths<TPath>["assetPath"] | Paths<TPath>["downloadPath"],
) {
	return {
		directory: `./public/assets${path}` as const,
		publicPath: `/assets${path}` as const,
		transformFilename(originalFilename: string) {
			return slugify(originalFilename, { preserveCharacters: ["."] });
		},
	};
}

export function createContentFieldOptions<TPath extends `/${string}/`>(paths: Paths<TPath>) {
	const assetPaths = createAssetOptions(paths.assetPath);
	const headingLevels = [2, 3, 4, 5] as const;

	return {
		heading: headingLevels,
		image: assetPaths,
	};
}

export function createComponent<
	TPath extends `/${string}/`,
	TComponents extends Record<string, ContentComponent>,
>(createComponentFactory: (paths: Paths<TPath>) => TComponents) {
	return function createComponent(paths: Paths<TPath>) {
		return createComponentFactory(paths);
	};
}
