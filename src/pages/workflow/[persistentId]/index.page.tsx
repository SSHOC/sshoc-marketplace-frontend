import { createUrlSearchParams, HttpError } from "@stefanprobst/request";
import type {
	GetStaticPathsContext,
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from "next";
import { useRouter } from "next/router";
import { Fragment } from "react";
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
import { ItemSource } from "@/components/item/ItemSource";
import { ItemTitle } from "@/components/item/ItemTitle";
import { WorkflowContentContributors } from "@/components/item/WorkflowContentContributors";
import { WorkflowControls } from "@/components/item/WorkflowControls";
import { WorkflowSchemaOrgMetadata } from "@/components/item/WorkflowSchemaOrgMetadata";
import { WorkflowScreenLayout } from "@/components/item/WorkflowScreenLayout";
import { WorkflowStepsList } from "@/components/item/WorkflowStepsList";
import type { Workflow } from "@/data/sshoc/api/workflow";
import { getWorkflow } from "@/data/sshoc/api/workflow";
import type { WorkflowStep } from "@/data/sshoc/api/workflow-step";
import { keys, useWorkflow } from "@/data/sshoc/hooks/workflow";
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

export namespace WorkflowPage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: Workflow["persistentId"];
	}
	export type PathParams = StringParams<PathParamsInput>;
	export interface SearchParamsInput extends ParamsInput {
		step?: WorkflowStep["persistentId"];
	}
	export interface Props extends WithDictionaries<"common"> {
		params: PathParams;
		initialQueryState: SharedPageProps["initialQueryState"];
	}
}

export async function getStaticPaths(
	context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<WorkflowPage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<Workflow["persistentId"]> = [];
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
	context: GetStaticPropsContext<WorkflowPage.PathParams>,
): Promise<GetStaticPropsResult<WorkflowPage.Props>> {
	const locale = getLocale(context);
	const params = context.params as WorkflowPage.PathParams;
	const dictionaries = await load(locale, ["common"]);

	try {
		const persistentId = params.persistentId;
		const queryClient = new QueryClient();
		await queryClient.prefetchQuery(keys.detail({ persistentId }), () => {
			return getWorkflow({ persistentId });
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

export default function WorkflowPage(props: WorkflowPage.Props): ReactNode {
	const { persistentId } = props.params;
	const queryClient = useQueryClient();
	const _workflow = useWorkflow({ persistentId }, undefined, {
		/** Pre-populate cache with data fetched server-side without authentication in `getStaticProps`. */
		initialData: queryClient.getQueryData(keys.detail({ persistentId })),
	});
	const workflow = _workflow.data;

	const router = useRouter();
	const { t } = useI18n<"common">();
	const category = workflow?.category ?? "workflow";
	const label = workflow?.label ?? t(["common", "item-categories", category, "one"]);

	if (
		_workflow.error != null &&
		_workflow.error instanceof HttpError &&
		_workflow.error.response.status === 404
	) {
		router.push("/404");
	}

	if (router.isFallback || workflow == null) {
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
			href: `/search?${createUrlSearchParams({ categories: [workflow.category], order: ["label"] })}`,
			label: t(["common", "item-categories", workflow.category, "other"]),
		},
		{
			href: `/workflow/${persistentId}`,
			label,
		},
	];

	return (
		<Fragment>
			{/* TODO: strip markdown from description (synchronously) */}
			<PageMetadata
				title={workflow.label}
				description={workflow.description}
				openGraph={{}}
				twitter={{}}
			/>
			<WorkflowSchemaOrgMetadata workflow={workflow} />
			<PageMainContent>
				<WorkflowScreenLayout>
					<BackgroundImage />
					<ScreenHeader>
						<ItemSearchBar />
						<Breadcrumbs links={breadcrumbs} />
						<ItemTitle category={workflow.category} thumbnail={workflow.thumbnail}>
							{workflow.label}
						</ItemTitle>
					</ScreenHeader>
					<ItemHeader>
						<WorkflowControls persistentId={workflow.persistentId} />
						<ItemDescription description={workflow.description} />
					</ItemHeader>
					<ItemInfo>
						<ItemAccessibleAtLinks category={workflow.category} links={workflow.accessibleAt} />
						<ItemMetadata>
							<ItemProperties properties={workflow.properties} />
							<ItemActors actors={workflow.contributors} />
							<ItemSource source={workflow.source} id={workflow.sourceItemId} />
							<ItemExternalIds ids={workflow.externalIds} />
							{/* <Suspense fallback={<LoadingIndicator />}> */}
							<WorkflowContentContributors
								persistentId={workflow.persistentId}
								versionId={workflow.id}
							/>
							{/* </Suspense> */}
							<ItemCitation item={workflow} />
						</ItemMetadata>
					</ItemInfo>
					<ItemDetails>
						<ItemMedia media={workflow.media} />
						<ItemRelatedItems items={workflow.relatedItems} />
					</ItemDetails>
					<WorkflowStepsList steps={workflow.composedOf} />
					<ItemComments persistentId={workflow.persistentId} />
					<FundingNotice />
				</WorkflowScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<WorkflowPage.Props> = WorkflowPage;

Page.getLayout = undefined;
