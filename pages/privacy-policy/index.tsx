import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Fragment, type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { LastUpdatedTimestamp } from "@/components/common/LastUpdatedTimestamp";
import { Link } from "@/components/common/Link";
import { Prose } from "@/components/common/Prose";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/privacy-policy/BackgroundImage";
import { Content } from "@/components/privacy-policy/Content";
import { PrivacyPolicyScreenLayout } from "@/components/privacy-policy/PrivacyPolicyScreenLayout";
import { getLastUpdatedTimestamp } from "@/data/git/get-last-updated-timestamp";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { load } from "@/lib/core/i18n/load";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { IsoDateString } from "@/lib/core/types";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { join } from "node:path";
import { read } from "to-vfile";
import { compile } from "@/lib/core/mdx/compile";
import { matter } from "vfile-matter";
import { useMdx } from "@/lib/utils/hooks/useMdx";

export namespace PrivacyPolicyPage {
	export type PathParamsInput = Record<string, never>;
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export interface Props extends WithDictionaries<"common"> {
		lastUpdatedTimestamp: IsoDateString;
		code: string;
		metadata: any;
	}
}

export async function getStaticProps(
	context: GetStaticPropsContext<PrivacyPolicyPage.PathParams>,
): Promise<GetStaticPropsResult<PrivacyPolicyPage.Props>> {
	const locale = getLocale(context);
	const dictionaries = await load(locale, ["common"]);

	const filePath = join("content", "privacy-policy", "privacy-policy.mdx");
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
			dictionaries,
			lastUpdatedTimestamp,
		},
	};
}

export default function PrivacyPolicyPage(props: PrivacyPolicyPage.Props): ReactNode {
	const { code, metadata } = props;

	const { t } = useI18n<"common">();

	const title = t(["common", "pages", "privacy-policy"]);

	const breadcrumbs = [
		{ href: "/", label: t(["common", "pages", "home"]) },
		{ href: "/privacy-policy", label: t(["common", "pages", "privacy-policy"]) },
	];

	const { default: PageContent } = useMdx(code);

	return (
		<Fragment>
			<PageMetadata nofollow noindex title={title} openGraph={{}} twitter={{}} />
			<PageMainContent>
				<PrivacyPolicyScreenLayout>
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
									// @ts-expect-error
									a: Link,
								}}
							/>
						</Prose>
						<LastUpdatedTimestamp dateTime={props.lastUpdatedTimestamp} />
					</Content>
					<FundingNotice />
				</PrivacyPolicyScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<PrivacyPolicyPage.Props> = PrivacyPolicyPage;

Page.getLayout = undefined;
