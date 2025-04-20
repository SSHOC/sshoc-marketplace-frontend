import { log } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";

import { getWorkflow as _getWorkflow } from "@/lib/api/client";
import { isHttpError } from "@/lib/server/errors";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getWorkflow(persistentId: string) {
	try {
		return await _getWorkflow(persistentId);
	} catch (error) {
		log.error(error);

		if (isHttpError(error) && error.response.status === 404) {
			notFound();
		}

		throw error;
	}
}
