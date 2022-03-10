import type { StringParams } from '@stefanprobst/next-route-manifest'
import { rest } from 'msw'

import type { GetWorkflow } from '@/data/sshoc/api/workflow'
import { createUrl } from '@/data/sshoc/lib/client'
import { db } from '@/data/sshoc/mocks/data/db'

export const handlers = [
  rest.get<never, StringParams<GetWorkflow.Params>, GetWorkflow.Response>(
    String(createUrl({ pathname: '/api/workflows/:persistentId' })),
    (request, response, context) => {
      const persistentId = request.params.persistentId
      const workflow = db.workflow.getById(persistentId)

      if (workflow == null) {
        return response(context.status(404))
      }

      return response(context.json(workflow))
    },
  ),
]
