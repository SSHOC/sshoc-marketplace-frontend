import { useTranslations } from 'next-intl'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useItemFormFieldProperties(prefix = '') {
  const t = useTranslations('authenticated')

  const properties = {
    'access-policy-url': {
      name: `${prefix}access-policy-url`,
      description: t('properties.access-policy-url.description'),
    },
    activity: {
      name: `${prefix}activity`,
      description: t('properties.activity.description'),
    },
    authentication: {
      name: `${prefix}authentication`,
      description: t('properties.authentication.description'),
    },
    conference: {
      name: `${prefix}conference`,
      description: t('properties.conference.description'),
    },
    discipline: {
      name: `${prefix}discipline`,
      description: t('properties.discipline.description'),
    },
    'geographical-availability': {
      name: `${prefix}geographical-availability`,
      description: t('properties.geographical-availability.description'),
    },
    'helpdesk-url': {
      name: `${prefix}helpdesk-url`,
      description: t('properties.helpdesk-url.description'),
    },
    issue: {
      name: `${prefix}issue`,
      description: t('properties.issue.description'),
    },
    journal: {
      name: `${prefix}journal`,
      description: t('properties.journal.description'),
    },
    keyword: {
      name: `${prefix}keyword`,
      description: t('properties.keyword.description'),
    },
    language: {
      name: `${prefix}language`,
      description: t('properties.language.description'),
    },
    license: {
      name: `${prefix}license`,
      description: t('properties.license.description'),
    },
    'life-cycle-status': {
      name: `${prefix}life-cycle-status`,
      description: t('properties.life-cycle-status.description'),
    },
    'mode-of-use': {
      name: `${prefix}mode-of-use`,
      description: t('properties.mode-of-use.description'),
    },
    // 'model-version': {
    //   name: `${prefix}model-version`,
    //   description: t('properties.model-version.description'),
    // },
    'object-format': {
      name: `${prefix}object-format`,
      description: t('properties.object-format.description'),
    },
    pages: {
      name: `${prefix}pages`,
      description: t('properties.pages.description'),
    },
    'privacy-policy-url': {
      name: `${prefix}privacy-policy-url`,
      description: t('properties.privacy-policy-url.description'),
    },
    'publication-type': {
      name: `${prefix}publication-type`,
      description: t('properties.publication-type.description'),
    },
    'publication-place': {
      name: `${prefix}publication-place`,
      description: t('properties.publication-place.description'),
    },
    publisher: {
      name: `${prefix}publisher`,
      description: t('properties.publisher.description'),
    },
    'see-also': {
      name: `${prefix}see-also`,
      description: t('properties.see-also.description'),
    },
    'service-level-url': {
      name: `${prefix}service-level-url`,
      description: t('properties.service-level-url.description'),
    },
    // 'service-type': {
    //   name: `${prefix}service-type`,
    //   description: t('properties.service-type.description'),
    // },
    'technical-readiness-level': {
      name: `${prefix}technical-readiness-level`,
      description: t('properties.technical-readiness-level.description'),
    },
    'terms-of-use': {
      name: `${prefix}terms-of-use`,
      description: t('properties.terms-of-use.description'),
    },
    'terms-of-use-url': {
      name: `${prefix}terms-of-use-url`,
      description: t('properties.terms-of-use-url.description'),
    },
    'tool-family': {
      name: `${prefix}tool-family`,
      description: t('properties.tool-family.description'),
    },
    'user-manual-url': {
      name: `${prefix}user-manual-url`,
      description: t('properties.user-manual-url.description'),
    },
    version: {
      name: `${prefix}version`,
      description: t('properties.version.description'),
    },
    volume: {
      name: `${prefix}volume`,
      description: t('properties.volume.description'),
    },
    year: {
      name: `${prefix}year`,
      description: t('properties.year.description'),
    },
  }

  return properties
}
