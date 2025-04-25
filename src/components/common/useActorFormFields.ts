import { useMemo } from 'react'

import { useI18n } from '@/lib/core/i18n/useI18n'

export type ActorFormFields = ReturnType<typeof useActorFormFields>

 
export function useActorFormFields(prefix = '') {
  const { t } = useI18n<'authenticated'>()

  const fields = useMemo(() => {
    const fields = {
      name: {
        name: `${prefix}name`,
        label: t(['authenticated', 'actors', 'name', 'label']),
        description: t(['authenticated', 'actors', 'name', 'description']),
        isRequired: true,
      },
      externalIds: {
        name: `${prefix}externalIds`,
        label: t(['authenticated', 'actors', 'externalIds', 'label']),
        description: t(['authenticated', 'actors', 'externalIds', 'description']),
        fields: {
          identifier: {
            name: 'identifier',
            label: t(['authenticated', 'actors', 'externalIds.identifier', 'label']),
            description: t(['authenticated', 'actors', 'externalIds.identifier', 'description']),
          },
          identifierService: {
            name: 'identifierService.code',
            _root: 'identifierService',
            label: t(['authenticated', 'actors', 'externalIds.identifierService', 'label']),
            description: t([
              'authenticated',
              'actors',
              'externalIds.identifierService',
              'description',
            ]),
          },
        },
      },
      email: {
        name: `${prefix}email`,
        label: t(['authenticated', 'actors', 'email', 'label']),
        description: t(['authenticated', 'actors', 'email', 'description']),
      },
      website: {
        name: `${prefix}website`,
        label: t(['authenticated', 'actors', 'website', 'label']),
        description: t(['authenticated', 'actors', 'website', 'description']),
      },
      affiliations: {
        name: `${prefix}affiliations`,
        label: t(['authenticated', 'actors', 'affiliations', 'label']),
        description: t(['authenticated', 'actors', 'affiliations', 'description']),
        fields: {
          actor: {
            name: 'id',
            label: t(['authenticated', 'actors', 'affiliations.actor', 'label']),
            description: t(['authenticated', 'actors', 'affiliations.actor', 'description']),
          },
        },
      },
    }

    return fields
  }, [prefix, t])

  return fields
}
