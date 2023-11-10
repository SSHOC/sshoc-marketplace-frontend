import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/config/i18n.config";

export default createMiddleware({ locales, defaultLocale });

export const config = {
	/**
	 * Next.js does not support arbitrary expressions for `matcher`.
	 *
	 * @see https://github.com/vercel/next.js/issues/56398
	 */
	// matcher: ["/", `/(${locales.join("|")})/:path*`],
	matcher: ["/", "/de/:path*", "/en/:path*"],
};
