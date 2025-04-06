import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { ErrorHandler } from "@/app/(app)/(default)/auth/callback-error/_components/error-handler.client";
import { ButtonLink } from "@/components/ui/button";
import { MainContent } from "@/components/ui/main-content";
import { createHref } from "@/lib/navigation/create-href";

interface CallbackErrorPageProps {}

export async function generateMetadata(
	_props: Readonly<CallbackErrorPageProps>,
	_parent: ResolvingMetadata,
) {
	const t = await getTranslations("CallbackErrorPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function CallbackErrorPage(_props: Readonly<CallbackErrorPageProps>): ReactNode {
	const t = useTranslations("CallbackErrorPage");

	return (
		<MainContent className="grid place-content-center place-items-center">
			<div>
				<h1>{t("title")}</h1>
				<p>{t("message")}</p>
				<ButtonLink href={createHref({ pathname: "/auth/sign-in" })}>{t("try-again")}</ButtonLink>
			</div>
			<Suspense>
				<ErrorHandler />
			</Suspense>
		</MainContent>
	);
}
