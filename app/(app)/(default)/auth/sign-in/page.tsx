import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { SignInForm } from "@/app/(app)/(default)/auth/sign-in/_components/sign-in-form";
import { MainContent } from "@/components/ui/main-content";
import { redirect } from "@/lib/navigation/navigation";
import { getIsAuthenticated } from "@/lib/server/auth/session";

interface SignInPageProps {}

export async function generateMetadata(
	_props: Readonly<SignInPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("SignInPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function SignInPage(_props: Readonly<SignInPageProps>): Promise<ReactNode> {
	const t = await getTranslations("SignInPage");

	const isAuthenticated = await getIsAuthenticated();

	if (isAuthenticated) {
		redirect("/");
	}

	return (
		<MainContent>
			<section>
				<h1>{t("title")}</h1>
			</section>

			<SignInForm />
		</MainContent>
	);
}
