import { createUrl, log } from "@acdh-oeaw/lib";
import { createClient } from "@hey-api/openapi-ts";

import { env } from "@/config/env.config";

async function generate() {
	await createClient({
		input: {
			path: String(createUrl({ baseUrl: env.NEXT_PUBLIC_API_BASE_URL, pathname: "/v3/api-docs" })),
			exclude: "^#/paths/api/oai-pmh/.+$",
		},
		output: {
			format: "prettier",
			lint: false,
			path: "./lib/api/sshoc",
		},
		plugins: [
			{
				name: "@hey-api/client-fetch",
				baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
				throwOnError: true,
			},
		],
	});
}

generate()
	.then(() => {
		log.success("Successfully generated api client.");
	})
	.catch((error: unknown) => {
		log.error("Failed to generate api client.\n", String(error));
		process.exitCode = 1;
	});
