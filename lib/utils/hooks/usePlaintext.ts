// import excerpt from '@stefanprobst/remark-excerpt'
import type { Root } from "mdast";
import { toMarkdown } from "mdast-util-to-markdown";
// import { toString } from 'mdast-util-to-string'
import { useEffect, useMemo, useState } from "react";
import withGfm from "remark-gfm";
import fromMarkdown from "remark-parse";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";

const processor = unified()
	.use(fromMarkdown)
	.use(withGfm)
	// .use(excerpt, {
	//   maxLength,
	//   preferWordBoundaries: true,
	// })
	.use(stripMarkdown)
	.use(function toPlaintext() {
		/**
		 * Avoid escaping character references.
		 *
		 * Use `mdast-util-to-markdown` instead of `mdast-util-to-string` to preserve newlines.
		 *
		 * @see https://github.com/remarkjs/remark/discussions/963
		 */
		this.Compiler = function compile(tree: Root) {
			// return toString(tree)
			return toMarkdown(tree);
		};
	});

export interface UsePlaintextArgs {
	markdown: string;
}

export function usePlaintextSync(args: UsePlaintextArgs): string {
	const { markdown } = args;

	const plaintext = useMemo(() => {
		return String(processor.processSync(markdown));
	}, [markdown]);

	return plaintext;
}

export function usePlaintext(args: UsePlaintextArgs): string {
	const { markdown } = args;

	const [plaintext, setPlaintext] = useState("");

	useEffect(() => {
		let isCanceled = false;

		async function run() {
			const vfile = await processor.process(markdown);

			if (!isCanceled) {
				setPlaintext(String(vfile).replace(/\n+/g, " ").trim());
			}
		}

		run();

		return () => {
			isCanceled = true;
		};
	}, [markdown]);

	return plaintext;
}
