import { findAll } from 'highlight-words-core'
import type { ReactNode } from 'react'
import { Fragment } from 'react'

export interface HighlightedTextProps {
  text: ReactNode
  searchPhrase: string
}

/**
 * Wraps text segments matching a search phrase in highlighted `<mark>` tags.
 *
 * Only handles strings, any other React node is returned as is.
 *
 * @private
 */
export function HighlightedText(props: HighlightedTextProps): JSX.Element | null {
  const { text, searchPhrase } = props

  if (typeof text !== 'string') {
    /* @ts-expect-error Ignore returning {}. */
    return text ?? null
  }

  const searchWords = searchPhrase.split(/\s+/)

  const chunks = findAll({
    searchWords,
    textToHighlight: text,
    autoEscape: true,
  })

  const styles = {
    highlight: 'font-medium bg-transparent text-inherit',
  }

  return (
    <Fragment>
      {chunks.map(({ start, end, highlight }) => {
        const segment = text.slice(start, end)

        if (highlight === false) {
          return segment
        }

        return (
          <mark key={start} className={styles.highlight}>
            {segment}
          </mark>
        )
      })}
    </Fragment>
  )
}
