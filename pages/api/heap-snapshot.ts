import { createReadStream, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import * as v8 from "node:v8";

import type { NextApiRequest, NextApiResponse } from "next";

import { isNonEmptyString, log } from "@/lib/utils";

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
): Promise<void> {
	if (request.method?.toLowerCase() !== "get") {
		response.status(405).end("Method not allowed.");
		return;
	}

	const secret = process.env.DEBUG_TOKEN;

	if (!isNonEmptyString(secret)) {
		response.status(500).end("Missing secret.");
		return;
	}

	const token = request.headers.authorization;

	if (!isNonEmptyString(token)) {
		response.status(401).end("Unauthorized.");
		return;
	}

	if (token !== secret) {
		response.status(403).end("Forbidden.");
		return;
	}

	const tempDir = tmpdir();
	const filepath = join(tempDir, `${new Date().toISOString()}.heapsnapshot`);

	const snapshotPath = v8.writeHeapSnapshot(filepath);

	if (!snapshotPath) {
		response.status(500).end("Missing snapshot.");
		return;
	}

	const stream = createReadStream(snapshotPath);
	const { size } = statSync(snapshotPath);

	response.setHeader("Content-Type", "application/octet-stream");
	response.setHeader("Content-Disposition", `attachment; filename="${basename(snapshotPath)}"`);
	response.setHeader("Content-Length", size);

	stream.on("error", (error) => {
		log.error("Stream error:", String(error));
		response.status(500).end("Stream error.");
	});

	stream.pipe(response);
}
