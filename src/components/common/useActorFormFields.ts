import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export type ActorFormFields = ReturnType<typeof useActorFormFields>

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useActorFormFields(prefix = '') {
  const t = useTranslations('authenticated')

  const fields = useMemo(() => {
    const fields = {
      name: {
        name: `${prefix}name`,
        label: t('actors.name.label'),
        description: t('actors.name.description'),
        isRequired: true,
      },
      externalIds: {
        name: `${prefix}externalIds`,
        label: t('actors.externalIds.label'),
        description: t('actors.externalIds.description'),
        fields: {
          identifier: {
            name: 'identifier',
            label: t('actors.externalIds.identifier.label'),
            description: t('actors.externalIds.identifier.description'),
          },
          identifierService: {
            name: 'identifierService.code',
            _root: 'identifierService',
            label: t('actors.externalIds.identifierService.label'),
            description: t('actors.externalIds.identifierService.description'),
          },
        },
      },
      email: {
        name: `${prefix}email`,
        label: t('actors.email.label'),
        description: t('actors.email.description'),
      },
      website: {
        name: `${prefix}website`,
        label: t('actors.website.label'),
        description: t('actors.website.description'),
      },
      affiliations: {
        name: `${prefix}affiliations`,
        label: t('actors.affiliations.label'),
        description: t('actors.affiliations.description'),
        fields: {
          actor: {
            name: 'id',
            label: t('actors.affiliations.actor.label'),
            description: t('actors.affiliations.actor.description'),
          },
        },
      },
    }

    return fields
  }, [prefix, t])

  return fields
}
