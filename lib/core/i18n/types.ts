import type { Locale } from "@/config/i18n.config";
import type authenticated from "@/messages/en/authenticated.json";
import type common from "@/messages/en/common.json";

declare module "next-intl" {
	interface AppConfig {
		Locale: Locale;
		Messages: { authenticated: typeof authenticated; common: typeof common };
	}
}
