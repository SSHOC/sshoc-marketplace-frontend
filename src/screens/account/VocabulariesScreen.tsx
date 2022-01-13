import cx from 'clsx'
import { Fragment } from 'react'
import { useQueryClient } from 'react-query'

import type { SearchConcept } from '@/api/sshoc'
import {
  useCommitConcept,
  useDeleteConcept,
  useSearchConcepts,
} from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import { useToast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { Title } from '@/modules/ui/typography/Title'
import styles from '@/screens/account/VocabulariesScreen.module.css'

/**
 * Vocabularies screen.
 */
export default function VocabulariesScreen(): JSX.Element {
  const auth = useAuth()
  const handleErrors = useErrorHandlers()
  const toast = useToast()

  const query = {}

  const concepts = useSearchConcepts(
    // @ts-expect-error Facet exists.
    { 'f.candidate': true },
    {
      enabled: auth.session?.accessToken != null,
      keepPreviousData: true,
      onError(error) {
        toast.error('Failed to fetch candidate concepts.')

        if (error instanceof Error) {
          handleErrors(error)
        }
      },
    },
    {
      token: auth.session?.accessToken,
    },
  )

  return (
    <Fragment>
      <Metadata noindex title="Vocabularies" />
      <GridLayout className={styles.layout}>
        <Header
          image={'/assets/images/search/clouds@2x.png'}
          showSearchBar={false}
        >
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              { pathname: '/account', label: 'My account' },
              {
                pathname: '/account/vocabularies',
                label: 'Vocabularies',
              },
            ]}
          />
        </Header>
        <ContentColumn className={cx('px-6 py-12 space-y-12', styles.content)}>
          <div className="flex justify-between">
            <Title>
              Candidate concepts
              {concepts.data != null ? (
                <span className="text-xl font-normal">
                  {' '}
                  ({concepts.data.hits})
                </span>
              ) : null}
            </Title>
          </div>
          {concepts.data === undefined ? (
            <ProgressSpinner />
          ) : (
            <Fragment>
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <ItemSortOrder filter={query} />
                  <ItemSearch filter={query} />
                </div>
                <ItemPagination filter={query} results={sources.data} />
              </div> */}
              {concepts.data.concepts?.length === 0 ? (
                <div>No candidate concepts found.</div>
              ) : (
                <ul className="space-y-2.5">
                  {concepts.data.concepts?.map((concept) => {
                    return (
                      <li key={concept.code}>
                        <Concept concept={concept} />
                      </li>
                    )
                  })}
                </ul>
              )}
              {/* <div className="flex justify-end">
                <ItemLongPagination filter={query} results={sources.data} />
              </div> */}
            </Fragment>
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}

interface ConceptProps {
  concept: SearchConcept
}

function Concept(props: ConceptProps) {
  const { concept } = props

  const auth = useAuth()
  const toast = useToast()
  const approve = useCommitConcept()
  const reject = useDeleteConcept()
  const queryClient = useQueryClient()

  function onApprove() {
    approve.mutate(
      [
        { code: concept.code!, 'vocabulary-code': concept.vocabulary!.code! },
        {
          token: auth.session?.accessToken,
        },
      ],
      {
        onError() {
          toast.error('Failed to approve concept.')
        },
        onSuccess() {
          toast.success('Successfully approved concept.')
          queryClient.invalidateQueries(['searchConcepts'])
        },
      },
    )
  }

  function onReject() {
    reject.mutate(
      [
        { code: concept.code!, 'vocabulary-code': concept.vocabulary!.code! },
        {},
        {
          token: auth.session?.accessToken,
          hooks: {
            response() {
              return Promise.resolve()
            },
          },
        },
      ],
      {
        onError() {
          toast.error('Failed to reject concept.')
        },
        onSuccess() {
          toast.success('Successfully rejected concept.')
          queryClient.invalidateQueries(['searchConcepts'])
        },
      },
    )
  }

  return (
    <div className="p-4 space-y-4 text-xs border border-gray-200 rounded bg-gray-75">
      <div className="flex items-center justify-between space-x-2">
        <h2>
          <span className="text-base font-bold text-gray-600">
            {concept.label}
          </span>
        </h2>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-x-1.5">
          <span className="text-gray-550">Vocabulary: </span>
          <span>
            {concept.vocabulary?.code}{' '}
            {/* We don't get the vocabulary label. */}
            <span>({concept.types?.map((type) => type.code).join(', ')})</span>
          </span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onApprove}
            className="cursor-default flex space-x-1.5 text-primary-750 hover:text-secondary-600 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="cursor-default flex space-x-1.5 text-primary-750 hover:text-secondary-600 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
