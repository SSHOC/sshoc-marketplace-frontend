import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { RegistrationHandler } from "@/app/(app)/(default)/auth/callback-registration/_components/registration-handler.client";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { MainContent } from "@/components/ui/main-content";

interface CallbackRegistrationPageProps {}

export async function generateMetadata(
	_props: Readonly<CallbackRegistrationPageProps>,
	_parent: ResolvingMetadata,
) {
	const t = await getTranslations("CallbackRegistrationPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function CallbackRegistrationPage(_props: CallbackRegistrationPageProps): ReactNode {
	return (
		<MainContent className="grid place-content-center place-items-center">
			<LoadingIndicator />
			<Suspense>
				<RegistrationHandler />
			</Suspense>
		</MainContent>
	);
}
