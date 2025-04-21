import * as Sentry from "@sentry/nextjs";

import { env } from "@/config/env.config";

Sentry.init({
	debug: false,
	dsn: env.NEXT_PUBLIC_SENTRY_DSN,
	/** @see https://docs.sentry.io/platforms/javascript/guides/nextjs/opentelemetry/custom-setup/ */
	// TODO:
	// skipOpenTelemetrySetup: true,
	tracesSampleRate: 1,
});
