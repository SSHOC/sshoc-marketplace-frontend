import { rest } from "msw";

import type { GetTrainingMaterial } from "@/lib/data/sshoc/api/training-material";
import { createUrl } from "@/lib/data/sshoc/lib/client";
import { db } from "@/lib/data/sshoc/mocks/data/db";

export const handlers = [
  rest.get<
    never,
    StringParams<GetTrainingMaterial.Params>,
    GetTrainingMaterial.Response
  >(
    String(createUrl({ pathname: "/api/training-materials/:persistentId" })),
    (request, response, context) => {
      const persistentId = request.params.persistentId;
      const trainingMaterial = db.trainingMaterial.getById(persistentId);

      if (trainingMaterial == null) {
        return response(context.status(404));
      }

      return response(context.json(trainingMaterial));
    }
  ),
];
