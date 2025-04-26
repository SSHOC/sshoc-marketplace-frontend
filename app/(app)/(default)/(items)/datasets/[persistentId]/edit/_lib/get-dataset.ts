import { log } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";

import { getDataset as _getDataset } from "@/lib/api/client";
import { redirect } from "@/lib/navigation/navigation";
import { isHttpError } from "@/lib/server/errors";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getLatestDatasetVersion({
	persistentId,
	token,
}: {
	persistentId: string;
	token: string;
}) {
	try {
		// return await _getDataset({
		// 	persistentId,
		// 	searchParams: { draft: true, approved: false },
		// 	token,
		// });

		/**
		 * The api returns 404 when `?draft?true` is provided and no draft exists,
		 * instead of falling back to the latest non-draft version.
		 *
		 * @see https://github.com/SSHOC/sshoc-marketplace-backend/issues/497
		 */
		try {
			return await _getDataset({
				persistentId,
				searchParams: { draft: true },
				token,
			});
		} catch (error) {
			if (isHttpError(error) && error.response.status === 404) {
				return await _getDataset({
					persistentId,
					searchParams: { approved: false },
					token,
				});
			}

			throw error;
		}
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
