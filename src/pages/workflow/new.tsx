import type { GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/item-form/BackgroundImage'
import { Content } from '@/components/item-form/Content'
import { FormHelpText } from '@/components/item-form/FormHelpText'
import { ItemFormScreenLayout } from '@/components/item-form/ItemFormScreenLayout'
import { useWorkflowFormPage } from '@/components/item-form/useWorkflowFormPage'
import { WorkflowCreateForm } from '@/components/item-form/WorkflowCreateForm'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { PageMainContent } from '@/lib/core/page/PageMainContent'

export namespace CreateWorkflowPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export type Props = WithDictionaries<'authenticated' | 'common'>
}

export async function getStaticProps(): Promise<GetStaticPropsResult<CreateWorkflowPage.Props>> {
  const locale = getLocale()
  const messages = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      messages,
    },
  }
}

export default function CreateWorkflowPage(_props: CreateWorkflowPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()

  const { page, setPage } = useWorkflowFormPage()

  const category = 'workflow'
  const label = t(['common', 'item-categories', category, 'one'])
  const title = t(['authenticated', 'forms', 'create-item'], {
    values: {
      item:
        page.type === 'workflow'
          ? label
          : page.type === 'steps'
            ? t(['common', 'item-categories', 'step', 'other'])
            : t(['common', 'item-categories', 'step', 'one']),
    },
  })

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <ItemFormScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <Content>
            <FormHelpText />
            <WorkflowCreateForm page={page} setPage={setPage} />
          </Content>
          <FundingNotice />
        </ItemFormScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<CreateWorkflowPage.Props> = CreateWorkflowPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
