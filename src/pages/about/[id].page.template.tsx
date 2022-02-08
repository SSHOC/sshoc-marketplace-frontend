import type { ParamsInput, StringParams } from '@stefanprobst/next-route-manifest'
import type { Toc } from '@stefanprobst/rehype-extract-toc'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import * as path from 'path'
import type { PropsWithChildren, ReactNode } from 'react'
import { fileURLToPath } from 'url'

import { getLastUpdatedTimestamp } from '@/api/git'
import type { IsoDateString } from '@/lib/core/types'
import AboutScreen from '@/screens/about/AboutScreen'

export namespace AboutPage {
  export interface PathParamsInput extends ParamsInput {
    id: string
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = never
  export interface Props {
    lastUpdatedTimestamp: IsoDateString
    params: PathParams
  }
  export interface TemplateProps extends Props {
    metadata: { title: string; toc?: boolean }
    tableOfContents: Toc
    children: ReactNode
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext<AboutPage.PathParams>,
): Promise<GetStaticPropsResult<AboutPage.Props>> {
  const filePath = path.relative(process.cwd(), fileURLToPath(import.meta.url))
  const lastUpdatedTimestamp = (await getLastUpdatedTimestamp(filePath)).toISOString()
  const id = path.basename(filePath, '.page.mdx')

  return {
    props: {
      lastUpdatedTimestamp,
      params: { id },
    },
  }
}

export default function AboutPage(props: AboutPage.TemplateProps): JSX.Element {
  return <AboutScreen {...props} />
}
