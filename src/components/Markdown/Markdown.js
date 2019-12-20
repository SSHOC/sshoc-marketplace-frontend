import css from '@styled-system/css'
import detab from 'detab'
import React, { createElement, Fragment } from 'react'
import rehypeReact from 'rehype-react'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import 'styled-components/macro'
import unified from 'unified'
import u from 'unist-builder'
import Heading from '../../elements/Heading/Heading'
import Link from '../../elements/Link/Link'
import Text from '../../elements/Text/Text'
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
  a: Link,
  code: CodeBlock,
  // FIXME: heading margins; also: do we need more than 3 heading levels?
  h1: props => <Heading as="h3" variant="h4" css={css({ my: 2 })} {...props} />,
  h2: props => <Heading as="h4" variant="h5" css={css({ my: 2 })} {...props} />,
  h3: props => <Heading as="h5" variant="h6" css={css({ my: 2 })} {...props} />,
  inlineCode: 'code',
  p: props => <Text variant="paragraph" {...props} />,
  strong: props => <strong css={css({ fontWeight: 'semiBold' })} {...props} />,
}

const processor = unified()
  .use(markdown)
  .use(remark2rehype, { handlers })
  // TODO: do we need to sanitize client side w/ rehype-sanitize?
  // default schema is github-style sanitation
  // .use(sanitize)
  .use(rehypeReact, { components, createElement, Fragment })

// TODO: should we cache plaintext and rendered markdown descriptions in redux
// (and possibly immediately process them on fetch)?
const Markdown = ({ children }) => {
  return processor.processSync(children).contents
}
export default Markdown
