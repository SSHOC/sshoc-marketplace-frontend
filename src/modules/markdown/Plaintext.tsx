import excerpt from '@stefanprobst/remark-excerpt'
import { Fragment, useMemo } from 'react'
import markdown from 'remark-parse'
import toMarkdown from 'remark-stringify'
import strip from 'strip-markdown'
import unified from 'unified'

/**
 * we should use the markdown processor from `@stefanprobst/markdown-loader`,
 * to match what is used for static content pages, but currently
 * this does not have a treeshakeable export.
 */
const markdownProcessor = unified().use(markdown).use(toMarkdown)

/**
 * removes markdown formatting from text.
 */
export default function Plaintext({
  text,
  maxLength,
}: {
  text?: string
  maxLength?: number
}): JSX.Element {
  /**
   * markdown is processed synchronously. if this turns out to be a performance issue,
   * convert `useMemo` to `useEffect` and use `processor.process()`.
   */
  const plainText = useMemo(() => {
    if (text === undefined) return ''

    const processor =
      maxLength !== undefined
        ? markdownProcessor()
            .use(excerpt, {
              maxLength,
              preferWordBoundaries: true,
            })
            .use(strip)
        : markdownProcessor().use(strip)
    return String(processor.processSync(text))
  }, [text, maxLength])

  return <Fragment>{plainText}</Fragment>
}
