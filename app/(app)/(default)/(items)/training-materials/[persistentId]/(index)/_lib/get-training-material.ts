import { log } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";

import { getTrainingMaterial as _getTrainingMaterial } from "@/lib/api/client";
import { isHttpError } from "@/lib/server/errors";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getTrainingMaterial(persistentId: string) {
	try {
		return await _getTrainingMaterial(persistentId);
	} catch (error) {
		log.error(error);

		if (isHttpError(error) && error.response.status === 404) {
			notFound();
		}

		throw error;
	}
}
