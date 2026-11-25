import { afterEach, describe, expect, it, vi } from "vitest";

import { createUrl, request } from "@/data/sshoc/lib/client";

afterEach(() => vi.unstubAllGlobals());

describe("SSHOC request boundary", () => {
	it("serializes typed parameter interfaces without losing repeated values, zero or false", () => {
		interface Params {
			persistentId: string;
			page: number;
			approved: boolean;
			categories: string[];
			optional?: string;
		}
		const params: Params = {
			persistentId: "example",
			page: 0,
			approved: false,
			categories: ["dataset", "workflow"],
		};
		const url = createUrl({ pathname: "/api/item-search", searchParams: params });
		expect(url.searchParams.get("persistentId")).toBe("example");
		expect(url.searchParams.get("page")).toBe("0");
		expect(url.searchParams.get("approved")).toBe("false");
		expect(url.searchParams.getAll("categories")).toEqual(["dataset", "workflow"]);
		expect(url.searchParams.has("optional")).toBe(false);
	});

	it("removes empty query values and does not send an authorization header for signed-out sessions", async () => {
		const fetch = vi.fn(
			async (_request: Request) =>
				new Response("{}", { headers: { "Content-Type": "application/json" } }),
		);
		vi.stubGlobal("fetch", fetch);
		await request(
			createUrl({ pathname: "/api/item-search", searchParams: { q: "", page: 1 } }),
			{},
			{ token: null },
		);
		const sent = fetch.mock.calls[0]![0];
		expect(new URL(sent.url).searchParams.has("q")).toBe(false);
		expect(new URL(sent.url).searchParams.get("page")).toBe("1");
		expect(sent.headers.has("authorization")).toBe(false);
	});

	it("preserves the signed-in authorization header", async () => {
		const fetch = vi.fn(
			async (_request: Request) =>
				new Response("{}", { headers: { "Content-Type": "application/json" } }),
		);
		vi.stubGlobal("fetch", fetch);
		await request(createUrl({ pathname: "/api/auth/me" }), {}, { token: "Bearer test-only-token" });
		expect(fetch.mock.calls[0]![0].headers.get("authorization")).toBe("Bearer test-only-token");
	});
});
