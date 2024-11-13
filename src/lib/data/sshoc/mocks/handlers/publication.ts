import { rest } from "msw";

import type { GetPublication } from "@/lib/data/sshoc/api/publication";
import { createUrl } from "@/lib/data/sshoc/lib/client";
import { db } from "@/lib/data/sshoc/mocks/data/db";

export const handlers = [
  rest.get<never, StringParams<GetPublication.Params>, GetPublication.Response>(
    String(createUrl({ pathname: "/api/publications/:persistentId" })),
    (request, response, context) => {
      const persistentId = request.params.persistentId;
      const publication = db.publication.getById(persistentId);

      if (publication == null) {
        return response(context.status(404));
      }

      return response(context.json(publication));
    }
  ),
];
