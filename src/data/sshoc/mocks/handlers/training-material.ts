import type { StringParams } from '@stefanprobst/next-route-manifest'
import { rest } from 'msw'

import type { GetTrainingMaterial } from '@/data/sshoc/api/training-material'
import { createUrl } from '@/data/sshoc/lib/client'
import { db } from '@/data/sshoc/mocks/data/db'

export const handlers = [
  rest.get<never, StringParams<GetTrainingMaterial.Params>, GetTrainingMaterial.Response>(
    String(createUrl({ pathname: '/api/training-materials/:persistentId' })),
    (request, response, context) => {
      const persistentId = request.params.persistentId
      const trainingMaterial = db.trainingMaterial.getById(persistentId)

      if (trainingMaterial == null) {
        return response(context.status(404))
      }

      return response(context.json(trainingMaterial))
    },
  ),
]
