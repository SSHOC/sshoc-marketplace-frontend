import { join } from "node:path";

import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";
import { read } from "to-vfile";
import { matter } from "vfile-matter";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { LastUpdatedTimestamp } from "@/components/common/LastUpdatedTimestamp";
import { Link } from "@/components/common/Link";
import { Prose } from "@/components/common/Prose";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/terms-of-use/BackgroundImage";
import { Content } from "@/components/terms-of-use/Content";
import { TermsOfUseScreenLayout } from "@/components/terms-of-use/TermsOfUseScreenLayout";
import { getLastUpdatedTimestamp } from "@/data/git/get-last-updated-timestamp";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import { compile } from "@/lib/core/mdx/compile";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { IsoDateString } from "@/lib/core/types";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { useMdx } from "@/lib/utils/hooks/useMdx";

export namespace TermsOfUsePage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export interface Props {
		messages: Messages;
		lastUpdatedTimestamp: IsoDateString;
		code: string;
		metadata: any;
	}
}

export async function getStaticProps(
	context: GetStaticPropsContext<TermsOfUsePage.PathParams>,
): Promise<GetStaticPropsResult<TermsOfUsePage.Props>> {
	const locale = getLocale(context);
	const messages = await load(locale, ["common"]);

	const filePath = join("content", "terms-of-use", "terms-of-use.mdx");
	const lastUpdatedTimestamp = (await getLastUpdatedTimestamp(filePath)).toISOString();

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
			lastUpdatedTimestamp,
		},
	};
}

export default function TermsOfUsePage(props: TermsOfUsePage.Props): ReactNode {
	const { code, metadata } = props;

	const t = useTranslations();

	const title = t("common.pages.terms-of-use");

	const breadcrumbs = [
		{ href: "/", label: t("common.pages.home") },
		{ href: `/terms-of-use`, label: t("common.pages.terms-of-use") },
	];

	const { default: PageContent } = useMdx(code);

	return (
		<Fragment>
			<PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<TermsOfUseScreenLayout>
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
									// @ts-expect-error This is fine.
									a: Link,
								}}
							/>
						</Prose>
						<LastUpdatedTimestamp dateTime={props.lastUpdatedTimestamp} />
					</Content>
					<FundingNotice />
				</TermsOfUseScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<TermsOfUsePage.Props> = TermsOfUsePage;

Page.getLayout = undefined;
