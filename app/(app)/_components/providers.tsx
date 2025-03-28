import { AriaProviders } from "@/app/(app)/_components/aria-providers";
import type { IntlLocale } from "@/lib/i18n/locales";
import type { IntlMessages } from "@/lib/i18n/messages";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

interface ProvidersProps {
	children: ReactNode;
	locale: IntlLocale;
	messages: Partial<IntlMessages>;
}

export function Providers(props: Readonly<ProvidersProps>): ReactNode {
	const { children, locale, messages } = props;

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<AriaProviders locale={locale}>{children}</AriaProviders>
		</NextIntlClientProvider>
	);
}
