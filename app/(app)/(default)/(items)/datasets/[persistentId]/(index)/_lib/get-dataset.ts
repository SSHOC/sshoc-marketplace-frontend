import { log } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";

import { getDataset as _getDataset } from "@/lib/api/client";
import { isHttpError } from "@/lib/server/errors";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getDataset({ persistentId }: { persistentId: string }) {
	try {
		return await _getDataset({ persistentId });
	} catch (error) {
		log.error(error);

		if (isHttpError(error)) {
			if (error.response.status === 404) {
				notFound();
			}
		}

		throw error;
	}
}
