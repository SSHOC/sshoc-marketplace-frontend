import type { FormApi } from 'final-form'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'
import { useForm } from 'react-final-form'

import type { WorkflowFormPage } from '@/components/item-form/useWorkflowFormPage'
import type { WorkflowFormValues } from '@/components/item-form/WorkflowForm'
import css from '@/components/item-form/WorkflowFormNavigation.module.css'
import { FormButtonLink } from '@/lib/core/form/FormButtonLink'

export interface WorkflowFormNavigationProps {
  onBeforeSubmit?: (form: FormApi<WorkflowFormValues>) => void
  page: WorkflowFormPage
  setPage: (page: WorkflowFormPage) => void
}

export function WorkflowFormNavigation(props: WorkflowFormNavigationProps): JSX.Element {
  const { page, setPage } = props

  const t = useTranslations()
  const form = useForm<WorkflowFormValues>()

  if (page.type === 'step') {
    return <Fragment />
  }

  function onBeforeSubmit() {
    props.onBeforeSubmit?.(form)
  }

  function onNavigateBackToWorkflow() {
    setPage({ type: 'workflow' })
  }

  return (
    <nav
      aria-label={t('authenticated.forms.workflow-form-page-navigation')}
      className={css['container']}
    >
      <FormButtonLink isDisabled={page.type === 'workflow'} onPress={onNavigateBackToWorkflow}>
        <div className={css['link']}>
          <span aria-hidden className={css['circle']}>
            1
          </span>
          {t('common.item-categories.workflow.one')}
        </div>
      </FormButtonLink>
      <FormButtonLink isDisabled={page.type === 'steps'} onPress={onBeforeSubmit} type="submit">
        <div className={css['link']}>
          <span aria-hidden className={css['circle']}>
            2
          </span>
          {t('common.item-categories.step.other')}
        </div>
      </FormButtonLink>
    </nav>
  )
}
