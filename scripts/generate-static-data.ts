import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { read } from "to-vfile";
import { matter } from "vfile-matter";

import { getPropertyTypes } from "@/data/sshoc/api/property";
import { log, mapBy } from "@/lib/utils";

const aboutCollection = {
	folder: "content/about",
	extension: "mdx",
};

const contributeCollection = {
	folder: "content/contribute",
	extension: "mdx",
};

interface PageMetadata {
	title: string;
	navigationMenu: {
		title: string;
		position: number;
	};
	toc?: boolean;
}

async function generate() {
	const folderPath = join(process.cwd(), "public", "data");
	await mkdir(folderPath, { recursive: true });

	const { propertyTypes } = await getPropertyTypes({ perpage: 100 });
	const propertyTypesById = Object.fromEntries(mapBy(propertyTypes, "code"));
	await writeFile(join(folderPath, "property-types.json"), JSON.stringify(propertyTypesById), {
		encoding: "utf-8",
	});

	const aboutPages = await getCollectionPages(aboutCollection, "/about");
	await writeFile(join(folderPath, "about-pages.json"), JSON.stringify(aboutPages), {
		encoding: "utf-8",
	});

	const contributePages = await getCollectionPages(contributeCollection, "/contribute");
	await writeFile(join(folderPath, "contribute-pages.json"), JSON.stringify(contributePages), {
		encoding: "utf-8",
	});
}

generate()
	.then(() => {
		log.success("Successfully generated static data.");
	})
	.catch((error: unknown) => {
		log.error("Failed to generate static data.\n", String(error));
		process.exitCode = 1;
	});

//

async function getCollectionPages(
	collection: { folder: string; extension: string },
	pathname: string,
) {
	if (collection.folder == null || collection.extension == null) {
		throw new Error("Pages collection config requires `folder` and `extension` to be set.");
	}
	const folderPath = join(process.cwd(), collection.folder);
	const fileExtension = "." + collection.extension;

	const folderEntries = await readdir(folderPath, { encoding: "utf-8", withFileTypes: true });
	const pages = await Promise.all(
		folderEntries
			.filter((folderEntry) => {
				return folderEntry.isFile() && folderEntry.name.endsWith(fileExtension);
			})
			.map(async (folderEntry) => {
				const id = folderEntry.name.slice(0, -fileExtension.length);

				const vfile = await read(join(folderPath, folderEntry.name), { encoding: "utf-8" });
				matter(vfile);
				const { navigationMenu } = vfile.data["matter"] as PageMetadata;

				return {
					label: navigationMenu.title,
					href: `${pathname}/${id}`,
					position: navigationMenu.position,
				};
			}),
	);

	pages.sort((a, b) => {
		return a.position === b.position ? 0 : a.position > b.position ? 1 : -1;
	});

	return pages;
}
