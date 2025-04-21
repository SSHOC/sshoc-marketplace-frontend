import { log } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";

import { getDatasetVersions as _getDatasetVersions } from "@/lib/api/client";
import { redirect } from "@/lib/navigation/navigation";
import { isHttpError } from "@/lib/server/errors";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getDatasetVersions({
	persistentId,
	token,
}: {
	persistentId: string;
	token: string;
}) {
	try {
		return await _getDatasetVersions({ persistentId, token });
	} catch (error) {
		log.error(error);

		if (isHttpError(error)) {
			if (error.response.status === 404) {
				notFound();
			}

			if (error.response.status === 401 || error.response.status === 403) {
				redirect("/auth/sign-in");
			}
		}

		throw error;
	}
}
