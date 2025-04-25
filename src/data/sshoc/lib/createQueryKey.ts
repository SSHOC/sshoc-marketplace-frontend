import type { AuthData } from '@/data/sshoc/api/common'

export const scope = {
  actor: 'actor',
  actorRole: 'actor-role',
  actorSource: 'actor-source',
  concept: 'concept',
  dataset: 'dataset',
  item: 'item',
  media: 'media',
  mediaSource: 'media-source',
  property: 'property',
  propertyType: 'property-type',
  publication: 'publication',
  source: 'source',
  toolOrService: 'tool-or-service',
  trainingMaterial: 'training-material',
  user: 'user',
  vocabulary: 'vocabulary',
  workflow: 'workflow',
  workflowStep: 'workflow-step',
}

export const kind = {
  list: 'list',
  entity: 'entity',
  version: 'version',
  detail: 'detail',
  history: 'history',
  informationContributor: 'information-contributor',
  search: 'search',
  diff: 'diff',
  download: 'download',
  thumbnail: 'thumbnail',
}


export function createQueryKey<
  TScope extends keyof typeof scope,
  TKind extends keyof typeof kind,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  TParams extends object,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  TAuthData extends AuthData,
>(scope: TScope, kind: TKind, params?: TParams, auth?: TAuthData) {
  return [auth ?? {}, scope, kind, params ?? {}] as const
}
