import { useMemo } from 'react'
import toHtml from 'rehype-stringify'
import withGfm from 'remark-gfm'
import fromMarkdown from 'remark-parse'
import toHast from 'remark-rehype'
import { unified } from 'unified'

const markdownProcessor = unified().use(fromMarkdown).use(withGfm).use(toHast).use(toHtml)

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

  /**
   * tailwind by default resets heading and list styles.
   * we use @tailwind/typography plugin to add back default prose styles.
   */
  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}
