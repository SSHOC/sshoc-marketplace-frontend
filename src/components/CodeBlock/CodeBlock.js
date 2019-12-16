import css from '@styled-system/css'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/github'
import React from 'react'
import 'styled-components/macro'

const CodeBlock = ({ children, className }) => {
  if (!children) return null

  // TODO: default language for syntax highlighting?
  const language = className ? className.replace(/language-/, '') : ''

  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language}
      theme={theme}
    >
      {({ className, getLineProps, getTokenProps, style, tokens }) => (
        <pre
          className={className}
          css={css({ overflowX: 'auto', px: 3, py: 2 })}
          style={style}
        >
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
