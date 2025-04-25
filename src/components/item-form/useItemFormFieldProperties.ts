import { useI18n } from '@/lib/core/i18n/useI18n'

 
export function useItemFormFieldProperties(prefix = '') {
  const { t } = useI18n<'authenticated'>()

  const properties = {
    'access-policy-url': {
      name: `${prefix}access-policy-url`,
      description: t(['authenticated', 'properties', 'access-policy-url', 'description']),
    },
    activity: {
      name: `${prefix}activity`,
      description: t(['authenticated', 'properties', 'activity', 'description']),
    },
    authentication: {
      name: `${prefix}authentication`,
      description: t(['authenticated', 'properties', 'authentication', 'description']),
    },
    conference: {
      name: `${prefix}conference`,
      description: t(['authenticated', 'properties', 'conference', 'description']),
    },
    discipline: {
      name: `${prefix}discipline`,
      description: t(['authenticated', 'properties', 'discipline', 'description']),
    },
    'geographical-availability': {
      name: `${prefix}geographical-availability`,
      description: t(['authenticated', 'properties', 'geographical-availability', 'description']),
    },
    'helpdesk-url': {
      name: `${prefix}helpdesk-url`,
      description: t(['authenticated', 'properties', 'helpdesk-url', 'description']),
    },
    issue: {
      name: `${prefix}issue`,
      description: t(['authenticated', 'properties', 'issue', 'description']),
    },
    journal: {
      name: `${prefix}journal`,
      description: t(['authenticated', 'properties', 'journal', 'description']),
    },
    keyword: {
      name: `${prefix}keyword`,
      description: t(['authenticated', 'properties', 'keyword', 'description']),
    },
    language: {
      name: `${prefix}language`,
      description: t(['authenticated', 'properties', 'language', 'description']),
    },
    license: {
      name: `${prefix}license`,
      description: t(['authenticated', 'properties', 'license', 'description']),
    },
    'life-cycle-status': {
      name: `${prefix}life-cycle-status`,
      description: t(['authenticated', 'properties', 'life-cycle-status', 'description']),
    },
    'mode-of-use': {
      name: `${prefix}mode-of-use`,
      description: t(['authenticated', 'properties', 'mode-of-use', 'description']),
    },
    // 'model-version': {
    //   name: `${prefix}model-version`,
    //   description: t(['authenticated', 'properties', 'model-version', 'description']),
    // },
    'object-format': {
      name: `${prefix}object-format`,
      description: t(['authenticated', 'properties', 'object-format', 'description']),
    },
    pages: {
      name: `${prefix}pages`,
      description: t(['authenticated', 'properties', 'pages', 'description']),
    },
    'privacy-policy-url': {
      name: `${prefix}privacy-policy-url`,
      description: t(['authenticated', 'properties', 'privacy-policy-url', 'description']),
    },
    'publication-type': {
      name: `${prefix}publication-type`,
      description: t(['authenticated', 'properties', 'publication-type', 'description']),
    },
    'publication-place': {
      name: `${prefix}publication-place`,
      description: t(['authenticated', 'properties', 'publication-place', 'description']),
    },
    publisher: {
      name: `${prefix}publisher`,
      description: t(['authenticated', 'properties', 'publisher', 'description']),
    },
    'see-also': {
      name: `${prefix}see-also`,
      description: t(['authenticated', 'properties', 'see-also', 'description']),
    },
    'service-level-url': {
      name: `${prefix}service-level-url`,
      description: t(['authenticated', 'properties', 'service-level-url', 'description']),
    },
    // 'service-type': {
    //   name: `${prefix}service-type`,
    //   description: t(['authenticated', 'properties', 'service-type', 'description']),
    // },
    'technical-readiness-level': {
      name: `${prefix}technical-readiness-level`,
      description: t(['authenticated', 'properties', 'technical-readiness-level', 'description']),
    },
    'terms-of-use': {
      name: `${prefix}terms-of-use`,
      description: t(['authenticated', 'properties', 'terms-of-use', 'description']),
    },
    'terms-of-use-url': {
      name: `${prefix}terms-of-use-url`,
      description: t(['authenticated', 'properties', 'terms-of-use-url', 'description']),
    },
    'tool-family': {
      name: `${prefix}tool-family`,
      description: t(['authenticated', 'properties', 'tool-family', 'description']),
    },
    'user-manual-url': {
      name: `${prefix}user-manual-url`,
      description: t(['authenticated', 'properties', 'user-manual-url', 'description']),
    },
    version: {
      name: `${prefix}version`,
      description: t(['authenticated', 'properties', 'version', 'description']),
    },
    volume: {
      name: `${prefix}volume`,
      description: t(['authenticated', 'properties', 'volume', 'description']),
    },
    year: {
      name: `${prefix}year`,
      description: t(['authenticated', 'properties', 'year', 'description']),
    },
  }

  return properties
}
