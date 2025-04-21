import { log } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";

import { getDataset as _getDataset } from "@/lib/api/client";
import { redirect } from "@/lib/navigation/navigation";
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getDatasetDraft({
	persistentId,
	token,
}: {
	persistentId: string;
	token: string;
}) {
	try {
		return await _getDataset({ persistentId, searchParams: { draft: true }, token });
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getDatasetSuggestion({
	persistentId,
	token,
}: {
	persistentId: string;
	token: string;
}) {
	try {
		return await _getDataset({ persistentId, searchParams: { approved: false }, token });
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
