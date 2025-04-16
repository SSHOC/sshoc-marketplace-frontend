import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import * as v from "valibot";

import { SignUpForm } from "@/app/(app)/(default)/auth/sign-up/_components/sign-up-form";
import { MainContent } from "@/components/ui/main-content";
import { redirect } from "@/lib/navigation/navigation";
import { getRegistrationSession } from "@/lib/server/auth/registration";

const SearchParamsSchema = v.object({
	id: v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)),
	displayName: v.pipe(v.string(), v.nonEmpty()),
	email: v.pipe(v.string(), v.email()),
});

interface SignUpPageProps {
	searchParams: Promise<SearchParams>;
}

export async function generateMetadata(
	_props: Readonly<SignUpPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("SignUpPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function SignUpPage(props: Readonly<SignUpPageProps>): Promise<ReactNode> {
	const { searchParams } = props;

	const t = await getTranslations("SignUpPage");

	const registering = await getRegistrationSession();

	if (registering == null) {
		redirect("/auth/sign-in");
	}

	const result = await v.safeParseAsync(SearchParamsSchema, await searchParams);

	if (!result.success) {
		redirect("/auth/sign-in");
	}

	const { displayName, email, id } = result.output;

	return (
		<MainContent>
			<section>
				<h1>{t("title")}</h1>
			</section>

			<SignUpForm displayName={displayName} email={email} id={id} />
		</MainContent>
	);
}
