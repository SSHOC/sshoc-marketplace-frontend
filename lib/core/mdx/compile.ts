import { basename } from "node:path";
import { pathToFileURL } from "node:url";

import { withIframeTitles, withImageSizes, withTableOfContents } from "@acdh-oeaw/mdx-lib";
import { compile as compileMdx } from "@mdx-js/mdx";
import withHeadingIds from "rehype-slug";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import withTypographicQuotes from "remark-smartypants";
import type { VFile } from "vfile";

export async function compile(vfile: VFile) {
	return compileMdx(vfile, {
		baseUrl: pathToFileURL(basename(vfile.path)),
		outputFormat: "function-body",
		remarkPlugins: [withFrontmatter, withGfm, withTypographicQuotes],
		rehypePlugins: [withHeadingIds, withTableOfContents, withIframeTitles, withImageSizes],
	});
}
