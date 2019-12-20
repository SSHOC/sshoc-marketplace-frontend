import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import Markdown from './Markdown'

export default {
  title: 'Components|Markdown',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

const markdown = `
  # Heading1

  ## Heading2

  Text *italic* **bold** \`inline code\` more text [Link](#) even more text.
  Text *italic* **bold** \`inline code\` more text [Link](#) even more text.
  Text *italic* **bold** \`inline code\` more text [Link](#) even more text.
  Text *italic* **bold** \`inline code\` more text [Link](#) even more text.

  ![Image](https://via.placeholder.com/100)

  \`\`\`js
  const code = 'javascript';
  \`\`\`
`

export const basic = () => <Markdown>{markdown}</Markdown>
