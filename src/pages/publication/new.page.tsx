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
import { useCreateOrUpdatePublication } from '@/components/item-form/useCreateOrUpdatePublication'
import { usePublicationFormFields } from '@/components/item-form/usePublicationFormFields'
import { usePublicationFormRecommendedFields } from '@/components/item-form/usePublicationFormRecommendedFields'
import { usePublicationValidationSchema } from '@/components/item-form/usePublicationValidationSchema'
import type { PublicationInput } from '@/data/sshoc/api/publication'
import type { PageComponent } from '@/lib/core/app/types'
import { getLocale } from '@/lib/core/i18n/getLocale'
import { load } from '@/lib/core/i18n/load'
import type { WithDictionaries } from '@/lib/core/i18n/types'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { PageMetadata } from '@/lib/core/metadata/PageMetadata'
import { routes } from '@/lib/core/navigation/routes'
import { PageMainContent } from '@/lib/core/page/PageMainContent'

export type CreatePublicationFormValues = ItemFormValues<PublicationInput>

export namespace CreatePublicationPage {
  export type PathParamsInput = Record<string, never>
  export type PathParams = StringParams<PathParamsInput>
  export type SearchParamsInput = Record<string, never>
  export type Props = WithDictionaries<'authenticated' | 'common'>
}

export async function getStaticProps(
  context: GetStaticPropsContext<CreatePublicationPage.PathParams>,
): Promise<GetStaticPropsResult<CreatePublicationPage.Props>> {
  const locale = getLocale(context)
  const dictionaries = await load(locale, ['common', 'authenticated'])

  return {
    props: {
      dictionaries,
    },
  }
}

export default function CreatePublicationPage(_props: CreatePublicationPage.Props): JSX.Element {
  const { t } = useI18n<'authenticated' | 'common'>()
  const router = useRouter()

  const category = 'publication'
  const label = t(['common', 'item-categories', category, 'one'])
  const title = t(['authenticated', 'forms', 'create-item'], { values: { item: label } })

  const formFields = usePublicationFormFields()
  const recommendedFields = usePublicationFormRecommendedFields()
  const validate = usePublicationValidationSchema(removeEmptyItemFieldsOnSubmit)
  const meta = useCreateItemMeta({ category })
  const createOrUpdatePublication = useCreateOrUpdatePublication(undefined, { meta })

  function onSubmit(
    values: CreatePublicationFormValues,
    form: FormApi<CreatePublicationFormValues>,
    done?: (errors?: SubmissionErrors) => void,
  ) {
    const shouldSaveAsDraft = values['__draft__'] === true
    delete values['__draft__']

    const data = removeEmptyItemFieldsOnSubmit(values)
    delete values['__submitting__']

    createOrUpdatePublication.mutate(
      { data, draft: shouldSaveAsDraft },
      {
        onSuccess(publication) {
          if (publication.status === 'draft') {
            // FIXME: Probably better to keep this state in useCreateOrUpdatePublication.
            form.batch(() => {
              form.change('persistentId', publication.persistentId)
              form.change('status', publication.status)
            })
            window.scrollTo(0, 0)
          } else if (publication.status === 'approved') {
            router.push(routes.PublicationPage({ persistentId: publication.persistentId }))
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
            <ItemForm<CreatePublicationFormValues>
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

const Page: PageComponent<CreatePublicationPage.Props> = CreatePublicationPage

Page.getLayout = undefined

Page.isPageAccessible = function isPageAccessible(user) {
  return ['administrator', 'moderator', 'contributor'].includes(user.role)
}
