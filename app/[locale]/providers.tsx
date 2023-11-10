"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import type { Locale } from "@/config/i18n.config";

interface ProvidersProps {
	children: ReactNode;
	locale: Locale;
	messages: Partial<IntlMessages>;
}

export function Providers(props: ProvidersProps): ReactNode {
	const { children, locale, messages } = props;

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<ThemeProvider
				attribute="data-ui-color-scheme"
				defaultTheme="system"
				disableTransitionOnChange
				enableSystem
			>
				{children}
			</ThemeProvider>
		</NextIntlClientProvider>
	);
}
