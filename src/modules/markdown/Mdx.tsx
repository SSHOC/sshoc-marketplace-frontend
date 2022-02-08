import type { MDXProps } from 'mdx/types'
import NextLink from 'next/link'
import type { ComponentPropsWithoutRef, FC, PropsWithChildren } from 'react'

import { Image } from '@/components/common/Image'
import { Link } from '@/lib/core/navigation/Link'
import { Anchor } from '@/modules/ui/Anchor'

import { SectionTitle } from '../ui/typography/SectionTitle'
import { SubSectionTitle } from '../ui/typography/SubSectionTitle'

type MdxProps = PropsWithChildren<{
  components?: MDXProps['components']
  content: FC<MDXProps>
}>

export default function Mdx({ content: Content, components }: MdxProps): JSX.Element {
  return (
    <Content
      // @ts-expect-error fix types later
      components={{
        ...defaultComponents,
        ...components,
      }}
    />
  )
}

const defaultComponents = {
  a: AbsoluteOrRelativeLink,
  h2: SectionTitle,
  h3: SubSectionTitle,
  wrapper: Prose,
  Link,
  Image,
}

function AbsoluteOrRelativeLink({ children, href, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href === undefined) return null

  if (isAbsoluteUrl(href)) {
    return (
      <Anchor href={href} {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </Anchor>
    )
  }

  return (
    <NextLink href={href} passHref>
      <Anchor {...props}>{children}</Anchor>
    </NextLink>
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
