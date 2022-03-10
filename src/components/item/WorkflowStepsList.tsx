import { useButton } from '@react-aria/button'
import { Fragment, useRef } from 'react'

import { ItemPreviewMetadata } from '@/components/common/ItemPreviewMetadata'
import { ItemsCount } from '@/components/common/ItemsCount'
import { SectionHeader } from '@/components/common/SectionHeader'
import { SectionTitle } from '@/components/common/SectionTitle'
import { ItemDescription } from '@/components/item/ItemDescription'
import { ItemRelatedItems } from '@/components/item/ItemRelatedItems'
import css from '@/components/item/WorkflowStepsList.module.css'
import type { Workflow } from '@/data/sshoc/api/workflow'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { useDisclosure } from '@/lib/core/ui/hooks/useDisclosure'
import { useDisclosureState } from '@/lib/core/ui/hooks/useDisclosureState'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import TriangleIcon from '@/lib/core/ui/icons/triangle.svg?symbol-icon'

export interface WorkflowStepsListProps {
  steps: Workflow['composedOf']
}

export function WorkflowStepsList(props: WorkflowStepsListProps): JSX.Element {
  const { steps } = props

  const { t } = useI18n<'common'>()

  const category = 'step'

  if (steps.length === 0) {
    return <Fragment />
  }

  return (
    <section className={css['container']}>
      <SectionHeader>
        <SectionTitle>
          {t(['common', 'item-categories', category, 'other'])}
          <ItemsCount count={steps.length} />
        </SectionTitle>
      </SectionHeader>
      <ol role="list" className={css['list']}>
        {steps.map((step, index) => {
          return (
            <li key={step.persistentId}>
              <WorkflowStep index={index} step={step} />
            </li>
          )
        })}
      </ol>
    </section>
  )
}

interface WorkflowStepProps {
  index: number
  step: Workflow['composedOf'][number]
}

function WorkflowStep(props: WorkflowStepProps): JSX.Element {
  const { index, step } = props

  const { t } = useI18n<'common'>()

  // TODO: Convert to Accordion, once https://github.com/adobe/react-spectrum/issues/1989 is resolved.
  const state = useDisclosureState({})
  const { contentProps, triggerProps } = useDisclosure(state)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(
    {
      ...(triggerProps as any),
      onPress() {
        state.toggle()
      },
    },
    buttonRef,
  )

  return (
    <article className={css['item']}>
      <header className={css['item-header']}>
        <h3 className={css['item-title']}>
          <span className={css['item-index']}>{index + 1}</span> {step.label}
        </h3>
        <button
          {...buttonProps}
          className={css['accordion-button']}
          data-state={state.isOpen ? 'expanded' : 'collapsed'}
          ref={buttonRef}
        >
          {t(['common', 'item', state.isOpen ? 'collapse-workflow-step' : 'expand-workflow-step'])}
          <Icon icon={TriangleIcon} />
        </button>
      </header>
      {state.isOpen ? (
        <div {...contentProps} className={css['item-content']}>
          <ItemPreviewMetadata item={step} />
          <ItemDescription description={step.description} />
          <ItemRelatedItems items={step.relatedItems} headingLevel={4} />
        </div>
      ) : null}
    </article>
  )
}
