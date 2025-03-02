import type { FormApi, SubmissionErrors } from 'final-form'
import type { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/item-form/BackgroundImage'
import { Content } from '@/components/item-form/Content'
import type { ItemFormValues } from '@/components/item-form/ItemForm'
import { ItemForm } from '@/components/item-form/ItemForm'
import { ItemFormScreenLayout } from '@/components/item-form/ItemFormScreenLayout'
import { useCreateOrUpdateTool } from '@/components/item-form/useCreateOrUpdateTool'
import { useToolFormFields } from '@/components/item-form/useToolFormFields'
import { useToolValidationSchema } from '@/components/item-form/useToolValidationSchema'
import { useUpdateItemMeta } from '@/components/item-form/useUpdateItemMeta'
import type { Tool, ToolInput } from '@/data/sshoc/api/tool-or-service'
import { useTool, useToolVersion } from '@/data/sshoc/hooks/tool-or-service'
import type { PageComponent } from '@/lib/core/app/types'
import { FORM_ERROR } from '@/lib/core/form/Form'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { useSearchParams } from '@/lib/core/navigation/useSearchParams'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'

export type UpdateToolOrServiceFormValues = ItemFormValues<ToolInput>

export namespace EditToolOrServiceVersionPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Tool['persistentId']
    versionId: Tool['id']
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'authenticated' | 'common'> {
    params: PathParams
  }
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<EditToolOrServiceVersionPage.PathParams>
> {
  const persistentIds: Array<Tool['persistentId']> = []
  const versionIds: Array<Tool['id']> = []

  const paths = persistentIds.flatMap((persistentId) => {
    return versionIds.map((versionId) => {
      const params = { persistentId, versionId: String(versionId) }
      return { params }
    })
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext<EditToolOrServiceVersionPage.PathParams>,
): Promise<GetStaticPropsResult<EditToolOrServiceVersionPage.Props>> {
  const locale = getLocale()
  const params = context.params as EditToolOrServiceVersionPage.PathParams
  const messages = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      messages,
      params,
    },
  }
}

export default function EditToolOrServiceVersionPage(
  props: EditToolOrServiceVersionPage.Props,
): JSX.Element {
  const t = useTranslations()
  const router = useRouter()

  const { persistentId, versionId: _versionId } = props.params
  const versionId = Number(_versionId)
  const searchParams = useSearchParams()
  const isDraftVersion = searchParams != null && searchParams.get('draft') != null
  const _tool = !isDraftVersion
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useToolVersion({ persistentId, versionId }, undefined, {
        enabled: router.isReady,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useTool({ persistentId, draft: true }, undefined, {
        enabled: router.isReady,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      })
  const tool = _tool.data

  const category = tool?.category ?? 'tool-or-service'
  const label = t(`common.item-categories.${category}.one`)
  const title = t('authenticated.forms.edit-item', { item: label })

  const formFields = useToolFormFields()
  const validate = useToolValidationSchema()
  const meta = useUpdateItemMeta({ category })
  const createOrUpdateToolOrService = useCreateOrUpdateTool(undefined, { meta })

  function onSubmit(
    values: UpdateToolOrServiceFormValues,
    form: FormApi<UpdateToolOrServiceFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    delete values['__submitting__']

    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    createOrUpdateToolOrService.mutate(
      { data: values, draft: shouldSaveAsDraft },
      {
        onSuccess(tool) {
          if (tool.status === 'draft') {
            // FIXME: Probably better to keep this state in useCreateOrUpdateToolOrService.
            form.batch(() => {
              form.change('persistentId', tool.persistentId)
              form.change('status', tool.status)
            })
            window.scrollTo(0, 0)
          } else if (tool.status === 'approved') {
            router.push(`/tool-or-service/${tool.persistentId}`)
          } else {
            router.push(`/success`)
          }
          done?.()
        },
        onError(error) {
          done?.({ [FORM_ERROR]: String(error) })
        },
      },
    )
  }

  function onCancel() {
    router.push(`/account`)
  }

  if (router.isFallback || tool == null) {
    return (
      <Fragment>
        <PageMetadata title={title} openGraph={{}} twitter={{}} />
        <PageMainContent>
          <FullPage>
            <Centered>
              <ProgressSpinner />
            </Centered>
          </FullPage>
        </PageMainContent>
      </Fragment>
    )
  }

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
            <ItemForm<UpdateToolOrServiceFormValues>
              formFields={formFields}
              name="update-item-version"
              initialValues={tool}
              onCancel={onCancel}
              onSubmit={onSubmit}
              validate={validate}
            />
          </Content>
          <FundingNotice />
        </ItemFormScreenLayout>
      </PageMainContent>
    </Fragment>
  )
}

const Page: PageComponent<EditToolOrServiceVersionPage.Props> = EditToolOrServiceVersionPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
