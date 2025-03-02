import type { Toc } from '@stefanprobst/rehype-extract-toc'
import { useTranslations } from 'next-intl'

import css from '@/components/common/TableOfContents.module.css'

export interface TableOfContentsProps {
  /** @default 2 */
  maxDepth?: number
  tableOfContents: Toc
}

export function TableOfContents(props: TableOfContentsProps): JSX.Element {
  const { maxDepth = 2, tableOfContents } = props

  const t = useTranslations('common')

  return (
    <nav aria-label={t('table-of-contents')} className={css['nav']}>
      <h2 className={css['heading']}>{t('table-of-contents')}</h2>
      <Level entries={tableOfContents} depth={1} maxDepth={maxDepth} />
    </nav>
  )
}

interface LevelProps {
  depth: number
  entries: Toc | undefined
  maxDepth: number
}

function Level(props: LevelProps): JSX.Element | null {
  const { depth, entries, maxDepth } = props

  if (entries == null || entries.length === 0 || depth > maxDepth) {
    return null
  }

  return (
    <ol className={css['list']} data-depth={depth > 1 ? '' : undefined} role="list">
      {entries.map((entry) => {
        return (
          <li key={entry.id} className={css['list-item']}>
            <a href={'#' + entry.id}>{entry.value}</a>
            <Level entries={entry.children} depth={depth + 1} maxDepth={maxDepth} />
          </li>
        )
      })}
    </ol>
  )
}
