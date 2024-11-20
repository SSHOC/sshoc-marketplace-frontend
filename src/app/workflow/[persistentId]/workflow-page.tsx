"use client";

import { HttpError } from "@stefanprobst/request";
import { useRouter } from "next/navigation";
import { useQueryClient } from "react-query";

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
import { WorkflowScreenLayout } from "@/components/item/WorkflowScreenLayout";
import { WorkflowStepsList } from "@/components/item/WorkflowStepsList";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

import { keys, useWorkflow } from "@/lib/data/sshoc/hooks/workflow";
import type { ReactNode } from "react";

interface WorkflowPageProps {
  persistentId: string;
}

export default function WorkflowPage(props: WorkflowPageProps): ReactNode {
  const { persistentId } = props;

  const queryClient = useQueryClient();
  const _workflow = useWorkflow({ persistentId }, undefined, {
    /** Pre-populate cache with data fetched server-side without authentication in `getStaticProps`. */
    initialData: queryClient.getQueryData(keys.detail({ persistentId })),
  });
  const workflow = _workflow.data;

  const router = useRouter();
  const { t } = useI18n<"common">();
  const category = workflow?.category ?? "workflow";
  const label =
    workflow?.label ?? t(["common", "item-categories", category, "one"]);

  if (
    _workflow.error != null &&
    _workflow.error instanceof HttpError &&
    _workflow.error.response.status === 404
  ) {
    router.push("/404");
  }

  if (workflow == null) {
    return (
      <PageMainContent>
        <FullPage>
          <Centered>
            <ProgressSpinner />
          </Centered>
        </FullPage>
      </PageMainContent>
    );
  }

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.SearchPage({
        categories: [workflow.category],
        order: ["label"],
      }),
      label: t(["common", "item-categories", workflow.category, "other"]),
    },
    {
      href: routes.WorkflowPage({ persistentId }),
      label,
    },
  ];

  return (
    <PageMainContent>
      <WorkflowScreenLayout>
        <BackgroundImage />
        <ScreenHeader>
          <ItemSearchBar />
          <Breadcrumbs links={breadcrumbs} />
          <ItemTitle
            category={workflow.category}
            thumbnail={workflow.thumbnail}
          >
            {workflow.label}
          </ItemTitle>
        </ScreenHeader>
        <ItemHeader>
          <WorkflowControls persistentId={workflow.persistentId} />
          <ItemDescription description={workflow.description} />
        </ItemHeader>
        <ItemInfo>
          <ItemAccessibleAtLinks
            category={workflow.category}
            links={workflow.accessibleAt}
          />
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
  );
}
