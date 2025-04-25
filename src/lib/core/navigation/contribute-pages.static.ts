import type { ValLoaderResult } from "@stefanprobst/val-loader";
import { promises as fs } from "fs";
import * as path from "path";

import { collection } from "@/lib/cms/collections/contribute-pages";

interface ContributePageMetadata {
	title: string;
	navigationMenu: {
		title: string;
		position: number;
	};
}

export type StaticResult = Array<{ label: string; href: { pathname: string }; position: number }>;

export default async function load(): Promise<ValLoaderResult> {
	/** `val-loader` currently does not support ESM. */
	const { read } = await import("to-vfile");
	const { matter } = await import("vfile-matter");

	if (collection.folder == null || collection.extension == null) {
		throw new Error(
			"Contribute pages collection config requires `folder` and `extension` to be set.",
		);
	}
	const folderPath = path.join(process.cwd(), collection.folder);
	const fileExtension = "." + collection.extension;

	const folderEntries = await fs.readdir(folderPath, { encoding: "utf-8", withFileTypes: true });
	const pages: StaticResult = await Promise.all(
		folderEntries
			.filter((folderEntry) => {
				return folderEntry.isFile() && folderEntry.name.endsWith(fileExtension);
			})
			.map(async (folderEntry) => {
				const id = folderEntry.name.slice(0, -fileExtension.length);

				const vfile = matter(
					await read(path.join(folderPath, folderEntry.name), { encoding: "utf-8" }),
				);
				const { navigationMenu } = vfile.data["matter"] as ContributePageMetadata;

				return {
					label: navigationMenu.title,
					href: `/contribute/${id}`,
					position: navigationMenu.position,
				};
			}),
	);

	pages.sort((a, b) => {
		return a.position === b.position ? 0 : a.position > b.position ? 1 : -1;
	});

	return {
		cacheable: true,
		code: `export default ${JSON.stringify(pages)}`,
		contextDependencies: [folderPath],
		/**
		 * Since `val-loader` will generate a bundle with `esbuild` we should manually
		 * add non-external imports here (although it does not matter much in this case).
		 */
		dependencies: [path.join(process.cwd(), "./src/lib/cms/collections/contribute-pages.ts")],
	};
}
