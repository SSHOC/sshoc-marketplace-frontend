import { log } from "@/lib/utils";

export async function start(): Promise<void> {
	log.warn("API Mocking enabled");

	await import("@/data/sshoc/mocks/data").then(({ seedDatabase }) => {
		seedDatabase();
	});

	if (typeof window === "undefined") {
		await import("@/data/sshoc/mocks/server").then(({ server }) => {
			server.listen({ onUnhandledRequest: "bypass" });
		});
	} else {
		await import("@/data/sshoc/mocks/browser").then(({ worker }) => {
			worker.start({ onUnhandledRequest: "bypass" });
		});
	}
}
