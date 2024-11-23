import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { SignInForm } from "@/app/(app)/auth/sign-in/_components/sign-in-form";
import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { createHref } from "@/lib/create-href";

interface SignInPageProps extends EmptyObject {}

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

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative py-8">
				<h1>{t("title")}</h1>

				<SignInForm />

				<Link href={createHref({})}>Sign in</Link>
			</section>
		</MainContent>
	);
}
