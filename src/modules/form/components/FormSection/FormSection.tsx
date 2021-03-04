import type { CSSProperties, ReactNode } from 'react'

export interface FormSectionProps {
  title?: string
  /** @default 2 */
  headingLevel?: 1 | 2 | 3 | 4
  children?: ReactNode
  actions?: ReactNode
  style?: CSSProperties
}

export function FormSection(props: FormSectionProps): JSX.Element {
  const { title, headingLevel = 2 } = props

  const ElementType = `h${headingLevel}` as 'h1' | 'h1' | 'h3' | 'h4'

  const styles = {
    section: 'flex flex-col space-y-6',
  }

  if (title === undefined) {
    return (
      <section className={styles.section} style={props.style}>
        {props.children}
      </section>
    )
  }

  return (
    <section className={styles.section} style={props.style}>
      <div className="flex items-baseline space-x-4">
        <ElementType className="font-medium text-gray-800 font-body text-ui-3xl">
          {title}
        </ElementType>
        <span className="flex-1 border-b border-gray-200" />
        <div className="leading-none">{props.actions}</div>
      </div>
      {props.children}
    </section>
  )
}
