import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const _messages = await (locale === "en"
		? /** Enables hot-module-reloading for `en` when using `turbopack`. */
		  import("@/messages/en.json")
		: import(`@/messages/${locale}.json`));
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const messages = _messages.default as IntlMessages;
	const timeZone = "UTC";

	return {
		messages,
		timeZone,
	};
});
