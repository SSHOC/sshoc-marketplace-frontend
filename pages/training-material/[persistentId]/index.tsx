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
import { TrainingMaterialContentContributors } from "@/components/item/TrainingMaterialContentContributors";
import { TrainingMaterialControls } from "@/components/item/TrainingMaterialControls";
import { TrainingMaterialSchemaOrgMetadata } from "@/components/item/TrainingMaterialSchemaOrgMetadata";
import type { TrainingMaterial } from "@/data/sshoc/api/training-material";
import { getTrainingMaterial } from "@/data/sshoc/api/training-material";
import { keys, useTrainingMaterial } from "@/data/sshoc/hooks/training-material";
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

export namespace TrainingMaterialPage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: TrainingMaterial["persistentId"];
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
): Promise<GetStaticPathsResult<TrainingMaterialPage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<TrainingMaterial["persistentId"]> = [];
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
	context: GetStaticPropsContext<TrainingMaterialPage.PathParams>,
): Promise<GetStaticPropsResult<TrainingMaterialPage.Props>> {
	const locale = getLocale(context);
	const params = context.params as TrainingMaterialPage.PathParams;
	const messages = await load(locale, ["authenticated", "common"]);

	try {
		const persistentId = params.persistentId;
		const queryClient = new QueryClient();
		await queryClient.prefetchQuery(keys.detail({ persistentId }), () => {
			return getTrainingMaterial({ persistentId });
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

export default function TrainingMaterialPage(props: TrainingMaterialPage.Props): ReactNode {
	const { persistentId } = props.params;
	const queryClient = useQueryClient();
	const _trainingMaterial = useTrainingMaterial({ persistentId }, undefined, {
		/** Pre-populate cache with data fetched server-side without authentication in `getStaticProps`. */
		initialData: queryClient.getQueryData(keys.detail({ persistentId })),
	});
	const trainingMaterial = _trainingMaterial.data;

	const router = useRouter();
	const t = useTranslations();
	const category = trainingMaterial?.category ?? "training-material";
	const label = trainingMaterial?.label ?? t(`common.item-categories.${category}.one`);

	if (
		_trainingMaterial.error != null &&
		_trainingMaterial.error instanceof HttpError &&
		_trainingMaterial.error.response.status === 404
	) {
		router.push("/404");
	}

	if (router.isFallback || trainingMaterial == null) {
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
			href: `/search?${createUrlSearchParams({ categories: [trainingMaterial.category], order: ["label"] })}`,
			label: t(`common.item-categories.${trainingMaterial.category}.other`),
		},
		{
			href: `/training-material/${persistentId}`,
			label,
		},
	];

	return (
		<Fragment>
			{/* TODO: strip markdown from description (synchronously) */}
			<PageMetadata
				title={trainingMaterial.label}
				description={trainingMaterial.description}
				openGraph={{}}
				twitter={{}}
			/>
			<TrainingMaterialSchemaOrgMetadata trainingMaterial={trainingMaterial} />
			<PageMainContent>
				<ItemScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ItemSearchBar />
						<Breadcrumbs links={breadcrumbs} />
						<ItemTitle category={trainingMaterial.category} thumbnail={trainingMaterial.thumbnail}>
							{trainingMaterial.label}
						</ItemTitle>
					</ScreenHeader>
					<ItemHeader>
						<TrainingMaterialControls persistentId={trainingMaterial.persistentId} />
						<ItemDescription description={trainingMaterial.description} />
					</ItemHeader>
					<ItemInfo>
						<ItemAccessibleAtLinks
							category={trainingMaterial.category}
							links={trainingMaterial.accessibleAt}
						/>
						<ItemMetadata>
							<ItemProperties properties={trainingMaterial.properties} />
							<ItemActors actors={trainingMaterial.contributors} />
							<ItemSource source={trainingMaterial.source} id={trainingMaterial.sourceItemId} />
							<ItemExternalIds ids={trainingMaterial.externalIds} />
							<ItemDateCreated dateTime={trainingMaterial.dateCreated} />
							<ItemDateLastUpdated dateTime={trainingMaterial.dateLastUpdated} />
							{/* <Suspense fallback={<LoadingIndicator />}> */}
							<TrainingMaterialContentContributors
								persistentId={trainingMaterial.persistentId}
								versionId={trainingMaterial.id}
							/>
							{/* </Suspense> */}
							<ItemCitation item={trainingMaterial} />
						</ItemMetadata>
					</ItemInfo>
					<ItemDetails>
						<ItemMedia media={trainingMaterial.media} />
						<ItemRelatedItems items={trainingMaterial.relatedItems} />
					</ItemDetails>
					<ItemComments persistentId={trainingMaterial.persistentId} />
					<FundingNotice />
				</ItemScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<TrainingMaterialPage.Props> = TrainingMaterialPage;

Page.getLayout = undefined;
