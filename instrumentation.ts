import { createUrl } from "@acdh-oeaw/lib";
import * as Sentry from "@sentry/nextjs";
import { OTLPHttpJsonTraceExporter, registerOTel } from "@vercel/otel";

import { env } from "@/config/env.config";

export async function register(): Promise<void> {
	if (env.NEXT_RUNTIME === "nodejs") {
		await import("@/sentry.server.config");
	}

	if (env.NEXT_RUNTIME === "edge") {
		await import("@/sentry.edge.config");
	}

	if (env.OPENTELEMETRY_COLLECTOR_URL != null && env.OPENTELEMETRY_SERVICE_NAME != null) {
		const traceEndpoint = createUrl({
			baseUrl: env.OPENTELEMETRY_COLLECTOR_URL,
			pathname: "/v1/traces",
		});

		registerOTel({
			serviceName: env.OPENTELEMETRY_SERVICE_NAME,
			traceExporter: new OTLPHttpJsonTraceExporter({
				url: String(traceEndpoint),
			}),
		});
	}
}

export const onRequestError = Sentry.captureRequestError;
