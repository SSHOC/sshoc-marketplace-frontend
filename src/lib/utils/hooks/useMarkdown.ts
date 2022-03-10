import type { ReactNode } from 'react'
import { createElement, Fragment, useEffect, useMemo, useState } from 'react'
// import toHtml from 'rehype-stringify'
import toElements from 'rehype-react'
import withGfm from 'remark-gfm'
import fromMarkdown from 'remark-parse'
import toHast from 'remark-rehype'
import { unified } from 'unified'

const processor = unified()
  .use(fromMarkdown)
  .use(withGfm)
  .use(toHast)
  .use(toElements, { createElement, Fragment })

export interface UseMarkdownArgs {
  markdown: string
}

export function useMarkdownSync(args: UseMarkdownArgs): ReactNode {
  const { markdown } = args

  const element = useMemo(() => {
    return processor.processSync(markdown).result
  }, [markdown])

  return element
}

export function useMarkdown(args: UseMarkdownArgs): ReactNode {
  const { markdown } = args

  const [element, setElement] = useState<ReactNode>(null)

  useEffect(() => {
    processor.process(markdown).then((file) => {
      return setElement(file.result)
    })
  }, [markdown])

  return element
}
