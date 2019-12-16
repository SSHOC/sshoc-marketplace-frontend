import React, { createElement, Fragment, useEffect, useState } from 'react'
import rehypeReact from 'rehype-react'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import unified from 'unified'
import CodeBlock from '../CodeBlock/CodeBlock'

const components = {
  pre: ({ children }) => {
    if (children[0]?.type === 'code') {
      return (
        <CodeBlock
          {...children[0].props}
          children={children[0].props.children[0]}
        />
      )
    }
    return children
  },
}

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  // TODO: do we need to sanitize client side w/ rehype-sanitize?
  // default schema is github-style sanitation
  // .use(sanitize)
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
