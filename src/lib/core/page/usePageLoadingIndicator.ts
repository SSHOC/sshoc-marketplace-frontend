import { useRouter } from "next/router";
import nprogress from "nprogress";
import { useEffect } from "react";

import { useI18n } from "@/lib/core/i18n/useI18n";

const id = "page-load-indicator";

const delay = 250;

const np = nprogress.configure({
	showSpinner: false,
	barSelector: "#" + id,
	// FIXME: use `<PageLoadingIndicator />` component, not a string template
	template: `<div id="${id}" class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><div class="peg" /></div>`,
});

export interface UsePageLoadingIndicatorResult {
	progressProps: {
		id: string;
		role: "progressbar";
		"aria-valuemin": 0;
		"aria-valuemax": 100;
		"aria-valuetext": string;
	};
	regionProps: {
		// 'aria-busy': true | undefined
		"aria-describedby": string;
	};
}

export function usePageLoadingIndicator(): UsePageLoadingIndicatorResult {
	const { t } = useI18n<"common">();
	const router = useRouter();
	const message = t(["common", "page-loading-indicator"]);
	// FIXME: move outside of react to avoid re-render
	// const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		let timer: number | undefined;

		function start() {
			if (timer == null) {
				timer = window.setTimeout(() => {
					np.start();
					// setIsLoading(true)
				}, delay);
			}
		}

		function done() {
			window.clearTimeout(timer);
			timer = undefined;
			np.done();
			// setIsLoading(false)
		}

		router.events.on("routeChangeStart", start);
		router.events.on("routeChangeError", done);
		router.events.on("routeChangeComplete", done);

		return () => {
			window.clearTimeout(timer);
			router.events.off("routeChangeStart", start);
			router.events.off("routeChangeError", done);
			router.events.off("routeChangeComplete", done);
		};
	}, [router.events]);

	return {
		// FIXME: Use `@react-aria/progress`?
		progressProps: {
			id,
			role: "progressbar",
			"aria-valuemin": 0,
			"aria-valuemax": 100,
			"aria-valuetext": message,
		},
		regionProps: {
			// 'aria-busy': isLoading ? true : undefined,
			"aria-describedby": id,
		},
	};
}
