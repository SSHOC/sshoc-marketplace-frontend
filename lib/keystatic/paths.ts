import slugify from "@sindresorhus/slugify";

function transformFilename(path: string) {
	return slugify(path, { preserveCharacters: ["."] });
}

function createAssetPaths(path: `/${string}/`) {
	return {
		downloads: {
			directory: `./public/assets/content/downloads${path}`,
			publicPath: `/assets/content/downloads${path}`,
			transformFilename,
		},
		images: {
			directory: `./public/assets/content/images${path}`,
			publicPath: `/assets/content/images${path}`,
			transformFilename,
		},
	} as const;
}

export function createCollectionPaths(path: `/${string}/`) {
	return {
		assets: createAssetPaths(path),
		content: `./content${path}*/`,
	} as const;
}

type CollectionPaths = ReturnType<typeof createCollectionPaths>;

export function createSingletonPaths(path: `/${string}/`) {
	return {
		assets: createAssetPaths(path),
		content: `./content${path}`,
	} as const;
}

type SingletonPaths = ReturnType<typeof createSingletonPaths>;

export type Paths = CollectionPaths | SingletonPaths;
