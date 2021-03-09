import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure'
import { JsonLd } from '@stefanprobst/next-page-metadata'
import cx from 'clsx'
import dynamic from 'next/dynamic'
import { Fragment, useState } from 'react'
import type { DeepRequired } from 'utility-types'

import type { WorkflowDto } from '@/api/sshoc'
import { useGetWorkflow } from '@/api/sshoc'
import ItemMetadata from '@/modules/item/ItemMetadata'
import RelatedItems from '@/modules/item/RelatedItems'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Triangle from '@/modules/ui/Triangle'
import { SectionTitle } from '@/modules/ui/typography/SectionTitle'
import type { PageProps } from '@/pages/workflow/[id]/index'
import ItemLayout from '@/screens/item/ItemLayout'

const Markdown = dynamic(() => import('@/modules/markdown/Markdown'))

/**
 * Workflow screen.
 */
export default function WorkflowScreen({
  workflow: initialData,
}: PageProps): JSX.Element {
  /**
   * populate client cache with data from getServerSideProps,
   * to allow background refreshing
   */
  const { data } = useGetWorkflow(
    { workflowId: initialData.persistentId! },
    {},
    { enabled: initialData.persistentId !== undefined, initialData },
  )
  /** backend does not specify required fields. should be safe here */
  const workflow = (data ?? initialData) as DeepRequired<WorkflowDto>

  return (
    <Fragment>
      {workflow !== undefined ? (
        <JsonLd
          schema={{
            '@type': 'HowTo',
            headline: workflow.label,
            name: workflow.label,
            abstract: workflow.description,
            description: workflow.description,
            url: workflow.accessibleAt,
            about: workflow.properties
              .filter((property) => property.type.code === 'keyword')
              .map((property) => property.value),
            license: workflow.licenses.map((license) => license.label),
            version: workflow.version,
            contributor: workflow.contributors.map(
              (contributor) => contributor.actor.name,
            ),
            inLanguage: workflow.properties
              .filter((property) => property.type.code === 'language')
              .map((property) => property.concept.label),
            // step => composedOf
          }}
        />
      ) : null}
      <ItemLayout item={workflow}>
        <Steps steps={workflow.composedOf} />
      </ItemLayout>
    </Fragment>
  )
}

type Steps = WorkflowDto['composedOf']
type Step = Exclude<Steps, undefined>[number]

function Steps({ steps }: { steps: Steps }) {
  if (steps === undefined) return null
  /** undocumented in openapi doc */
  if (steps === null) return null
  if (steps.length === 0) return null
  return (
    <div
      className="grid mb-6"
      style={{
        gridColumn: '1 / span 9',
        /** "sub-grid" */
        gridTemplateColumns:
          'calc(50vw - (var(--screen-3xl) / 2)) repeat(8, minmax(0, calc(var(--screen, var(--screen-3xl)) / 12)))',
      }}
    >
      <HStack
        className="items-baseline p-6 space-x-2"
        style={{ gridColumn: '3 / span 7' }}
      >
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
  const [isOpen, setOpen] = useState(false)

  function toggleOpen() {
    setOpen((prev) => !prev)
  }

  return (
    <Disclosure defaultOpen={false}>
      <b style={{ gridColumn: '1 / span 2' }} className="bg-gray-100" />
      <HStack
        as="header"
        className="items-center justify-between p-6 bg-gray-100"
        style={{ gridColumn: '3 / span 7' }}
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
        >
          <span className="px-4">{isOpen ? 'Collapse' : 'Expand'}</span>{' '}
          <span className={isOpen ? 'transform rotate-180' : ''}>
            <Triangle />
          </span>
        </DisclosureButton>
      </HStack>

      <b style={{ gridColumn: '1 / span 2' }} className="bg-gray-50" />
      <DisclosurePanel
        style={{ gridColumn: '3 / span 7' }}
        className="px-6 py-12 space-y-4 bg-gray-50"
      >
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

  // TODO: relations to steps
  const relatedItems = items.filter((item) => item.category !== 'step')
  if (relatedItems.length === 0) return null

  return (
    <VStack>
      <h4 className="sr-only">Resources</h4>
      <RelatedItems items={relatedItems} />
    </VStack>
  )
}
