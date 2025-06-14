import type { NextApiRequest, NextApiResponse } from "next";

import { env } from "@/config/env.config";
import { baseUrl } from "@/config/site.config";
import { isNonEmptyString, log } from "@/lib/utils";

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
): Promise<void> {
	if (request.method?.toLowerCase() !== "put") {
		response.status(405).end();
		return;
	}

	const secret = env.REVALIDATION_TOKEN;

	if (!isNonEmptyString(secret)) {
		response.status(500).end();
		return;
	}

	const { token, pathname } = request.body;

	if (request.headers.host !== new URL(baseUrl).host) {
		if (!isNonEmptyString(token)) {
			response.status(401).end();
			return;
		}

		if (token !== secret) {
			response.status(403).end();
			return;
		}
	}

	if (!isNonEmptyString(pathname)) {
		response.status(400).end();
		return;
	}

	try {
		await response.revalidate(pathname, { unstable_onlyGenerated: true });
		response.status(200).end();
		return;
	} catch (error) {
		log.error(error);
		response.status(500).end();
		return;
	}
}
