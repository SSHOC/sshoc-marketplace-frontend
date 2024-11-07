import { VisuallyHidden } from '@react-aria/visually-hidden'
import { Fragment, useMemo } from 'react'

import css from '@/components/item/ItemMetadata.module.css'
import type { Actor } from '@/data/sshoc/api/actor'
import type { Item } from '@/data/sshoc/api/item'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { createKey } from '@/lib/utils/create-key'

export interface ItemActorsProps {
  actors: Item['contributors']
}

export function ItemActors(props: ItemActorsProps): JSX.Element {
  const { actors } = props

  const { t } = useI18n<'common'>()
  const roles = useGroupedActors({ actors })

  if (roles.length === 0) {
    return <Fragment />
  }

  return (
    <div>
      <dt>
        <VisuallyHidden>{t(['common', 'item', 'actors', 'other'])}</VisuallyHidden>
      </dt>
      <dd>
        <dl className={css['groups']}>
          {roles.map(([role, actors]) => {
            return (
              <div key={role} className={css['group']}>
                <dt className={css['group-label']}>{role}</dt>
                <dd>
                  <ul role="list" className={css['group-items']}>
                    {actors.map(([name, actor]) => {
                      return (
                        <li key={name}>
                          <div>{name}</div>
                          <ActorAffiliations affiliations={actor.affiliations} />
                          <ActorEmail email={actor.email} />
                          <ActorWebsite website={actor.website} />
                          <ActorExternalIds externalIds={actor.externalIds} />
                        </li>
                      )
                    })}
                  </ul>
                </dd>
              </div>
            )
          })}
        </dl>
      </dd>
    </div>
  )
}

interface UseGroupedActorsArgs {
  actors: Item['contributors']
}

function useGroupedActors(args: UseGroupedActorsArgs): Array<[string, Array<[string, Actor]>]> {
  const { actors } = args

  const { createCollator } = useI18n<'common'>()

  const roles = useMemo(() => {
    const compare = createCollator()

    const roles = new Map<string, Map<string, any>>()

    actors.forEach((actor) => {
      const roleLabel = actor.role.label
      const name = actor.actor.name

      if (!roles.has(roleLabel)) {
        roles.set(roleLabel, new Map())
      }
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      const role = roles.get(roleLabel)!

      if (!role.has(name)) {
        role.set(name, actor.actor)
      }
    })

    const sortedRoles = Array.from(roles).sort(([roleLabel], [otherRoleLabel]) => {
      return compare(roleLabel, otherRoleLabel)
    })

    const sorted = sortedRoles.map(([roleLabel, actors]) => {
      return [
        roleLabel,
        Array.from(actors),
        /**
         * Actors are intentionally not sorted alphabetically but keep database sort order.
         */
        // .sort(([name], [otherName]) => {
        //   return compare(name, otherName)
        // }),
      ]
    })

    return sorted
  }, [actors, createCollator])

  return roles as Array<[string, Array<[string, Actor]>]>
}

interface ActorAffiliationsProps {
  affiliations: Actor['affiliations']
}

function ActorAffiliations(props: ActorAffiliationsProps): JSX.Element {
  const { affiliations } = props

  if (affiliations.length === 0) {
    return <Fragment />
  }

  return (
    <div className={css['secondary']}>
      {affiliations
        .map((actor) => {
          return actor.name
        })
        .join(', ')}
    </div>
  )
}

interface ActorEmailProps {
  email: Actor['email']
}

function ActorEmail(props: ActorEmailProps): JSX.Element {
  const { email } = props

  if (email == null) {
    return <Fragment />
  }

  return (
    <div>
      <a className={css['link']} href={`mailto:${email}`}>
        {email}
      </a>
    </div>
  )
}

interface ActorWebsiteProps {
  website: Actor['website']
}

function ActorWebsite(props: ActorWebsiteProps): JSX.Element {
  const { website } = props

  if (website == null) {
    return <Fragment />
  }

  return (
    <div>
      <a className={css['link']} href={website} target="_blank" rel="noreferrer">
        {website}
      </a>
    </div>
  )
}

interface ActorExternalIdsProps {
  externalIds: Actor['externalIds']
}

function ActorExternalIds(props: ActorExternalIdsProps): JSX.Element {
  const { externalIds } = props

  if (externalIds.length === 0) {
    return <Fragment />
  }

  return (
    <div className={css['values']}>
      {externalIds.map((id) => {
        if (internalExternalIds.includes(id.identifierService.code)) return null

        if (id.identifierService.urlTemplate == null) {
          return (
            <span key={createKey(id.identifierService.code, id.identifier)}>
              {id.identifierService.label}: {id.identifier}
            </span>
          )
        }

        const href = id.identifierService.urlTemplate.replace('{source-actor-id}', id.identifier)

        return (
          <a
            key={createKey(id.identifierService.code, id.identifier)}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={css['link']}
          >
            {id.identifierService.label}
          </a>
        )
      })}
    </div>
  )
}

const internalExternalIds = ['SourceActorId']
