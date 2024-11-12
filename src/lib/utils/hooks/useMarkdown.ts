import * as runtime from "react/jsx-runtime";
import type { ReactNode } from "react";
import { createElement, Fragment, useEffect, useMemo, useState } from "react";
// import toHtml from 'rehype-stringify'
import toVdom from "rehype-react";
import withGfm from "remark-gfm";
import fromMarkdown from "remark-parse";
import toHast from "remark-rehype";
import { unified } from "unified";

const processor = unified()
  .use(fromMarkdown)
  .use(withGfm)
  .use(toHast)
  .use(toVdom, {
    Fragment: runtime.Fragment,
    jsx: runtime.jsx,
    jsxs: runtime.jsxs,
  });

export interface UseMarkdownArgs {
  markdown: string;
}

export function useMarkdownSync(args: UseMarkdownArgs): ReactNode {
  const { markdown } = args;

  const element = useMemo(() => {
    return processor.processSync(markdown).result;
  }, [markdown]);

  return element;
}

export function useMarkdown(args: UseMarkdownArgs): ReactNode {
  const { markdown } = args;

  const [element, setElement] = useState<ReactNode>(null);

  useEffect(() => {
    let isCanceled = false;

    async function run() {
      const vfile = await processor.process(markdown);

      if (!isCanceled) {
        setElement(vfile.result);
      }
    }

    run();

    return () => {
      isCanceled = true;
    };
  }, [markdown]);

  return element;
}
