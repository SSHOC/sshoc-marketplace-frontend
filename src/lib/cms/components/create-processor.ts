import withSyntaxHighlighting from "@stefanprobst/rehype-shiki";
import { createElement } from "react";
import toVdom from "rehype-react";
import withGfm from "remark-gfm";
import withMdx from "remark-mdx";
import fromMarkdown from "remark-parse";
import toHast from "remark-rehype";
import { getHighlighter } from "shiki";
import { unified } from "unified";

import { syntaxHighlightingTheme } from "~/config/docs.config.mjs";

const processor = unified()
	.use(fromMarkdown)
	.use(withMdx)
	.use(withGfm)
	.use(toHast)
	.use(toVdom, { createElement });

export async function createProcessor() {
	const highlighter = await getHighlighter({ theme: syntaxHighlightingTheme });

	// TODO: cache this
	return processor.use(withSyntaxHighlighting, { highlighter });
}
