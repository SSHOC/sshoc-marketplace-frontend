import { createUrlSearchParams, HttpError } from "@stefanprobst/request";
import type {
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from "next";
import { useRouter } from "next/router";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";
import { dehydrate, QueryClient, useQueryClient } from "react-query";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { BackgroundImage } from "@/components/item/BackgroundImage";
import { ItemAccessibleAtLinks } from "@/components/item/ItemAccessibleAtLinks";
import { ItemActors } from "@/components/item/ItemActors";
import { ItemCitation } from "@/components/item/ItemCitation";
import { ItemComments } from "@/components/item/ItemComments";
import { ItemDescription } from "@/components/item/ItemDescription";
import { ItemDetails } from "@/components/item/ItemDetails";
import { ItemExternalIds } from "@/components/item/ItemExternalIds";
import { ItemHeader } from "@/components/item/ItemHeader";
import { ItemInfo } from "@/components/item/ItemInfo";
import { ItemMedia } from "@/components/item/ItemMedia";
import { ItemMetadata } from "@/components/item/ItemMetadata";
import { ItemProperties } from "@/components/item/ItemProperties";
import { ItemRelatedItems } from "@/components/item/ItemRelatedItems";
import { ItemScreenLayout } from "@/components/item/ItemScreenLayout";
import { ItemSource } from "@/components/item/ItemSource";
import { ItemTitle } from "@/components/item/ItemTitle";
import { ToolOrServiceContentContributors } from "@/components/item/ToolOrServiceContentContributors";
import { ToolOrServiceControls } from "@/components/item/ToolOrServiceControls";
import { ToolOrServiceSchemaOrgMetadata } from "@/components/item/ToolOrServiceSchemaOrgMetadata";
import type { Tool } from "@/data/sshoc/api/tool-or-service";
import { getTool } from "@/data/sshoc/api/tool-or-service";
import { keys, useTool } from "@/data/sshoc/hooks/tool-or-service";
import { isNotFoundError } from "@/data/sshoc/utils/isNotFoundError";
import type { PageComponent, SharedPageProps } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { getLocales } from "@/lib/core/i18n/getLocales";
import { load } from "@/lib/core/i18n/load";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export namespace ToolOrServicePage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: Tool["persistentId"];
	}
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export interface Props {
		messages: Messages;
		params: PathParams;
		initialQueryState: SharedPageProps["initialQueryState"];
	}
}

export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<ToolOrServicePage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<Tool["persistentId"]> = [];
		return persistentIds.map((persistentId) => {
			const params = { persistentId };
			return { locale, params };
		});
	});

	return {
		paths,
		fallback: "blocking",
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<ToolOrServicePage.PathParams>,
): Promise<GetStaticPropsResult<ToolOrServicePage.Props>> {
	const locale = getLocale(context);
	const params = context.params as ToolOrServicePage.PathParams;
	const messages = await load(locale, ["common"]);

	try {
		const persistentId = params.persistentId;
		const queryClient = new QueryClient();
		await queryClient.prefetchQuery(keys.detail({ persistentId }), () => {
			return getTool({ persistentId });
		});

		return {
			props: {
				messages,
				params,
				initialQueryState: dehydrate(queryClient),
			},
		};
	} catch (error) {
		if (isNotFoundError(error)) {
			return {
				notFound: true,
			};
		}

		throw error;
	}
}

export default function ToolOrServicePage(props: ToolOrServicePage.Props): ReactNode {
	const { persistentId } = props.params;
	const queryClient = useQueryClient();
	const _toolOrService = useTool({ persistentId }, undefined, {
		/** Pre-populate cache with data fetched server-side without authentication in `getStaticProps`. */
		initialData: queryClient.getQueryData(keys.detail({ persistentId })),
	});
	const toolOrService = _toolOrService.data;

	const router = useRouter();
	const t = useTranslations();
	const category = toolOrService?.category ?? "tool-or-service";
	const label = toolOrService?.label ?? t(`common.item-categories.${category}.one`);

	if (
		_toolOrService.error != null &&
		_toolOrService.error instanceof HttpError &&
		_toolOrService.error.response.status === 404
	) {
		router.push("/404");
	}

	if (router.isFallback || toolOrService == null) {
		return (
			<Fragment>
				<PageMetadata title={label} openGraph={{}} twitter={{}} />
				<PageMainContent>
					<FullPage>
						<Centered>
							<ProgressSpinner />
						</Centered>
					</FullPage>
				</PageMainContent>
			</Fragment>
		);
	}

	const breadcrumbs = [
		{ href: "/", label: t("common.pages.home") },
		{
			href: `/search?${createUrlSearchParams({ categories: [toolOrService.category], order: ["label"] })}`,
			label: t(`common.item-categories.${toolOrService.category}.other`),
		},
		{
			href: `/tool-or-service/${persistentId}`,
			label,
		},
	];

	return (
		<Fragment>
			{/* TODO: strip markdown from description (synchronously) */}
			<PageMetadata
				title={toolOrService.label}
				description={toolOrService.description}
				openGraph={{}}
				twitter={{}}
			/>
			<ToolOrServiceSchemaOrgMetadata toolOrService={toolOrService} />
			<PageMainContent>
				<ItemScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ItemSearchBar />
						<Breadcrumbs links={breadcrumbs} />
						<ItemTitle category={toolOrService.category} thumbnail={toolOrService.thumbnail}>
							{toolOrService.label}
						</ItemTitle>
					</ScreenHeader>
					<ItemHeader>
						<ToolOrServiceControls persistentId={toolOrService.persistentId} />
						<ItemDescription description={toolOrService.description} />
					</ItemHeader>
					<ItemInfo>
						<ItemAccessibleAtLinks
							category={toolOrService.category}
							links={toolOrService.accessibleAt}
						/>
						<ItemMetadata>
							<ItemProperties properties={toolOrService.properties} />
							<ItemActors actors={toolOrService.contributors} />
							<ItemSource source={toolOrService.source} id={toolOrService.sourceItemId} />
							<ItemExternalIds ids={toolOrService.externalIds} />
							{/* <Suspense fallback={<LoadingIndicator />}> */}
							<ToolOrServiceContentContributors
								persistentId={toolOrService.persistentId}
								versionId={toolOrService.id}
							/>
							{/* </Suspense> */}
							<ItemCitation item={toolOrService} />
						</ItemMetadata>
					</ItemInfo>
					<ItemDetails>
						<ItemMedia media={toolOrService.media} />
						<ItemRelatedItems items={toolOrService.relatedItems} />
					</ItemDetails>
					<ItemComments persistentId={toolOrService.persistentId} />
					<FundingNotice />
				</ItemScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<ToolOrServicePage.Props> = ToolOrServicePage;

Page.getLayout = undefined;
