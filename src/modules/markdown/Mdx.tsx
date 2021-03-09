import type { MDXProviderProps } from '@mdx-js/react'
import { MDXProvider } from '@mdx-js/react'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react'

import { Anchor } from '@/modules/ui/Anchor'

import { SectionTitle } from '../ui/typography/SectionTitle'
import { SubSectionTitle } from '../ui/typography/SubSectionTitle'

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
  h2: SectionTitle,
  h3: SubSectionTitle,
  wrapper: Prose,
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

function Prose(props: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className="prose" />
}
