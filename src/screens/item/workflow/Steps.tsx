import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure'
import cx from 'clsx'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import type { WorkflowDto } from '@/api/sshoc'
import { useQueryParam } from '@/lib/hooks/useQueryParam'
import ItemMetadata from '@/modules/item/ItemMetadata'
import RelatedItems from '@/modules/item/RelatedItems'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Triangle from '@/modules/ui/Triangle'
import { SectionTitle } from '@/modules/ui/typography/SectionTitle'
import styles from '@/screens/item/workflow/Steps.module.css'

const Markdown = dynamic(() => {
  return import('@/modules/markdown/Markdown')
})

type Steps = WorkflowDto['composedOf']
type Step = Exclude<Steps, undefined>[number]

export default function Steps({ steps }: { steps: Steps }): JSX.Element | null {
  if (steps === undefined) return null
  /** undocumented in openapi doc */

  if (steps === null) return null
  if (steps.length === 0) return null

  return (
    <div className={cx('mb-6', styles.layout)}>
      <HStack className={cx('items-baseline p-6 space-x-2', styles.content)}>
        <SectionTitle>Steps</SectionTitle>
        <span className="text-xl text-gray-500">({steps.length})</span>
      </HStack>
      {steps.map((step, index) => {
        return <Step key={step.id} step={step} index={index} />
      })}
    </div>
  )
}

function Step({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLButtonElement>(null)
  const stepId = useQueryParam('step', false)

  const [isOpen, setOpen] = useState(false)

  function toggleOpen() {
    setOpen((prev) => {
      return !prev
    })
  }

  /** if a step query parameter has been provided, open the disclosure in case the id matches. */
  useEffect(() => {
    if (stepId != null && step.persistentId === stepId) {
      setOpen(true)
      ref.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [step, stepId])

  return (
    <Disclosure
      open={isOpen}
      /**
       * This will apply `step-${step.persistentId}--button` as the disclosure button id,
       * and `step-${step.persistentId}--panel` as the panel id.
       */
      id={`step-${step.persistentId}`}
    >
      <b className={cx('bg-gray-100', styles.leftBleed)} />
      <HStack
        as="header"
        className={cx('items-center justify-between p-6 bg-gray-100', styles.content)}
      >
        <HStack className="items-center space-x-6">
          <span className="text-2xl font-bold">{index + 1}</span>
          <div className="self-stretch w-px bg-gray-300" />
          <span>
            <h3 className="text-lg font-bold">{step.label}</h3>
          </span>
        </HStack>
        <DisclosureButton
          className={cx(
            'w-36 inline-flex items-center justify-between px-2 py-3 rounded space-x-2 transition-colors duration-150 flex-shrink-0',
            isOpen
              ? 'text-gray-100 bg-gray-500'
              : 'text-white bg-secondary-600 hover:bg-secondary-500',
          )}
          onClick={toggleOpen}
          ref={ref}
        >
          <span className="px-4">{isOpen ? 'Collapse' : 'Expand'}</span>{' '}
          <span className={isOpen ? 'transform rotate-180' : ''}>
            <Triangle />
          </span>
        </DisclosureButton>
      </HStack>

      <b className={cx('bg-gray-50', styles.leftBleed)} />
      <DisclosurePanel className={cx('px-6 py-12 space-y-12 bg-gray-50', styles.content)}>
        <ItemMetadata item={step} />
        <div className="leading-8">
          <Markdown text={step.description} />
        </div>
        <Related items={step.relatedItems} />
      </DisclosurePanel>
    </Disclosure>
  )
}

function Related({ items }: { items?: Array<any> }) {
  if (items == null) return null

  const relatedItems = items
  if (relatedItems.length === 0) return null

  return (
    <VStack>
      <h4 className="sr-only">Resources</h4>
      <RelatedItems items={relatedItems} />
    </VStack>
  )
}
