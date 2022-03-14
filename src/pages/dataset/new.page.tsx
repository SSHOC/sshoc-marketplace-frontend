import type { StringParams } from '@stefanprobst/next-route-manifest'
import type { FormApi, SubmissionErrors } from 'final-form'
import { FORM_ERROR } from 'final-form'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { FundingNotice } from '@/components/common/FundingNotice'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ScreenTitle } from '@/components/common/ScreenTitle'
import { BackgroundImage } from '@/components/item-form/BackgroundImage'
import { Content } from '@/components/item-form/Content'
import type { ItemFormValues } from '@/components/item-form/ItemForm'
import { ItemForm } from '@/components/item-form/ItemForm'
import { ItemFormScreenLayout } from '@/components/item-form/ItemFormScreenLayout'
import { removeEmptyItemFieldsOnSubmit } from '@/components/item-form/removeEmptyItemFieldsOnSubmit'
import { useCreateItemMeta } from '@/components/item-form/useCreateItemMeta'
import { useCreateOrUpdateDataset } from '@/components/item-form/useCreateOrUpdateDataset'
import { useDatasetFormFields } from '@/components/item-form/useDatasetFormFields'
import { useDatasetFormRecommendedFields } from '@/components/item-form/useDatasetFormRecommendedFields'
import { useDatasetValidationSchema } from '@/components/item-form/useDatasetValidationSchema'
import type { DatasetInput } from '@/data/sshoc/api/dataset'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { PageMainContent } from '@/lib/core/page/PageMainContent'

export type CreateDatasetFormValues = ItemFormValues<DatasetInput>

export namespace CreateDatasetPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export type Props = WithDictionaries<'authenticated' | 'common'>
}

export async function getStaticProps(
  context: GetStaticPropsContext<CreateDatasetPage.PathParams>,
): Promise<GetStaticPropsResult<CreateDatasetPage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
    },
  }
}

export default function CreateDatasetPage(_props: CreateDatasetPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()
  const router = useRouter()

  const category = 'dataset'
  const label = t(['common', 'item-categories', category, 'one'])
  const title = t(['authenticated', 'forms', 'create-item'], { values: { item: label } })

  const formFields = useDatasetFormFields()
  const recommendedFields = useDatasetFormRecommendedFields()
  const validate = useDatasetValidationSchema(removeEmptyItemFieldsOnSubmit)
  const meta = useCreateItemMeta({ category })
  const createOrUpdateDataset = useCreateOrUpdateDataset(undefined, { meta })

  function onSubmit(
    values: CreateDatasetFormValues,
    form: FormApi<CreateDatasetFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    const data = removeEmptyItemFieldsOnSubmit(values)
    delete values['__submitting__']

    createOrUpdateDataset.mutate(
      { data, draft: shouldSaveAsDraft },
      {
        onSuccess(dataset) {
          if (dataset.status === 'draft') {
            // FIXME: Probably better to keep this state in useCreateOrUpdateDataset.
            form.batch(() => {
              form.change('persistentId', dataset.persistentId)
              form.change('status', dataset.status)
            })
            window.scrollTo(0, 0)
          } else if (dataset.status === 'approved') {
            router.push(routes.DatasetPage({ persistentId: dataset.persistentId }))
          } else {
            router.push(routes.SuccessPage())
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
    router.push(routes.AccountPage())
  }

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={title} />
      <PageMainContent>
        <ItemFormScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <Content>
            <ItemForm<CreateDatasetFormValues>
              formFields={formFields}
              name="create-item"
              initialValues={recommendedFields}
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

const Page: PageComponent<CreateDatasetPage.Props> = CreateDatasetPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
