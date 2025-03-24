import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ContactForm } from "@/app/(app)/(default)/contact/_components/contact-form";
import { MainContent } from "@/components/ui/main-content";
import { env } from "@/config/env.config";

export async function generateMetadata(_parent: ResolvingMetadata): Promise<Metadata> {
	const t = await getTranslations("ContactPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ContactPage(): Promise<ReactNode> {
	const t = await getTranslations("ContactPage");

	return (
		<MainContent>
			<h1 className="font-heading text-heading-1 font-strong text-text-strong text-balance">
				{t("title")}
			</h1>

			<p>{t.rich("lead", { email: ContactEmail })}</p>

			<ContactForm />
		</MainContent>
	);
}

function ContactEmail() {
	const email = env.EMAIL_ADDRESS;

	return <a href={email}>{email}</a>;
}
