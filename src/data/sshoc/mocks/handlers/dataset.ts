import { rest } from "msw";

import type { GetDataset } from "@/data/sshoc/api/dataset";
import { createUrl } from "@/data/sshoc/lib/client";
import { db } from "@/data/sshoc/mocks/data/db";

export const handlers = [
	rest.get<never, StringParams<GetDataset.Params>, GetDataset.Response>(
		String(createUrl({ pathname: "/api/datasets/:persistentId" })),
		(request, response, context) => {
			const persistentId = request.params.persistentId;
			const dataset = db.dataset.getById(persistentId);

			if (dataset == null) {
				return response(context.status(404));
			}

			return response(context.json(dataset));
		},
	),
];
