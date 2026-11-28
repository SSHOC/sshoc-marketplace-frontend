import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import type { NextRouter } from "next/router";
import { createRef } from "react";
import { expect, it, vi } from "vitest";

import { Link } from "@/lib/core/ui/Link/Link";
import { LinkButton } from "@/lib/core/ui/Link/LinkButton";

it("routes shared links through Next.js while leaving modified clicks to the browser", async () => {
	const user = userEvent.setup();
	const push = vi.fn();
	const replace = vi.fn();
	const ref = createRef<HTMLAnchorElement>();
	const router = {
		push,
		replace,
		beforePopState: vi.fn(),
		prefetch: vi.fn().mockResolvedValue(undefined),
		pathname: "/",
		asPath: "/",
		locale: "en",
	} as unknown as NextRouter;
	const onNavigate = vi.fn();
	render(
		<RouterContext.Provider value={router}>
			<Link href="/browse" replace scroll={false} shallow ref={ref} onNavigate={onNavigate}>
				Browse
			</Link>
			<LinkButton href="/search">Search</LinkButton>
			<LinkButton href="/unavailable" isDisabled>
				Unavailable
			</LinkButton>
		</RouterContext.Provider>,
	);

	const browse = screen.getByRole("link", { name: "Browse" });
	expect(ref.current).toBe(browse);
	expect(browse.getAttribute("href")).toBe("/browse");
	await user.tab();
	expect(document.activeElement).toBe(browse);
	await user.keyboard("{Enter}");
	expect(onNavigate).toHaveBeenCalledTimes(1);
	expect(replace).toHaveBeenCalledWith(
		"/browse",
		"/browse",
		expect.objectContaining({
			scroll: false,
			shallow: true,
		}),
	);

	const search = screen.getByRole("link", { name: "Search" });
	expect(fireEvent.click(search, { ctrlKey: true })).toBe(true);
	expect(push).not.toHaveBeenCalled();
	await user.click(search);
	expect(push).toHaveBeenCalledTimes(1);
	expect(push).toHaveBeenCalledWith("/search", "/search", expect.anything());

	const disabled = screen.getByRole("link", { name: "Unavailable" });
	expect(disabled.getAttribute("aria-disabled")).toBe("true");
	expect(disabled.hasAttribute("href")).toBe(false);
	await user.click(disabled);
	expect(push).toHaveBeenCalledTimes(1);
});
