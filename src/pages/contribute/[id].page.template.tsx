import type { ParamsInput, StringParams } from '@stefanprobst/next-route-manifest'
import type { Toc } from '@stefanprobst/rehype-extract-toc'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import * as path from 'path'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { fileURLToPath } from 'url'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ItemSearchBar } from '@/components/common/ItemSearchBar'
import { LastUpdatedTimestamp } from '@/components/common/LastUpdatedTimestamp'
import { Prose } from '@/components/common/Prose'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/contribute/BackgroundImage'
import { Content } from '@/components/contribute/Content'
import { ContributeScreenLayout } from '@/components/contribute/ContributeScreenLayout'
import { ContributeScreenNavigation } from '@/components/contribute/ContributeScreenNavigation'
import { getLastUpdatedTimestamp } from '@/data/git/get-last-updated-timestamp'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import type { IsoDateString } from '@/lib/core/types'
import { Breadcrumbs } from '@/lib/core/ui/Breadcrumbs/Breadcrumbs'

/**
 * This page does note generate routes directly. It is used:
 * - to create an entry in the autogenerated route manifest
 * - to wrap article pages via mdx webpack loader
 *
 * That's why `getStaticPaths` is not needed, why we cannot pass down
 * `context.params` from `GetStaticPropsContext` to the component, why the
 * page component accepts a `children` prop, and why `metadata` is in scope
 * (it is added by `@stefanprobst/remark-extract-yaml-frontmatter/mdx`).
 */

export namespace ContributePage {
  export interface PathParamsInput extends ParamsInput {
    id: string
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'common'> {
    lastUpdatedTimestamp: IsoDateString
    params: PathParams
  }
  export interface TemplateProps extends Props {
    children: ReactNode
    metadata: { title: string; toc?: boolean }
    tableOfContents: Toc
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext<ContributePage.PathParams>,
): Promise<GetStaticPropsResult<ContributePage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['common'])

  const filePath = path.relative(process.cwd(), fileURLToPath(import.meta.url))
  const lastUpdatedTimestamp = (await getLastUpdatedTimestamp(filePath)).toISOString()
  const id = path.basename(filePath, '.page.mdx')

  return {
    props: {
      dictionaries,
      lastUpdatedTimestamp,
      params: { id },
    },
  }
}

export default function ContributePage(props: ContributePage.TemplateProps): JSX.Element {
  const { id } = props.params

  const { t } = useI18n<'common'>()

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(['common', 'pages', 'home']) },
    { href: routes.ContributePage({ id }), label: props.metadata.title },
  ]

  return (
    <Fragment>
      <PageMetadata title={props.metadata.title} />
      <PageMainContent>
        <ContributeScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ScreenTitle>{props.metadata.title}</ScreenTitle>
          </ScreenHeader>
          <ContributeScreenNavigation />
          <Content>
            <Prose>{props.children}</Prose>
            <LastUpdatedTimestamp dateTime={props.lastUpdatedTimestamp} />
          </Content>
          <FundingNotice />
        </ContributeScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<ContributePage.Props> = ContributePage

Page.getLayout = undefined