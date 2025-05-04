import { basename } from "node:path";
import { pathToFileURL } from "node:url";

import { compile as compileMdx } from "@mdx-js/mdx";
import withToc from "@stefanprobst/rehype-extract-toc";
import withHeadingIds from "rehype-slug";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import type { VFile } from "vfile";

export async function compile(vfile: VFile) {
	return compileMdx(vfile, {
		baseUrl: pathToFileURL(basename(vfile.path)),
		outputFormat: "function-body",
		remarkPlugins: [withFrontmatter, withGfm],
		rehypePlugins: [withHeadingIds, withToc],
	});
}
