import { compile as compileMdx } from "@mdx-js/mdx";
import withToc from "@stefanprobst/rehype-extract-toc";
import withGfm from "remark-gfm";
import withFrontmatter from "remark-frontmatter";
import type { VFile } from "vfile";
import { pathToFileURL } from "node:url";
import { basename } from "node:path";

export async function compile(vfile: VFile) {
	return compileMdx(vfile, {
		baseUrl: pathToFileURL(basename(vfile.path)),
		outputFormat: "function-body",
		remarkPlugins: [withFrontmatter, withGfm],
		rehypePlugins: [withToc],
	});
}
