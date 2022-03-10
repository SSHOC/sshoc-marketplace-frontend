import type { ParamsInput, StringParams } from '@stefanprobst/next-route-manifest'
import type { FormApi, SubmissionErrors } from 'final-form'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
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
import { useCreateOrUpdateTrainingMaterial } from '@/components/item-form/useCreateOrUpdateTrainingMaterial'
import { useTrainingMaterialFormFields } from '@/components/item-form/useTrainingMaterialFormFields'
import { useTrainingMaterialValidationSchema } from '@/components/item-form/useTrainingMaterialValidationSchema'
import { useUpdateItemMeta } from '@/components/item-form/useUpdateItemMeta'
import type { TrainingMaterial, TrainingMaterialInput } from '@/data/sshoc/api/training-material'
import { useTrainingMaterialVersion } from '@/data/sshoc/hooks/training-material'
import type { PageComponent } from '@/lib/core/app/types'
import { FORM_ERROR } from '@/lib/core/form/Form'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { getLocales } from '@/lib/core/i18n/getLocales'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { PageMainContent } from '@/lib/core/page/PageMainContent'
import { Centered } from '@/lib/core/ui/Centered/Centered'
import { FullPage } from '@/lib/core/ui/FullPage/FullPage'
import { LoadingIndicator } from '@/lib/core/ui/LoadingIndicator/LoadingIndicator'
import { ProgressSpinner } from '@/lib/core/ui/ProgressSpinner/ProgressSpinner'

export type UpdateTrainingMaterialFormValues = ItemFormValues<TrainingMaterialInput>

export namespace EditTrainingMaterialVersionPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: TrainingMaterial['persistentId']
    versionId: TrainingMaterial['id']
  }
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export interface Props extends WithDictionaries<'authenticated' | 'common'> {
    params: PathParams
  }
}

export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<EditTrainingMaterialVersionPage.PathParams>> {
  const locales = getLocales(context)
  const paths = locales.flatMap((locale) => {
    const persistentIds: Array<TrainingMaterial['persistentId']> = []
    return persistentIds.flatMap((persistentId) => {
      const versionIds: Array<TrainingMaterial['id']> = []
      return versionIds.map((versionId) => {
        const params = { persistentId, versionId: String(versionId) }
        return { locale, params }
      })
    })
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext<EditTrainingMaterialVersionPage.PathParams>,
): Promise<GetStaticPropsResult<EditTrainingMaterialVersionPage.Props>> {
  const locale = getLocale(context)
  const params = context.params as EditTrainingMaterialVersionPage.PathParams
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
      params,
    },
  }
}

export default function EditTrainingMaterialVersionPage(
  props: EditTrainingMaterialVersionPage.Props,
): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()
  const router = useRouter()

  const { persistentId, versionId: _versionId } = props.params
  const versionId = Number(_versionId)
  const _trainingMaterial = useTrainingMaterialVersion({ persistentId, versionId }, undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  const trainingMaterial = _trainingMaterial.data

  const category = trainingMaterial?.category ?? 'training-material'
  const label = t(['common', 'item-categories', category, 'one'])
  const title = t(['authenticated', 'forms', 'edit-item'], { values: { item: label } })

  const formFields = useTrainingMaterialFormFields()
  const validate = useTrainingMaterialValidationSchema()
  const meta = useUpdateItemMeta({ category })
  const createOrUpdateTrainingMaterial = useCreateOrUpdateTrainingMaterial(undefined, { meta })

  function onSubmit(
    values: UpdateTrainingMaterialFormValues,
    form: FormApi<UpdateTrainingMaterialFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    // UPSTREAM: Add `setFormData` to `final-form` to store form-wide metadata instead of passing via form values.
    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    createOrUpdateTrainingMaterial.mutate(
      { data: values, draft: shouldSaveAsDraft },
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
          done?.({ [FORM_ERROR]: String(error) })
        },
      },
    )
  }

  function onCancel() {
    router.push(routes.AccountPage())
  }

  if (router.isFallback || trainingMaterial == null) {
    return (
      <Fragment>
        <PageMetadata title={title} />
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
      <PageMetadata nofollow noindex title={title} />
      <PageMainContent>
        <ItemFormScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <Content>
            <ItemForm<UpdateTrainingMaterialFormValues>
              formFields={formFields}
              name="update-item-version"
              initialValues={trainingMaterial}
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

const Page: PageComponent<EditTrainingMaterialVersionPage.Props> = EditTrainingMaterialVersionPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
