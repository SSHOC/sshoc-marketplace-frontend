import { useIsSSR } from "react-aria";

const MOBILE_SCREEN_WIDTH = 640;

export function useIsMobileDevice(): boolean {
	const isSSR = useIsSSR();

	if (isSSR || typeof window === "undefined") {
		return false;
	}

	return window.screen.width <= MOBILE_SCREEN_WIDTH;
}
