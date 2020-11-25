import { useMemo } from 'react'
import toHtml from 'rehype-stringify'
import gfm from 'remark-gfm'
import markdown from 'remark-parse'
import toHast from 'remark-rehype'
import unified from 'unified'

/**
 * we should use the markdown processor from `@stefanprobst/markdown-loader`,
 * to match what is used for static content pages, but currently
 * this does not have a treeshakeable export.
 */
const markdownProcessor = unified()
  .use(markdown)
  .use(gfm)
  .use(toHast)
  .use(toHtml)

/**
 * renders markdown as html.
 */
export default function Markdown({ text }: { text?: string }): JSX.Element {
  /**
   * markdown is processed synchronously. if this turns out to be a performance issue,
   * convert `useMemo` to `useEffect` and use `processor.process()`.
   */
  const html = useMemo(() => {
    if (text === undefined) return ''

    return String(markdownProcessor.processSync(text))
  }, [text])

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
