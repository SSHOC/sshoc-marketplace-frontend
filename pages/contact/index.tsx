import { join } from "node:path";

import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";
import { read } from "to-vfile";
import { matter } from "vfile-matter";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { Link } from "@/components/common/Link";
import { Prose } from "@/components/common/Prose";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/contact/BackgroundImage";
import type { ContactFormValues } from "@/components/contact/ContactForm";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactScreenLayout } from "@/components/contact/ContactScreenLayout";
import { Content } from "@/components/contact/Content";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import { compile } from "@/lib/core/mdx/compile";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { useMdx } from "@/lib/utils/hooks/useMdx";

export namespace ContactPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Partial<ContactFormValues>;
	export type Props = {
		code: string;
		metadata: any;
		messages: Messages;
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<ContactPage.PathParams>,
): Promise<GetStaticPropsResult<ContactPage.Props>> {
	const locale = getLocale(context);
	const messages = await load(locale, ["common"]);

	const filePath = join("content", "contact", "index.mdx");

	const input = await read(join(process.cwd(), filePath));
	matter(input, { strip: true });
	const vfile = await compile(input);
	const metadata = vfile.data.matter;
	const code = String(vfile);

	return {
		props: {
			code,
			metadata,
			messages,
		},
	};
}

export default function ContactPage(props: ContactPage.Props): ReactNode {
	const { code, metadata } = props;

	const t = useTranslations();

	const title = t("common.pages.contact");

	const breadcrumbs = [
		{ href: "/", label: t("common.pages.home") },
		{ href: "/contact", label: t("common.pages.contact") },
	];

	const { default: PageContent } = useMdx(code);

	return (
		<Fragment>
			<PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<ContactScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ItemSearchBar />
						<Breadcrumbs links={breadcrumbs} />
						<ScreenTitle>{metadata.title}</ScreenTitle>
					</ScreenHeader>
					<Content>
						<Prose>
							<PageContent
								components={{
									// @ts-expect-error This is fone.
									a: Link,
								}}
							/>
						</Prose>
					</Content>
					<ContactForm />
					<FundingNotice />
				</ContactScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<ContactPage.Props> = ContactPage;

Page.getLayout = undefined;
