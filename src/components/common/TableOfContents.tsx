import type { Toc } from '@stefanprobst/remark-extract-toc'

export function TableOfContents({ toc }: { toc: Toc }): JSX.Element | null {
  if (toc.length === 0) return null

  return (
    <nav aria-labelledby="toc-title" className="text-sm text-muted">
      <h3 className="mb-2 text-xs font-medium tracking-wide uppercase text-muted" id="toc-title">
        Table of contents
      </h3>
      <Level level={toc} />
    </nav>
  )
}

function Level({ level }: { level?: Toc }) {
  if (level == null || level.length === 0) return null

  return (
    <ol className="pl-2">
      {level.map((item) => {
        return (
          <li key={item.depth}>
            <a
              className="transition-colors text-primary-750 hover:text-secondary-600 focus:text-secondary-600"
              href={`#${item.id}`}
            >
              {item.value}
            </a>
            <Level level={item.children} />
          </li>
        )
      })}
    </ol>
  )
}
