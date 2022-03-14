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
import { useCreateOrUpdateTrainingMaterial } from '@/components/item-form/useCreateOrUpdateTrainingMaterial'
import { useTrainingMaterialFormFields } from '@/components/item-form/useTrainingMaterialFormFields'
import { useTrainingMaterialFormRecommendedFields } from '@/components/item-form/useTrainingMaterialFormRecommendedFields'
import { useTrainingMaterialValidationSchema } from '@/components/item-form/useTrainingMaterialValidationSchema'
import type { TrainingMaterialInput } from '@/data/sshoc/api/training-material'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { PageMainContent } from '@/lib/core/page/PageMainContent'

export type CreateTrainingMaterialFormValues = ItemFormValues<TrainingMaterialInput>

export namespace CreateTrainingMaterialPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export type Props = WithDictionaries<'authenticated' | 'common'>
}

export async function getStaticProps(
  context: GetStaticPropsContext<CreateTrainingMaterialPage.PathParams>,
): Promise<GetStaticPropsResult<CreateTrainingMaterialPage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
    },
  }
}

export default function CreateTrainingMaterialPage(
  _props: CreateTrainingMaterialPage.Props,
): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()
  const router = useRouter()

  const category = 'training-material'
  const label = t(['common', 'item-categories', category, 'one'])
  const title = t(['authenticated', 'forms', 'create-item'], { values: { item: label } })

  const formFields = useTrainingMaterialFormFields()
  const recommendedFields = useTrainingMaterialFormRecommendedFields()
  const validate = useTrainingMaterialValidationSchema(removeEmptyItemFieldsOnSubmit)
  const meta = useCreateItemMeta({ category })
  const createOrUpdateTrainingMaterial = useCreateOrUpdateTrainingMaterial(undefined, { meta })

  function onSubmit(
    values: CreateTrainingMaterialFormValues,
    form: FormApi<CreateTrainingMaterialFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    const data = removeEmptyItemFieldsOnSubmit(values)
    delete values['__submitting__']

    createOrUpdateTrainingMaterial.mutate(
      { data, draft: shouldSaveAsDraft },
      {
        onSuccess(trainingMaterial) {
          if (trainingMaterial.status === 'draft') {
            // FIXME: Probably better to keep this state in useCreateOrUpdateTrainingMaterial.
            form.batch(() => {
              form.change('persistentId', trainingMaterial.persistentId)
              form.change('status', trainingMaterial.status)
            })
            window.scrollTo(0, 0)
          } else if (trainingMaterial.status === 'approved') {
            router.push(
              routes.TrainingMaterialPage({ persistentId: trainingMaterial.persistentId }),
            )
          } else {
            router.push(routes.SuccessPage())
          }
          done?.()
        },
        onError(error) {
          done?.({ [FORM_ERROR]: error })
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
            <ItemForm<CreateTrainingMaterialFormValues>
              formFields={formFields}
              initialValues={recommendedFields}
              name="create-item"
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

const Page: PageComponent<CreateTrainingMaterialPage.Props> = CreateTrainingMaterialPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
