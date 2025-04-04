import type { Node, Root } from "mdast";
import { toMarkdown } from "mdast-util-to-markdown";
import withGfm from "remark-gfm";
import fromMarkdown from "remark-parse";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";

const processor = unified()
	.use(fromMarkdown)
	.use(withGfm)
	.use(stripMarkdown)
	.use(function () {
		/**
		 * Using custom compiler instead of `remark-stringify` to avoid escaping character references.
		 * Using `mdast-util-to-markdown` instead of `mdast-util-to-string` to preserve newlines.
		 *
		 * @see https://github.com/remarkjs/remark/discussions/963
		 */
		this.compiler = (tree: Node) => {
			return toMarkdown(tree as Root);
		};
	});

export async function toPlaintext(markdown: string) {
	const vfile = await processor.process(markdown);
	return String(vfile).replace(/\n+/g, " ").trim();
}
