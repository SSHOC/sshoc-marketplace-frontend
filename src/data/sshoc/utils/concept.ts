import type { BooleanString } from '@/data/sshoc/lib/types'

export const conceptStatus = ['candidate', 'approved'] as const

export type ConceptStatus = (typeof conceptStatus)[number]

export function isConceptStatus(value: string): value is ConceptStatus {
  return conceptStatus.includes(value as ConceptStatus)
}

export function mapConceptStatusToFacet(status: ConceptStatus): BooleanString {
  switch (status) {
    case 'approved':
      return 'false'
    case 'candidate':
      return 'true'
  }
}
