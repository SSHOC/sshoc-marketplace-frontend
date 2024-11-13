import { rest } from "msw";

import type { GetWorkflow } from "@/lib/data/sshoc/api/workflow";
import { createUrl } from "@/lib/data/sshoc/lib/client";
import { db } from "@/lib/data/sshoc/mocks/data/db";

export const handlers = [
  rest.get<never, StringParams<GetWorkflow.Params>, GetWorkflow.Response>(
    String(createUrl({ pathname: "/api/workflows/:persistentId" })),
    (request, response, context) => {
      const persistentId = request.params.persistentId;
      const workflow = db.workflow.getById(persistentId);

      if (workflow == null) {
        return response(context.status(404));
      }

      return response(context.json(workflow));
    }
  ),
];
