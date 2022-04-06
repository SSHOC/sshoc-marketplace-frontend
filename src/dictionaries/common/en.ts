import type { Dictionary } from '@/dictionaries/common'

export const dictionary: Dictionary = {
  'skip-to-main-content': 'Skip to main content',
  'page-loading-indicator': 'Page loading indicator',
  'default-spinner-message': 'Loading...',
  'default-error-message': 'Something went wrong.',
  'default-query-error-message': 'Something went wrong.',
  'default-mutation-error-message': 'Something went wrong.',
  'default-mutation-pending-message': 'Submitting',
  'default-mutation-success-message': 'Successfully submitted.',
  'default-authorization-error-message': 'Sorry, you are not authorized to access this page',
  'token-expiration-warning': 'Your authentication token is about to expire at {{time}}.',
  'page-not-found-error-message': 'Page not found.',
  'internal-server-error-message': 'Internal server error.',
  'go-to-main-page': 'Go to Main page',
  'navigation-menu': 'Navigation menu',
  open: 'Open',
  close: 'Close',
  breadcrumbs: 'Breadcrumbs',
  'report-issue': 'Report an issue',
  'report-issue-message': 'I have found an issue on page {{pathname}}.\n\nPlease describe:\n\n',
  'funding-notice':
    'The SSH Open Marketplace is maintained and will be further developed by three European Research Infrastructures - DARIAH, CLARIN and CESSDA - and their national partners. It was developed as part of the "Social Sciences and Humanities Open Cloud" SSHOC project, European Union\'s Horizon 2020 project call H2020-INFRAEOSC-04-2018, grant agreement #823782.',
  'eu-flag': 'European Union flag',
  cessda: 'CESSDA',
  clarin: 'CLARIN',
  'dariah-eu': 'DARIAH-EU',
  'footer-navigation': 'Secondary navigation',
  'create-new-items': 'Create new items',
  'create-new-item': 'Create {{item}}',
  'item-categories': {
    dataset: { one: 'Dataset', other: 'Datasets' },
    publication: { one: 'Publication', other: 'Publications' },
    step: { one: 'Workflow step', other: 'Workflow steps' },
    'tool-or-service': { one: 'Tool or service', other: 'Tools & services' },
    'training-material': { one: 'Training material', other: 'Training materials' },
    workflow: { one: 'Workflow', other: 'Workflows' },
  },
  'read-more': 'Read more',
  'read-more-about-item': 'Read more about {{item}}',
  'see-all': 'See all',
  'see-all-facets': 'See all {{facet}}',
  'see-more': 'See more',
  'select-file': 'Select file',
  ui: {
    clear: 'Clear',
    select: {
      placeholder: 'Please select an option',
    },
    autocomplete: {
      loading: 'Loading...',
      'no-results': 'No results found',
    },
    combobox: {
      loading: 'Loading...',
      'no-results': 'No results found',
    },
    listbox: {
      loading: 'Loading...',
      'loading-more': 'Loading more...',
    },
    label: {
      '(optional)': '(Optional)',
      '(required)': '(Required)',
    },
  },
  pages: {
    home: 'Home',
    search: 'Search',
    browse: 'Browse',
    about: 'About',
    contribute: 'Contribute',
    'privacy-policy': 'Privacy policy',
    contact: 'Contact',
    'page-not-found': 'Page not found',
    'internal-server-error': 'Internal server error',
    'sign-in': 'Sign in',
    'sign-up': 'Sign up',
    success: 'Success',
    account: 'My account',
  },
  facets: {
    'item-category': { one: 'Category', other: 'Categories' },
    activity: { one: 'Activity', other: 'Activities' },
    keyword: { one: 'Keyword', other: 'Keywords' },
    source: { one: 'Source', other: 'Sources' },
    language: { one: 'Language', other: 'Languages' },
  },
  form: {
    'add-record': 'Add',
    'edit-record': 'Edit',
    'remove-record': 'Delete',
  },
  auth: {
    'sign-in': 'Sign in',
    'sign-out': 'Sign out',
    'my-account': 'My account',
    'account-menu': 'Account menu',
    'account-menu-message': 'Hi, {{username}}',
    username: 'Username',
    password: 'Password',
    displayName: 'Name',
    email: 'Email',
    'accept-terms-of-service':
      'I have read and understood the <PrivacyPolicyLink>Privacy policy</PrivacyPolicyLink> and I accept it.',
    'sign-in-submit': 'Sign in',
    'signing-in': 'Signing in...',
    'sign-in-success': 'You are now signed in.',
    'sign-in-error': 'Failed to sign in.',
    'sign-up-submit': 'Sign up',
    'signing-up': 'Signing in...',
    'sign-up-success': 'You are now registered.',
    'sign-up-error': 'Failed to register.',
    validation: {
      'empty-username': 'Please enter your username.',
      'empty-password': 'Please enter your password.',
      'empty-display-name': 'Please enter your name.',
      'empty-email': 'Please enter your email.',
      'invalid-email': 'Please provide a valid email address.',
      'not-accepted-terms-of-service': 'Accepting the Privacy policy is required.',
    },
    'sign-in-message-oauth':
      'Sign in with EOSC using existing accounts such as <Provider>Google</Provider>, <Provider>Dariah</Provider>, <Provider>eduTEAMS</Provider> and multiple academic accounts.',
    'sign-in-message-basic-auth':
      'Sign in with a local account is used by maintainers to manage the website.',
    'sign-in-helptext':
      'If you are having trouble with the sign in process, please <ContactLink>contact the SSH Open Marketplace team</ContactLink>.',
    'sign-in-alternative': 'or, alternatively',
    'sign-up-message-oauth':
      'Please complete the registration form to sign up to the SSH Open Marketplace.',
    'sign-up-helptext':
      'If you are having trouble with the sign up process, please <ContactLink>contact the SSH Open Marketplace team</ContactLink>.',
  },
  home: {
    title: 'Social Sciences & Humanities Open Marketplace',
    'lead-in':
      'Discover new and contextualised resources for your research in Social Sciences and Humanities: tools, services, training materials, workflows and datasets.',
    'read-more-about-sshocmp': 'Read more about the SSHOC Marketplace',
    search: {
      'search-items': 'Search items',
      'item-category': 'Category',
      'all-item-categories': 'All categories',
      'item-search-term': 'Search term',
      submit: 'Search',
    },
    browse: 'Browse',
    'browse-by-category': 'Browse by {{category}}',
    'browse-by-facet': 'Browse by {{facet}}',
    recommended: 'Recommended',
    'last-updated': 'Last updated',
    'see-what-is-new': "See what's new",
  },
  search: {
    'search-items': 'Search items',
    'search-results': 'Search results',
    'submit-search-term': 'Search',
    'refine-search': 'Refine your search',
    'show-more': 'More...',
    'show-less': 'Less...',
    'search-filters': 'Search filters',
    'clear-filters': 'Clear filters',
    'sort-order': 'Sort order',
    'sort-by': 'Sort by {{order}}',
    'sort-orders': {
      score: 'Relevance',
      'modified-on': 'Last modification',
      label: 'Name',
    },
    'copy-to-clipboard': 'Copy to clipboard',
    'no-results': 'No search results',
    'nothing-found-message': 'We could not find any results matching your search criteria.',
    'remove-filter-value': 'Remove {{value}} ({{facet}})',
    'open-search-dialog': 'Open search dialog',
    'close-search-dialog': 'Close search dialog',
  },
  pagination: {
    navigation: 'Pagination',
    'previous-page': 'Previous',
    'next-page': 'Next',
    'go-to-page': 'Go to page',
    'of-pages': 'of {{pages}}',
    'go-to-page-of-pages': 'Go to page {{page}} of {{pages}}',
  },
  contact: {
    email: 'Email address',
    subject: 'Subject',
    message: 'Message',
    submit: 'Submit',
    'form-submission-pending': 'Submitting contact form.',
    'form-submission-error': 'Failed to submit contact form.',
    'form-submission-success': 'Successfully submitted contact form.',
    validation: {
      'invalid-email': 'Please provide a valid email address.',
      'empty-subject': 'Please provide a subject.',
      'empty-message': 'What do you want to tell us?',
    },
  },
  browse: {
    'browse-facet': 'Browse {{facet}}',
    'values-by-character': 'Values starting with {{character}}',
  },
  item: {
    'item-category': { one: 'Category', other: 'Categories' },
    status: 'Status',
    details: 'Details',
    'accessible-at': 'Accessible at',
    'last-info-update': 'Last update',
    'last-updated-on': 'Last updated on {{date}}',
    properties: { one: 'Property', other: 'Properties' },
    actors: { one: 'Actor', other: 'Actors' },
    source: { one: 'Source', other: 'Sources' },
    'external-ids': { one: 'Id', other: 'Ids' },
    'content-contributors': { one: 'Information contributor', other: 'Information contributors' },
    'date-created': 'Created',
    'date-last-modified': 'Last modified',
    media: { one: 'Media', other: 'Media' },
    'related-items': { one: 'Related item', other: 'Related items' },
    'go-to-item': 'Go to {{item}}',
    'previous-media': 'Previous',
    'next-media': 'Next',
    'go-to-media': 'Go to {{media}}',
    'download-media': 'Download',
    'show-more': 'Show more',
    'show-more-related-items': 'Show more related items',
    'embedded-content': 'Embedded content',
    'collapse-workflow-step': 'Collapse',
    'expand-workflow-step': 'Expand',
    comments: { one: 'Comment', other: 'Comments' },
    users: { one: 'User', other: 'Users' },
  },
  'item-status': {
    approved: 'Approved',
    deprecated: 'Deprecated',
    disapproved: 'Disapproved',
    draft: 'Draft',
    ingested: 'Ingested',
    suggested: 'Suggested',
  },
  success: {
    title: 'Successfully submitted!',
    message:
      'Thanks! Your changes have been successfully submitted and sent to a moderator for review. After approval, the changes will be visible on the SSHOC Marketplace.',
    'back-home': 'Back to homepage',
  },
  controls: {
    history: 'History',
    edit: 'Edit',
    'edit-latest-draft': 'Edit latest draft',
    'edit-latest-suggestion': 'Edit latest suggestion',
    delete: 'Delete',
    'delete-item-pending': 'Deleting {{category}}...',
    'delete-item-success': 'Successfully deleted {{category}}.',
    'delete-item-error': 'Failed to delete {{category}}.',
    'delete-item-version-pending': 'Deleting {{category}} version...',
    'delete-item-version-success': 'Successfully deleted {{category}} version.',
    'delete-item-version-error': 'Failed to delete {{category}} version.',
  },
}