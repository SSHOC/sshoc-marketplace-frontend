import type { StringParams } from '@stefanprobst/next-route-manifest'
import { rest } from 'msw'

import type { GetPublication } from '@/data/sshoc/api/publication'
import { createUrl } from '@/data/sshoc/lib/client'
import { db } from '@/data/sshoc/mocks/data/db'

export const handlers = [
  rest.get<never, StringParams<GetPublication.Params>, GetPublication.Response>(
    String(createUrl({ pathname: '/api/publications/:persistentId' })),
    (request, response, context) => {
      const persistentId = request.params.persistentId
      const publication = db.publication.getById(persistentId)

      if (publication == null) {
        return response(context.status(404))
      }

      return response(context.json(publication))
    },
  ),
]
