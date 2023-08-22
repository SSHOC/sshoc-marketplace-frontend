import type { ItemCategoryWithWorkflowStep, ItemStatus } from '@/data/sshoc/api/item'
import type { Plurals } from '@/dictionaries'

export interface Dictionary {
  'skip-to-main-content': string
  'page-loading-indicator': string
  'default-spinner-message': string
  'default-error-message': string
  'default-query-error-message': string
  'default-mutation-error-message': string
  'default-mutation-pending-message': string
  'default-mutation-success-message': string
  'default-authorization-error-message': string
  'token-expiration-warning': string
  'page-not-found-error-message': string
  'internal-server-error-message': string
  'go-to-main-page': string
  'navigation-menu': string
  open: string
  close: string
  breadcrumbs: string
  'report-issue': string
  'report-issue-message': string
  'funding-notice': string
  'eu-flag': string
  cessda: string
  clarin: string
  'dariah-eu': string
  'footer-navigation': string
  'create-new-items': string
  'create-new-item': string
  'item-categories': Record<ItemCategoryWithWorkflowStep, Plurals>
  'read-more': string
  'read-more-about-item': string
  'see-all': string
  'see-all-facets': string
  'see-more': string
  'select-file': string
  'table-of-contents': string
  ui: {
    clear: string
    select: {
      placeholder: string
    }
    autocomplete: {
      loading: string
      'no-results': string
    }
    combobox: {
      loading: string
      'no-results': string
    }
    listbox: {
      loading: string
      'loading-more': string
    }
    label: {
      '(optional)': string
      '(required)': string
    }
  }
  pages: {
    home: string
    search: string
    browse: string
    about: string
    contribute: string
    'privacy-policy': string
    contact: string
    'page-not-found': string
    'internal-server-error': string
    'sign-in': string
    'sign-up': string
    success: string
    'terms-of-use': string
    /** Duplicated in `authenticated` dictionary. */
    account: string
  }
  facets: {
    'item-category': Plurals
    activity: Plurals
    keyword: Plurals
    source: Plurals
    language: Plurals
  }
  form: {
    'add-record': string
    'edit-record': string
    'remove-record': string
  }
  auth: {
    'sign-in': string
    'sign-out': string
    'my-account': string
    'account-menu': string
    'account-menu-message': string
    username: string
    password: string
    displayName: string
    email: string
    'accept-terms-of-service': string
    'sign-in-submit': string
    'signing-in': string
    'sign-in-success': string
    'sign-in-error': string
    'sign-up-submit': string
    'signing-up': string
    'sign-up-success': string
    'sign-up-error': string
    validation: {
      'empty-username': string
      'empty-password': string
      'empty-display-name': string
      'empty-email': string
      'invalid-email': string
      'not-accepted-terms-of-service': string
    }
    'sign-in-message-oauth': string
    'sign-in-message-basic-auth': string
    'sign-in-helptext': string
    'sign-in-alternative': string
    'sign-up-message-oauth': string
    'sign-up-helptext': string
  }
  home: {
    title: string
    'lead-in': string
    'read-more-about-sshocmp': string
    search: {
      'search-items': string
      'item-category': string
      'all-item-categories': string
      'item-search-term': string
      submit: string
    }
    browse: string
    'browse-by-category': string
    'browse-by-facet': string
    recommended: string
    'last-updated': string
    'see-what-is-new': string
  }
  search: {
    'search-items': string
    'search-results': string
    'submit-search-term': string
    'refine-search': string
    'show-more': string
    'show-less': string
    'search-filters': string
    'clear-filters': string
    'sort-order': string
    'sort-by': string
    'sort-orders': {
      score: string
      'modified-on': string
      label: string
    }
    'copy-to-clipboard': string
    'no-results': string
    'nothing-found-message': string
    'remove-filter-value': string
    'open-search-dialog': string
    'close-search-dialog': string
  }
  pagination: {
    navigation: string
    'previous-page': string
    'next-page': string
    'go-to-page': string
    'of-pages': string
    'go-to-page-of-pages': string
  }
  contact: {
    email: string
    subject: string
    message: string
    submit: string
    'form-submission-pending': string
    'form-submission-error': string
    'form-submission-success': string
    validation: {
      'invalid-email': string
      'empty-subject': string
      'empty-message': string
    }
  }
  browse: {
    'browse-facet': string
    'values-by-character': string
  }
  item: {
    'item-category': Plurals
    status: string
    details: string
    'accessible-at': string
    'last-info-update': string
    'last-updated-on': string
    properties: Plurals
    actors: Plurals
    source: Plurals
    'external-ids': Plurals
    'content-contributors': Plurals
    'date-created': string
    'date-last-modified': string
    media: Plurals
    'related-items': Plurals
    'go-to-item': string
    'previous-media': string
    'next-media': string
    'go-to-media': string
    'download-media': string
    'show-more': string
    'show-more-related-items': string
    'embedded-content': string
    'collapse-workflow-step': string
    'expand-workflow-step': string
    comments: Plurals
    users: Plurals
  }
  'item-status': Record<ItemStatus, string>
  success: {
    title: string
    message: string
    'back-home': string
  }
  controls: {
    history: string
    edit: string
    'edit-version': string
    'edit-latest-draft': string
    'edit-latest-suggestion': string
    delete: string
    'delete-item-pending': string
    'delete-item-success': string
    'delete-item-error': string
    'delete-item-version-pending': string
    'delete-item-version-success': string
    'delete-item-version-error': string
  }
}
