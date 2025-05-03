import { readdir } from "node:fs/promises";
import { join } from "node:path";

import type { Toc } from "@stefanprobst/rehype-extract-toc";
import type { GetStaticPathsContext, GetStaticPropsContext, GetStaticPropsResult } from "next";
import { type Messages, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { read } from "to-vfile";
import { matter } from "vfile-matter";

import { AboutScreenLayout } from "@/components/about/AboutScreenLayout";
import { AboutScreenNavigation } from "@/components/about/AboutScreenNavigation";
import { BackgroundImage } from "@/components/about/BackgroundImage";
import { Content } from "@/components/about/Content";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { LastUpdatedTimestamp } from "@/components/common/LastUpdatedTimestamp";
import { Link } from "@/components/common/Link";
import { Prose } from "@/components/common/Prose";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { TableOfContents } from "@/components/common/TableOfContents";
import { ApiEndpoint } from "@/components/documentation/ApiEndpoint";
import { ApiParamSelect } from "@/components/documentation/ApiParamSelect";
import { ApiParamTextField } from "@/components/documentation/ApiParamTextField";
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
import { Item } from "@/lib/core/ui/Collection/Item";
import { useMdx } from "@/lib/utils/hooks/useMdx";

export namespace AboutPage {
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
	const ids = await readdir(join(process.cwd(), "content", "about"));
	const paths = locales.flatMap((locale) => {
		return ids.map((_id) => {
			const id = _id.slice(0, -".mdx".length);
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
	context: GetStaticPropsContext<AboutPage.PathParams>,
): Promise<GetStaticPropsResult<AboutPage.Props>> {
	const locale = getLocale(context);
	const { id } = context.params!;
	const messages = await load(locale, ["common"]);

	const filePath = join("content", "about", id + ".mdx");
	const lastUpdatedTimestamp = (await getLastUpdatedTimestamp(filePath)).toISOString();

	const input = await read(join(process.cwd(), filePath));
	matter(input, { strip: true });
	const vfile = await compile(input);
	const metadata = vfile.data.matter;
	const tableOfContents = vfile.data.toc ?? null;
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

export default function AboutPage(props: AboutPage.Props): ReactNode {
	const { id } = props.params;

	const t = useTranslations();

	const breadcrumbs = [
		{ href: "/", label: t("common.pages.home") },
		{ href: `/about/${id}`, label: props.metadata.title },
	];

	const { default: PageContent } = useMdx(props.code);

	return (
		<Fragment>
			<PageMetadata title={props.metadata.title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<AboutScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ItemSearchBar />
						<Breadcrumbs links={breadcrumbs} />
						<ScreenTitle>{props.metadata.title}</ScreenTitle>
					</ScreenHeader>
					<AboutScreenNavigation />
					<Content>
						{props.metadata.toc === true && props.tableOfContents != null ? (
							<TableOfContents tableOfContents={props.tableOfContents} />
						) : null}
						<Prose>
							<PageContent
								components={{
									ApiEndpoint,
									ApiParamSelect,
									ApiParamTextField,
									Item,
									// @ts-expect-error This is fine.
									a: Link,
								}}
							/>
						</Prose>
						<LastUpdatedTimestamp dateTime={props.lastUpdatedTimestamp} />
					</Content>
					<FundingNotice />
				</AboutScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<AboutPage.Props> = AboutPage;

Page.getLayout = undefined;
