import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { MetadataLabel } from '@/components/common/MetadataLabel'
import { MetadataValue } from '@/components/common/MetadataValue'
import { MetadataValues } from '@/components/common/MetadataValues'
import { SearchResult } from '@/components/common/SearchResult'
import { SearchResultContent } from '@/components/common/SearchResultContent'
import { SearchResultControls } from '@/components/common/SearchResultControls'
import { SearchResultMeta } from '@/components/common/SearchResultMeta'
import { SearchResultTitle } from '@/components/common/SearchResultTitle'
import type { SearchConcepts } from '@/data/sshoc/api/vocabulary'
import {
  useApproveSuggestedConcept,
  useRejectSuggestedConcept,
} from '@/data/sshoc/hooks/vocabulary'
import type { MutationMetadata } from '@/lib/core/query/types'
import { ButtonLink } from '@/lib/core/ui/Button/ButtonLink'

export interface VocabularySearchResultProps {
  concept: SearchConcepts.Response['concepts'][number]
}

export function VocabularySearchResult(props: VocabularySearchResultProps): JSX.Element {
  const { concept } = props

  const t = useTranslations('authenticated')

  const rejectConceptMeta: MutationMetadata = {
    messages: {
      mutate() {
        return t('concepts.reject-candidate-concept-pending')
      },
      success() {
        return t('concepts.reject-candidate-concept-success')
      },
      error() {
        return t('concepts.reject-candidate-concept-error')
      },
    },
  }
  const rejectConcept = useRejectSuggestedConcept(
    { code: concept.code, vocabularyCode: concept.vocabulary.code },
    undefined,
    { meta: rejectConceptMeta },
  )

  const approveConceptMeta: MutationMetadata = {
    messages: {
      mutate() {
        return t('concepts.approve-candidate-concept-pending')
      },
      success() {
        return t('concepts.approve-candidate-concept-success')
      },
      error() {
        return t('concepts.approve-candidate-concept-error')
      },
    },
  }
  const approveConcept = useApproveSuggestedConcept(
    { code: concept.code, vocabularyCode: concept.vocabulary.code },
    undefined,
    { meta: approveConceptMeta },
  )

  function onReject() {
    rejectConcept.mutate({})
  }

  function onApprove() {
    approveConcept.mutate({})
  }

  const isCandidateConcept = concept.candidate === true

  return (
    <Fragment>
      <SearchResult>
        <SearchResultTitle>{concept.label}</SearchResultTitle>
        <SearchResultMeta>
          {isCandidateConcept ? (
            <MetadataValue size="sm">
              <MetadataLabel size="sm">{t('concepts.status')}:</MetadataLabel>
              {t('concepts.concept-status.candidate')}
            </MetadataValue>
          ) : null}
        </SearchResultMeta>
        <SearchResultContent>
          <MetadataValues>
            <MetadataValue>
              <MetadataLabel>{t('concepts.concept-vocabulary.one')}:</MetadataLabel>
              {concept.vocabulary.code}
            </MetadataValue>
            <MetadataValue>
              <MetadataLabel>{t('concepts.property-type.other')}:</MetadataLabel>
              {concept.types
                .map((type) => {
                  return type.code
                })
                // TODO: Intl.ListFormat, once support is better.
                .join(', ')}
            </MetadataValue>
          </MetadataValues>
        </SearchResultContent>
        <SearchResultControls>
          {isCandidateConcept ? (
            <Fragment>
              <ButtonLink
                aria-label={t('concepts.reject-candidate-concept', {
                  label: concept.label,
                })}
                onPress={onReject}
              >
                {t('controls.reject')}
              </ButtonLink>
              <ButtonLink
                aria-label={t('concepts.approve-candidate-concept', {
                  label: concept.label,
                })}
                onPress={onApprove}
              >
                {t('controls.approve')}
              </ButtonLink>
            </Fragment>
          ) : null}
        </SearchResultControls>
      </SearchResult>
    </Fragment>
  )
}
