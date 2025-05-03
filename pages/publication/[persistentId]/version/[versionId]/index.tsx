import { createUrlSearchParams } from "@stefanprobst/request";
import type {
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from "next";
import { useRouter } from "next/router";
import { type Messages, useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { Alert } from "@/components/common/Alert";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { BackgroundImage } from "@/components/item/BackgroundImage";
import { ItemAccessibleAtLinks } from "@/components/item/ItemAccessibleAtLinks";
import { ItemActors } from "@/components/item/ItemActors";
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
import { ItemSource } from "@/components/item/ItemSource";
import { ItemTitle } from "@/components/item/ItemTitle";
import { ItemVersionScreenLayout } from "@/components/item/ItemVersionScreenLayout";
import { PublicationContentContributors } from "@/components/item/PublicationContentContributors";
import { PublicationVersionControls } from "@/components/item/PublicationVersionControls";
import type { Publication } from "@/data/sshoc/api/publication";
import { usePublication, usePublicationVersion } from "@/data/sshoc/hooks/publication";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { getLocales } from "@/lib/core/i18n/getLocales";
import { load } from "@/lib/core/i18n/load";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export namespace PublicationVersionPage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: Publication["persistentId"];
		versionId: Publication["id"];
	}
	export type PathParams = StringParams<PathParamsInput>;
	export type SearchParamsInput = Record<string, never>;
	export interface Props {
		messages: Messages;
		params: PathParams;
	}
}

export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<PublicationVersionPage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<Publication["persistentId"]> = [];
		return persistentIds.flatMap((persistentId) => {
			const versionIds: Array<Publication["id"]> = [];
			return versionIds.map((versionId) => {
				const params = { persistentId, versionId: String(versionId) };
				return { locale, params };
			});
		});
	});

	return {
		paths,
		fallback: "blocking",
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext<PublicationVersionPage.PathParams>,
): Promise<GetStaticPropsResult<PublicationVersionPage.Props>> {
	const locale = getLocale(context);
	const params = context.params as PublicationVersionPage.PathParams;
	const messages = await load(locale, ["common", "authenticated"]);

	return {
		props: {
			messages,
			params,
		},
	};
}

export default function PublicationVersionPage(props: PublicationVersionPage.Props): ReactNode {
	const router = useRouter();
	const { persistentId, versionId: _versionId } = props.params;
	const versionId = Number(_versionId);
	const searchParams = useSearchParams();
	const isDraftVersion = searchParams != null && searchParams.get("draft") != null;
	const _publication = !isDraftVersion
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			usePublicationVersion({ persistentId, versionId }, undefined, { enabled: router.isReady })
		: // eslint-disable-next-line react-hooks/rules-of-hooks
			usePublication({ persistentId, draft: true }, undefined, { enabled: router.isReady });
	const publication = _publication.data;

	const t = useTranslations();

	const category = publication?.category ?? "publication";
	const categoryLabel = t(`common.item-categories.${category}.one`);
	const label = publication?.label ?? categoryLabel;

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
		{ href: "/", label: t("common.pages.home") },
		{
			href: `/search?${createUrlSearchParams({ categories: [publication.category], order: ["label"] })}`,
			label: t(`common.item-categories.${category}.other`),
		},
		{
			href: `/publication/${persistentId}/versions/${versionId}`,
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
			<PageMainContent>
				<ItemVersionScreenLayout>
					<BackgroundImage />
					<Alert color="notice">
						{t("authenticated.item-status-alert", {
							category: categoryLabel,
							status: t(`common.item-status.${publication.status}`),
						})}
					</Alert>
					<ScreenHeader>
						<ItemSearchBar />
						<Breadcrumbs links={breadcrumbs} />
						<ItemTitle category={publication.category} thumbnail={publication.thumbnail}>
							{publication.label}
						</ItemTitle>
					</ScreenHeader>
					<ItemHeader>
						<PublicationVersionControls
							persistentId={publication.persistentId}
							status={publication.status}
							versionId={publication.id}
						/>
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
						</ItemMetadata>
					</ItemInfo>
					<ItemDetails>
						<ItemMedia media={publication.media} />
						<ItemRelatedItems items={publication.relatedItems} />
					</ItemDetails>
					<FundingNotice />
				</ItemVersionScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<PublicationVersionPage.Props> = PublicationVersionPage;

Page.getLayout = undefined;

Page.isPageAccessible = function isPageAccessible(user) {
	return ["administrator", "moderator", "contributor"].includes(user.role);
};
