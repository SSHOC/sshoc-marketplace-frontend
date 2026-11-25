/** CSS is imported in `pages/_app.tsx` before our theme overrides.
 * Use the unstyled entry to avoid injecting a second stylesheet at runtime. */

import type { ReactNode } from "react";
import { ToastContainer as ToastifyContainer } from "react-toastify/unstyled";

import { toastAutoCloseDelay } from "@/config/site.config";

export function ToastContainer(): ReactNode {
	// const { theme } = useTheme()

	return (
		<ToastifyContainer
			autoClose={toastAutoCloseDelay}
			position="bottom-left"
			/** Theme colors are adjusted via css custom properties in `@/styles/toasts.css`. */
			// theme={theme ?? undefined}
			/** Use color theme, instead of light and dark themes. */
			theme="colored"
		/>
	);
}
