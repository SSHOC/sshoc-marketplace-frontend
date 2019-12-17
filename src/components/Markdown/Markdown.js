import detab from 'detab'
import { createElement, Fragment, useEffect, useState } from 'react'
import rehypeReact from 'rehype-react'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import unified from 'unified'
import u from 'unist-builder'
import CodeBlock from '../CodeBlock/CodeBlock'

const handlers = {
  inlineCode(h, node) {
    return Object.assign({}, node, {
      type: 'element',
      tagName: 'inlineCode',
      properties: {},
      children: [
        {
          type: 'text',
          value: node.value,
        },
      ],
    })
  },
  code(h, node) {
    const value = node.value ? detab(node.value + '\n') : ''
    const lang = node.lang
    const props = {}

    if (lang) {
      props.className = ['language-' + lang]
    }

    return h(node.position, 'pre', [h(node, 'code', props, [u('text', value)])])
  },
}

const components = {
  code: CodeBlock,
  inlineCode: 'code',
}

const processor = unified()
  .use(markdown)
  .use(remark2rehype, { handlers })
  // TODO: do we need to sanitize client side w/ rehype-sanitize?
  // default schema is github-style sanitation
  // .use(sanitize)
  .use(rehypeReact, { components, createElement, Fragment })

const Markdown = ({ children }) => {
  // FIXME: check if rendering sync w/ processor.processSync is less jumpy
  const [markdown, setMarkdown] = useState(null)

  useEffect(() => {
    processor.process(children).then(processed => {
      setMarkdown(processed.contents)
    })
  }, [children])

  return markdown
}
export default Markdown
