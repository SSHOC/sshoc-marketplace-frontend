import * as runtime from "react/jsx-runtime";
import toVdom from "rehype-react";
import withGfm from "remark-gfm";
import withMdx from "remark-mdx";
import fromMarkdown from "remark-parse";
import toHast from "remark-rehype";
import { unified } from "unified";
import withSyntaxHighlighting from "@shikijs/rehype";

import { syntaxHighlightingTheme } from "~/config/docs.config.mjs";

const processor = unified()
  .use(fromMarkdown)
  .use(withMdx)
  .use(withGfm)
  .use(toHast)
  .use(withSyntaxHighlighting, { theme: syntaxHighlightingTheme })
  .use(toVdom, {
    Fragment: runtime.Fragment,
    jsx: runtime.jsx,
    jsxs: runtime.jsxs,
  });

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export async function createProcessor() {
  return processor;
}
