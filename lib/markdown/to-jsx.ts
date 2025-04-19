import type { ReactNode } from "react";
import runtime from "react/jsx-runtime";
import toReact from "rehype-react";
import withGfm from "remark-gfm";
import fromMarkdown from "remark-parse";
import toHast from "remark-rehype";
import { unified } from "unified";

const processor = unified().use(fromMarkdown).use(withGfm).use(toHast).use(toReact, runtime);

export async function toJsx(markdown: string): Promise<ReactNode> {
	const vfile = await processor.process(markdown);
	return vfile.result;
}
