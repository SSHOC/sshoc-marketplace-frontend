import { rest } from "msw";

import type { GetTool } from "@/lib/data/sshoc/api/tool-or-service";
import { createUrl } from "@/lib/data/sshoc/lib/client";
import { db } from "@/lib/data/sshoc/mocks/data/db";

export const handlers = [
  rest.get<never, StringParams<GetTool.Params>, GetTool.Response>(
    String(createUrl({ pathname: "/api/tools-services/:persistentId" })),
    (request, response, context) => {
      const persistentId = request.params.persistentId;
      const tool = db.tool.getById(persistentId);

      if (tool == null) {
        return response(context.status(404));
      }

      return response(context.json(tool));
    }
  ),
];
