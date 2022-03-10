import type { StringParams } from '@stefanprobst/next-route-manifest'
import { rest } from 'msw'

import type { GetTool } from '@/data/sshoc/api/tool-or-service'
import { createUrl } from '@/data/sshoc/lib/client'
import { db } from '@/data/sshoc/mocks/data/db'

export const handlers = [
  rest.get<never, StringParams<GetTool.Params>, GetTool.Response>(
    String(createUrl({ pathname: '/api/tools-services/:persistentId' })),
    (request, response, context) => {
      const persistentId = request.params.persistentId
      const tool = db.tool.getById(persistentId)

      if (tool == null) {
        return response(context.status(404))
      }

      return response(context.json(tool))
    },
  ),
]
