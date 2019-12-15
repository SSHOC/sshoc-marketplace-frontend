import { createElement, Fragment, useEffect, useState } from 'react'
import rehypeReact from 'rehype-react'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import unified from 'unified'

const components = {}

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(rehypeReact, { components, createElement, Fragment })

const Markdown = ({ children }) => {
  const [markdown, setMarkdown] = useState(null)

  useEffect(() => {
    processor.process(children).then(processed => {
      setMarkdown(processed.contents)
    })
  }, [children])

  return markdown
}
export default Markdown
