import { rest } from "msw";

import type {
	GetItemCategories,
	ItemCategoryWithWorkflowStep,
	ItemSearch,
} from "@/data/sshoc/api/item";
import { createUrl } from "@/data/sshoc/lib/client";
import { db } from "@/data/sshoc/mocks/data/db";

export const handlers = [
	rest.get<never, never, GetItemCategories.Response>(
		String(createUrl({ pathname: "/api/items-categories" })),
		(request, response, context) => {
			return response(
				context.json({
					dataset: "Datasets",
					publication: "Publications",
					step: "Workflow steps",
					"tool-or-service": "Tools & Services",
					"training-material": "Training Materials",
					workflow: "Workflows",
				}),
			);
		},
	),

	rest.get<never, StringParams<ItemSearch.Params>, ItemSearch.Response>(
		String(createUrl({ pathname: "/api/item-search" })),
		(request, response, context) => {
			const _categories = request.url.searchParams.getAll("categories");

			const results = db.item.find(_categories as Array<ItemCategoryWithWorkflowStep>);

			return response(context.json(results));
		},
	),
];
