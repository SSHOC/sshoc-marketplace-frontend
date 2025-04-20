import { log } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";

import { getPublication as _getPublication } from "@/lib/api/client";
import { isHttpError } from "@/lib/server/errors";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getPublication(persistentId: string) {
	try {
		return await _getPublication(persistentId);
	} catch (error) {
		log.error(error);

		if (isHttpError(error) && error.response.status === 404) {
			notFound();
		}

		throw error;
	}
}
