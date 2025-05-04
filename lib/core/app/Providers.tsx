import { I18nProvider as AriaI18nProvider } from "@react-aria/i18n";
import { OverlayProvider } from "@react-aria/overlays";
import { useRouter } from "next/router";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";
import { RouterProvider } from "react-aria-components";
import { useQueryErrorResetBoundary } from "react-query";

import type { PageComponent, SharedPageProps } from "@/lib/core/app/types";
import { AuthProvider } from "@/lib/core/auth/AuthProvider";
import { PageAccessControl } from "@/lib/core/auth/PageAccessControl";
import { useLocale } from "@/lib/core/i18n/useLocale";
import type { QueryClient } from "@/lib/core/query/create-query-client";
import { createQueryClient } from "@/lib/core/query/create-query-client";
import { QueryProvider } from "@/lib/core/query/QueryProvider";
import { ToastContainer } from "@/lib/core/toast/ToastContainer";

export interface ContextProvidersProps {
	children?: ReactNode;
	pageProps: SharedPageProps;
	isPageAccessible?: PageComponent["isPageAccessible"];
}

export function ContextProviders(props: ContextProvidersProps): ReactNode {
	const [queryClient] = useState(() => {
		return createQueryClient({
			query: {
				error:
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					props.pageProps.messages?.common?.["default-query-error-message"] ??
					"Something went wrong.",
			},
			mutation: {
				mutate:
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					props.pageProps.messages?.common?.["default-mutation-pending-message"] ?? "Submitting...",
				success:
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					props.pageProps.messages?.common?.["default-mutation-success-message"] ??
					"Successfully submitted.",
				error:
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					props.pageProps.messages?.common?.["default-mutation-error-message"] ??
					"Something went wrong.",
			},
		});
	});

	return (
		<Providers
			{...props.pageProps}
			isPageAccessible={props.isPageAccessible}
			queryClient={queryClient}
		>
			{props.children}
		</Providers>
	);
}

export interface ProvidersProps extends KeysAllowUndefined<SharedPageProps> {
	isPageAccessible?: PageComponent["isPageAccessible"];
	children?: ReactNode;
	queryClient: QueryClient;
}

export function Providers(props: ProvidersProps): ReactNode {
	const { messages = {}, initialQueryState, isPageAccessible, queryClient } = props;

	const router = useRouter();
	const { locale } = useLocale();
	const { reset } = useQueryErrorResetBoundary();

	function onSignIn() {
		reset();
	}

	function onSignOut() {
		queryClient.clear();
	}

	return (
		<NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
			<QueryProvider client={queryClient} state={initialQueryState}>
				<AuthProvider
					isPageAccessible={isPageAccessible}
					onSignIn={onSignIn} // FIXME: useQueryErrorResetBoundary().reset
					onSignOut={onSignOut}
				>
					<PageAccessControl>
						<AriaI18nProvider locale={locale}>
							{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
							<RouterProvider navigate={router.push}>
								<OverlayProvider>{props.children}</OverlayProvider>
							</RouterProvider>
						</AriaI18nProvider>
					</PageAccessControl>
				</AuthProvider>
			</QueryProvider>
			<ToastContainer />
		</NextIntlClientProvider>
	);
}
