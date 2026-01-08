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
import { WorkflowContentContributors } from "@/components/item/WorkflowContentContributors";
import { WorkflowStepsList } from "@/components/item/WorkflowStepsList";
import { WorkflowVersionControls } from "@/components/item/WorkflowVersionControls";
import { WorkflowVersionScreenLayout } from "@/components/item/WorkflowVersionScreenLayout";
import { PageMetadata } from "@/components/metadata/page-metadata";
import type { Workflow } from "@/data/sshoc/api/workflow";
import { useWorkflow, useWorkflowVersion } from "@/data/sshoc/hooks/workflow";
import type { PageComponent } from "@/lib/core/app/types";
import { getLocale } from "@/lib/core/i18n/getLocale";
import { getLocales } from "@/lib/core/i18n/getLocales";
import { load } from "@/lib/core/i18n/load";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

export namespace WorkflowVersionPage {
	export interface PathParamsInput extends ParamsInput {
		persistentId: Workflow["persistentId"];
		versionId: Workflow["id"];
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
): Promise<GetStaticPathsResult<WorkflowVersionPage.PathParams>> {
	const locales = getLocales(context);
	const paths = locales.flatMap((locale) => {
		const persistentIds: Array<Workflow["persistentId"]> = [];
		return persistentIds.flatMap((persistentId) => {
			const versionIds: Array<Workflow["id"]> = [];
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
	context: GetStaticPropsContext<WorkflowVersionPage.PathParams>,
): Promise<GetStaticPropsResult<WorkflowVersionPage.Props>> {
	const locale = getLocale(context);
	const params = context.params as WorkflowVersionPage.PathParams;
	const messages = await load(locale, ["common", "authenticated"]);

	return {
		props: {
			messages,
			params,
		},
	};
}

export default function WorkflowVersionPage(props: WorkflowVersionPage.Props): ReactNode {
	const router = useRouter();
	const { persistentId, versionId: _versionId } = props.params;
	const versionId = Number(_versionId);
	const searchParams = useSearchParams();
	const isDraftVersion = searchParams != null && searchParams.get("draft") != null;
	const _workflow = !isDraftVersion
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useWorkflowVersion({ persistentId, versionId }, undefined, { enabled: router.isReady })
		: // eslint-disable-next-line react-hooks/rules-of-hooks
			useWorkflow({ persistentId, draft: true }, undefined, { enabled: router.isReady });
	const workflow = _workflow.data;

	const t = useTranslations();

	const category = workflow?.category ?? "workflow";
	const categoryLabel = t(`common.item-categories.${category}.one`);
	const label = workflow?.label ?? categoryLabel;

	if (router.isFallback || workflow == null) {
		return (
			<Fragment>
				<PageMetadata title={label} />
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
			href: `/search?${createUrlSearchParams({ categories: [workflow.category], order: ["label"] })}`,
			label: t(`common.item-categories.${category}.other`),
		},
		{
			href: `/workflow/${workflow.persistentId}/versions/${versionId}`,
			label,
		},
	];

	return (
		<Fragment>
			{/* TODO: strip markdown from description (synchronously) */}
			<PageMetadata title={workflow.label} description={workflow.description} />
			<PageMainContent>
				<WorkflowVersionScreenLayout>
					<BackgroundImage />
					<Alert color="notice">
						{t("authenticated.item-status-alert", {
							category: categoryLabel,
							status: t(`common.item-status.${workflow.status}`),
						})}
					</Alert>
					<ScreenHeader>
						<ItemSearchBar />
						<Breadcrumbs links={breadcrumbs} />
						<ItemTitle category={workflow.category} thumbnail={workflow.thumbnail}>
							{workflow.label}
						</ItemTitle>
					</ScreenHeader>
					<ItemHeader>
						<WorkflowVersionControls
							persistentId={workflow.persistentId}
							status={workflow.status}
							versionId={workflow.id}
						/>
						<ItemDescription description={workflow.description} />
					</ItemHeader>
					<ItemInfo>
						<ItemAccessibleAtLinks category={workflow.category} links={workflow.accessibleAt} />
						<ItemMetadata>
							<ItemProperties properties={workflow.properties} />
							<ItemActors actors={workflow.contributors} />
							<ItemSource source={workflow.source} id={workflow.sourceItemId} />
							<ItemExternalIds ids={workflow.externalIds} />
							<ItemDateCreated dateTime={workflow.dateCreated} />
							<ItemDateLastUpdated dateTime={workflow.dateLastUpdated} />
							{/* <Suspense fallback={<LoadingIndicator />}> */}
							<WorkflowContentContributors
								persistentId={workflow.persistentId}
								versionId={workflow.id}
							/>
							{/* </Suspense> */}
						</ItemMetadata>
					</ItemInfo>
					<ItemDetails>
						<ItemMedia media={workflow.media} />
						<ItemRelatedItems items={workflow.relatedItems} />
					</ItemDetails>
					<WorkflowStepsList steps={workflow.composedOf} />
					<FundingNotice />
				</WorkflowVersionScreenLayout>
			</PageMainContent>
		</Fragment>
	);
}

const Page: PageComponent<WorkflowVersionPage.Props> = WorkflowVersionPage;

Page.getLayout = undefined;
