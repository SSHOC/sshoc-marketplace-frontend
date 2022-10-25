import type { Status as DiffStatus } from '@/components/item-form/useItemDiffFormFieldsMetadata'
import type { ConceptStatus } from '@/data/sshoc/utils/concept'
import type { CurationFlag } from '@/data/sshoc/utils/curation'

import type { Plurals } from '..'

interface Description {
  description: string
}

interface Field extends Description {
  label: string
}

interface PluralField extends Description {
  label: Plurals
}

export interface Dictionary {
  pages: {
    /** Duplicated from `common` dictionary. */
    account: string
    'contributed-items': string
    'draft-items': string
    'moderate-items': string
    actors: string
    vocabularies: string
    sources: string
    users: string
    'item-version-history': string
  }
  'item-history': {
    'item-history': string
    'revert-to-version-pending': string
    'revert-to-version-success': string
    'revert-to-version-error': string
  }
  forms: {
    'create-item': string
    'create-item-pending': string
    'create-item-success': string
    'create-item-error': string
    'create-item-draft-pending': string
    'create-item-draft-success': string
    'create-item-draft-error': string
    'create-item-suggestion-pending': string
    'create-item-suggestion-success': string
    'create-item-suggestion-error': string
    'edit-item': string
    'update-item-pending': string
    'update-item-success': string
    'update-item-error': string
    'update-item-draft-pending': string
    'update-item-draft-success': string
    'update-item-draft-error': string
    'update-item-suggestion-pending': string
    'update-item-suggestion-success': string
    'update-item-suggestion-error': string
    'approve-item-pending': string
    'approve-item-success': string
    'approve-item-error': string
    'reject-item-pending': string
    'reject-item-success': string
    'reject-item-error': string
    add: string
    remove: string
    cancel: string
    'save-as-draft': string
    submit: string
    publish: string
    'add-field': string
    'remove-field': string
    'edit-field': string
    'main-section': string
    'date-section': string
    'actors-section': string
    'properties-section': string
    'media-section': string
    'thumbnail-section': string
    'related-items-section': string
    'other-suggested-versions-section': string
    'add-workflow-step': string
    'edit-workflow-step': string
    'remove-workflow-step': string
    'workflow-form-page-navigation': string
  }
  fields: {
    label: Field
    description: Field
    version: Field
    accessibleAt: PluralField
    externalIds: PluralField
    'externalIds.identifier': Field
    'externalIds.identifierService': Field
    dateCreated: Field
    dateLastUpdated: Field
    contributors: PluralField
    'contributors.role': Field
    'contributors.actor': Field
    properties: PluralField
    'properties.type': Field
    'properties.value': Field
    'properties.concept': Field
    relatedItems: PluralField
    'relatedItems.relation': Field
    'relatedItems.item': Field
    media: PluralField
    'media.info': Field
    'media.caption': Field
    'media.licence': Field
    thumbnail: Field
    'thumbnail.info': Field
    'thumbnail.caption': Field
    'thumbnail.licence': Field
  }
  properties: {
    'access-policy-url': Description
    activity: Description
    authentication: Description
    conference: Description
    // 'conflict-at-source': Description
    // 'curation-detail': Description
    // 'curation-flag-coverage': Description
    // 'curation-flag-description': Description
    // 'curation-flag-merged': Description
    // 'curation-flag-relations': Description
    // 'curation-flag-url': Description
    // 'deprecated-at-source': Description
    discipline: Description
    extent: Description
    'geographical-availability': Description
    'helpdesk-url': Description
    'intended-audience': Description
    issue: Description
    journal: Description
    keyword: Description
    language: Description
    license: Description
    'life-cycle-status': Description
    'mode-of-use': Description
    // 'model-version': Description
    'object-format': Description
    pages: Description
    'privacy-policy-url': Description
    // 'processed-at': Description
    'publication-type': Description
    'publication-place': Description
    publisher: Description
    'resource-category': Description
    'see-also': Description
    'service-level-url': Description
    // 'service-type': Description
    // 'source-last-update': Description
    standard: Description
    'technical-readiness-level': Description
    'terms-of-use': Description
    'terms-of-use-url': Description
    'tool-family': Description
    'user-manual-url': Description
    version: Description
    volume: Description
    year: Description
  }
  validation: {
    'empty-field': string
    'invalid-email': string
    'invalid-url': string
    'invalid-value-type': string
    'data-types': {
      boolean: string
      date: string
      float: string
      int: string
      string: string
      url: string
    }
    'last-submission-failed': string
  }
  controls: {
    add: string
    edit: string
    delete: string
    remove: string
    cancel: string
    submit: string
    publish: string
    'save-as-draft': string
    approve: string
    reject: string
    review: string
    revert: string
    next: string
    save: string
    'move-up': string
    'move-down': string
  }
  actors: {
    'create-actor': string
    'edit-actor': string
    'delete-actor': string
    'delete-actor-pending': string
    'delete-actor-success': string
    'delete-actor-error': string
    'update-actor-pending': string
    'update-actor-success': string
    'update-actor-error': string
    'create-actor-pending': string
    'create-actor-success': string
    'create-actor-error': string
    'edit-actor-dialog-title': string
    'search-actors': string
    name: Field
    externalIds: Field
    'externalIds.identifier': Field
    'externalIds.identifierService': Field
    email: Field
    website: Field
    affiliations: Field
    'affiliations.actor': Field
  }
  sources: {
    'sort-by': string
    'sort-orders': {
      name: string
      date: string
    }
    'sort-order': string
    'create-source': string
    'edit-source': string
    'delete-source': string
    'delete-source-pending': string
    'delete-source-success': string
    'delete-source-error': string
    'update-source-pending': string
    'update-source-success': string
    'update-source-error': string
    'create-source-pending': string
    'create-source-success': string
    'create-source-error': string
    'edit-source-dialog-title': string
    'search-sources': string
    'source-url': string
    'last-harvest-date': string
    label: Field
    url: Field
    urlTemplate: Field
  }
  users: {
    'sort-by': string
    'sort-orders': {
      username: string
      date: string
    }
    'sort-order': string
    email: string
    'registration-date': string
    status: string
    role: string
    'update-user-role-pending': string
    'update-user-role-success': string
    'update-user-role-error': string
    'update-user-status-pending': string
    'update-user-status-success': string
    'update-user-status-error': string
  }
  'draft-items': {
    'sort-by': string
    'sort-orders': {
      'modified-on': string
      label: string
    }
    'sort-order': string
    'last-updated': string
    'edit-item': string
    'delete-item': string
    'delete-draft-item-pending': string
    'delete-draft-item-success': string
    'delete-draft-item-error': string
  }
  'contributed-items': {
    'last-updated': string
    'edit-item': string
  }
  'moderate-items': {
    'last-updated': string
    owner: string
    'edit-item': string
    'review-item': string
    curation: string
    'curation-flag': Plurals
    'information-contributor': Plurals
    'other-facets': string
    'deprecated-at-source': string
  }
  'curation-flags': Record<CurationFlag, string>
  concepts: {
    'search-concepts': string
    'concept-vocabulary': Plurals
    'property-type': Plurals
    status: string
    'candidate-status': string
    'concept-status': Record<ConceptStatus, string>
    'reject-candidate-concept': string
    'reject-candidate-concept-pending': string
    'reject-candidate-concept-success': string
    'reject-candidate-concept-error': string
    'approve-candidate-concept': string
    'approve-candidate-concept-pending': string
    'approve-candidate-concept-success': string
    'approve-candidate-concept-error': string
    'suggest-concept': string
    'suggest-concept-pending': string
    'suggest-concept-success': string
    'suggest-concept-error': string
    vocabulary: Field
    label: Field
    notation: Field
    definition: Field
  }
  media: {
    'upload-media': string
    'upload-media-dialog-title': string
    'upload-media-pending': string
    'upload-media-success': string
    'upload-media-error': string
    file: Field
    sourceUrl: Field
    caption: Field
    licence: Field
    validation: {
      'empty-file-and-url': string
      'file-or-url': string
    }
  }
  itemExternalId: {
    description: string
  }
  actorExternalId: {
    description: string
  }
  'other-suggested-versions': {
    message: Plurals
    warning: string
    'suggested-by': string
  }
  review: {
    '(current)': string
    '(suggested)': string
    status: Record<DiffStatus, string>
  }
  'item-status-alert': string
}
