import { log } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";

import { deleteDataset as _deleteDataset } from "@/lib/api/client";
import { redirect } from "@/lib/navigation/navigation";
import { isHttpError } from "@/lib/server/errors";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function deleteDataset({
	persistentId,
	token,
}: {
	persistentId: string;
	token: string;
}) {
	try {
		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
		return await _deleteDataset({ persistentId, token });
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
