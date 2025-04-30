import { createUrlSearchParams, HttpError } from "@stefanprobst/request";
import type {
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from "next";
import { useRouter } from "next/router";
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
import { ItemDateCreated } from "@/components/item/ItemDateCreated";
import { ItemDateLastUpdated } from "@/components/item/ItemDateLastUpdated";
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
import { PublicationContentContributors } from "@/components/item/PublicationContentContributors";
import { PublicationControls } from "@/components/item/PublicationControls";
import { PublicationSchemaOrgMetadata } from "@/components/item/PublicationSchemaOrgMetadata";
import type { Publication } from "@/data/sshoc/api/publication";
import { getPublication } from "@/data/sshoc/api/publication";
import { keys, usePublication } from "@/data/sshoc/hooks/publication";
import { isNotFoundError } from "@/data/sshoc/utils/isNotFoundError";
import type { PageComponent, SharedPageProps } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { getLocales } from "@/lib/core/i18n/getLocales";
import { load } from "@/lib/core/i18n/load";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export namespace PublicationPage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: Publication["persistentId"];
	}
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export interface Props extends WithDictionaries<"common"> {
		params: PathParams;
		initialQueryState: SharedPageProps["initialQueryState"];
	}
}

export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<PublicationPage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<Publication["persistentId"]> = [];
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
	context: GetStaticPropsContext<PublicationPage.PathParams>,
): Promise<GetStaticPropsResult<PublicationPage.Props>> {
	const locale = getLocale(context);
	const params = context.params as PublicationPage.PathParams;
	const dictionaries = await load(locale, ["common"]);

	try {
		const persistentId = params.persistentId;
		const queryClient = new QueryClient();
		await queryClient.prefetchQuery(keys.detail({ persistentId }), () => {
			return getPublication({ persistentId });
		});

		return {
			props: {
				dictionaries,
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

export default function PublicationPage(props: PublicationPage.Props): ReactNode {
	const { persistentId } = props.params;
	const queryClient = useQueryClient();
	const _publication = usePublication({ persistentId }, undefined, {
		/** Pre-populate cache with data fetched server-side without authentication in `getStaticProps`. */
		initialData: queryClient.getQueryData(keys.detail({ persistentId })),
	});
	const publication = _publication.data;

	const router = useRouter();
	const { t } = useI18n<"common">();
	const category = publication?.category ?? "publication";
	const label = publication?.label ?? t(["common", "item-categories", category, "one"]);

	if (
		_publication.error != null &&
		_publication.error instanceof HttpError &&
		_publication.error.response.status === 404
	) {
		router.push("/404");
	}

	if (router.isFallback || publication == null) {
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
		{ href: "/", label: t(["common", "pages", "home"]) },
		{
			href: `/search?${createUrlSearchParams({ categories: [publication.category], order: ["label"] })}`,
			label: t(["common", "item-categories", publication.category, "other"]),
		},
		{
			href: `/publication/${persistentId}`,
			label,
		},
	];

	return (
		<Fragment>
			{/* TODO: strip markdown from description (synchronously) */}
			<PageMetadata
				title={publication.label}
				description={publication.description}
				openGraph={{}}
				twitter={{}}
			/>
			<PublicationSchemaOrgMetadata publication={publication} />
			<PageMainContent>
				<ItemScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ItemSearchBar />
						<Breadcrumbs links={breadcrumbs} />
						<ItemTitle category={publication.category} thumbnail={publication.thumbnail}>
							{publication.label}
						</ItemTitle>
					</ScreenHeader>
					<ItemHeader>
						<PublicationControls persistentId={publication.persistentId} />
						<ItemDescription description={publication.description} />
					</ItemHeader>
					<ItemInfo>
						<ItemAccessibleAtLinks
							category={publication.category}
							links={publication.accessibleAt}
						/>
						<ItemMetadata>
							<ItemProperties properties={publication.properties} />
							<ItemActors actors={publication.contributors} />
							<ItemSource source={publication.source} id={publication.sourceItemId} />
							<ItemExternalIds ids={publication.externalIds} />
							<ItemDateCreated dateTime={publication.dateCreated} />
							<ItemDateLastUpdated dateTime={publication.dateLastUpdated} />
							{/* <Suspense fallback={<LoadingIndicator />}> */}
							<PublicationContentContributors
								persistentId={publication.persistentId}
								versionId={publication.id}
							/>
							{/* </Suspense> */}
							<ItemCitation item={publication} />
						</ItemMetadata>
					</ItemInfo>
					<ItemDetails>
						<ItemMedia media={publication.media} />
						<ItemRelatedItems items={publication.relatedItems} />
					</ItemDetails>
					<ItemComments persistentId={publication.persistentId} />
					<FundingNotice />
				</ItemScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<PublicationPage.Props> = PublicationPage;

Page.getLayout = undefined;
