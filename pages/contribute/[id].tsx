import { readdir } from "node:fs/promises";
import { join } from "node:path";

import type { TableOfContents as Toc } from "@acdh-oeaw/mdx-lib";
import type { GetStaticPathsContext, GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { read } from "to-vfile";
import { matter } from "vfile-matter";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { LastUpdatedTimestamp } from "@/components/common/LastUpdatedTimestamp";
import { Link } from "@/components/common/Link";
import { Prose } from "@/components/common/Prose";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { TableOfContents } from "@/components/common/TableOfContents";
import { ApiEndpoint, ApiParamSelect, ApiParamTextField } from "@/components/content/api-endpoint";
import { Avatar } from "@/components/content/avatar";
import { Disclosure } from "@/components/content/disclosure";
import { Embed } from "@/components/content/embed";
import { Figure } from "@/components/content/figure";
import { Grid, GridItem } from "@/components/content/grid";
import { Link as ContentLink } from "@/components/content/link";
import { Video } from "@/components/content/video";
import { BackgroundImage } from "@/components/contribute/BackgroundImage";
import { Content } from "@/components/contribute/Content";
import { ContributeScreenLayout } from "@/components/contribute/ContributeScreenLayout";
import { ContributeScreenNavigation } from "@/components/contribute/ContributeScreenNavigation";
import { getLastUpdatedTimestamp } from "@/data/git/get-last-updated-timestamp";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { getLocales } from "@/lib/core/i18n/getLocales";
import { load } from "@/lib/core/i18n/load";
import { compile } from "@/lib/core/mdx/compile";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { IsoDateString } from "@/lib/core/types";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { useMdx } from "@/lib/utils/hooks/useMdx";

export namespace ContributePage {
	export interface PathParamsInput extends ParamsInput {
		id: string;
	}
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export interface Props {
		messages: Messages;
		code: string;
		metadata: any;
		tableOfContents: Toc | null;
		lastUpdatedTimestamp: IsoDateString;
		params: PathParams;
	}
}

export async function getStaticPaths(context: GetStaticPathsContext) {
	const locales = getLocales(context);
	const ids = await readdir(join(process.cwd(), "content", "contribute"));
	const paths = locales.flatMap((locale) => {
		return ids.map((id) => {
			const params = { id };
			return { locale, params };
		});
	});

	return {
		paths,
		fallback: "blocking",
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<ContributePage.PathParams>,
): Promise<GetStaticPropsResult<ContributePage.Props>> {
	const locale = getLocale(context);
	const { id } = context.params!;
	const messages = await load(locale, ["common"]);

	const filePath = join("content", "contribute", id, "index.mdx");
	const lastUpdatedTimestamp = (await getLastUpdatedTimestamp(filePath)).toISOString();

	const input = await read(join(process.cwd(), filePath));
	matter(input, { strip: true });
	const vfile = await compile(input);
	const metadata = vfile.data.matter;
	const tableOfContents = vfile.data.tableOfContents ?? null;
	const code = String(vfile);

	return {
		props: {
			code,
			messages,
			lastUpdatedTimestamp,
			metadata,
			tableOfContents,
			params: { id },
		},
	};
}

export default function ContributePage(props: ContributePage.Props): ReactNode {
	const { id } = props.params;

	const t = useTranslations();

	const breadcrumbs = [
		{ href: "/", label: t("common.pages.home") },
		{ href: `/contribute/${id}`, label: props.metadata.title },
	];

	const { default: PageContent } = useMdx(props.code);

	return (
		<Fragment>
			<PageMetadata title={props.metadata.title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<ContributeScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ItemSearchBar />
						<Breadcrumbs links={breadcrumbs} />
						<ScreenTitle>{props.metadata.title}</ScreenTitle>
					</ScreenHeader>
					<ContributeScreenNavigation />
					<Content>
						{props.metadata.toc === true && props.tableOfContents != null ? (
							<TableOfContents tableOfContents={props.tableOfContents} />
						) : null}
						<Prose>
							<PageContent
								components={{
									// @ts-expect-error This is fine.
									a: Link,
									ApiEndpoint,
									ApiParamSelect,
									ApiParamTextField,
									Avatar,
									Disclosure,
									Embed,
									Figure,
									Grid,
									GridItem,
									Link: ContentLink,
									Video,
								}}
							/>
						</Prose>
						<LastUpdatedTimestamp dateTime={props.lastUpdatedTimestamp} />
					</Content>
					<FundingNotice />
				</ContributeScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<ContributePage.Props> = ContributePage;

Page.getLayout = undefined;
