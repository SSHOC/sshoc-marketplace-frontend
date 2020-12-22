import { MDXProvider } from '@mdx-js/react'
import type { MDXProviderProps } from '@mdx-js/react'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react'
import { SectionTitle } from '../ui/typography/SectionTitle'
import { SubSectionTitle } from '../ui/typography/SubSectionTitle'
import { Anchor } from '@/modules/ui/Anchor'
import { Paragraph } from '@/modules/ui/typography/Paragraph'

type MdxProps = PropsWithChildren<{
  components?: MDXProviderProps['components']
}>

/**
 * Provides default components for rendering mdx content.
 *
 * We don't put the `MDXProvider` in `pages/_app` to avoid
 * bundling components which are only needed on static pages
 * rendering mdx content.
 */
export default function Mdx({ children, components }: MdxProps): JSX.Element {
  return (
    <MDXProvider
      components={{
        ...defaultComponents,
        ...components,
      }}
    >
      {children}
    </MDXProvider>
  )
}

const defaultComponents = {
  a: AbsoluteOrRelativeLink,
  p: Paragraph,
  h2: SectionTitle,
  h3: SubSectionTitle,
  ul: List,
}

function AbsoluteOrRelativeLink({
  children,
  href,
  ...props
}: ComponentPropsWithoutRef<'a'>) {
  if (href === undefined) return null

  if (isAbsoluteUrl(href)) {
    return (
      <Anchor href={href} {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </Anchor>
    )
  }

  return (
    <Link href={href} passHref>
      <Anchor {...props}>{children}</Anchor>
    </Link>
  )
}

function isAbsoluteUrl(href: string) {
  try {
    new URL(href)
    return true
  } catch {
    return false
  }
}

function List({ children, ...props }: ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul className="space-y-3 leading-loose" {...props}>
      {children}
    </ul>
  )
}
