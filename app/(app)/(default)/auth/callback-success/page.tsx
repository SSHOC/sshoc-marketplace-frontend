import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { SuccessHandler } from "@/app/(app)/(default)/auth/callback-success/_components/success-handler.client";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { MainContent } from "@/components/ui/main-content";

interface CallbackSuccessPageProps {}

export async function generateMetadata(
	_props: Readonly<CallbackSuccessPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("CallbackSuccessPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function CallbackSuccessPage(_props: Readonly<CallbackSuccessPageProps>): ReactNode {
	return (
		<MainContent className="grid place-content-center place-items-center">
			<LoadingIndicator />
			<Suspense>
				<SuccessHandler />
			</Suspense>
		</MainContent>
	);
}
