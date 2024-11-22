import { registerOTel } from "@vercel/otel";

import { traceExporter } from "./instrumentation.node";

export function register() {
	registerOTel({
		serviceName: "SSHOC marketplace frontend",
		traceExporter: traceExporter,
	});
}
