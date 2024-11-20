"use client";

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
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import {
  useWorkflow,
  useWorkflowVersion,
} from "@/lib/data/sshoc/hooks/workflow";
import type { ReactNode } from "react";

interface WorkflowVersionPageProps {
  persistentId: string;
  versionId: number;
}

export default function WorkflowVersionPage(
  props: WorkflowVersionPageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const searchParams = useSearchParams();
  const isDraftVersion =
    searchParams != null && searchParams.get("draft") != null;
  const _workflow = !isDraftVersion
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useWorkflowVersion({ persistentId, versionId }, undefined, {
        enabled: true,
      })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useWorkflow({ persistentId, draft: true }, undefined, {
        enabled: true,
      });
  const workflow = _workflow.data;

  const { t } = useI18n<"authenticated" | "common">();

  const category = workflow?.category ?? "workflow";
  const categoryLabel = t(["common", "item-categories", category, "one"]);
  const label = workflow?.label ?? categoryLabel;

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
      label: t(["common", "item-categories", category, "other"]),
    },
    {
      href: routes.WorkflowVersionPage({ persistentId, versionId }),
      label,
    },
  ];

  return (
    <PageMainContent>
      <WorkflowVersionScreenLayout>
        <BackgroundImage />
        <Alert color="notice">
          {t(["authenticated", "item-status-alert"], {
            values: {
              category: categoryLabel,
              status: t(["common", "item-status", workflow.status]),
            },
          })}
        </Alert>
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
          <WorkflowVersionControls
            persistentId={workflow.persistentId}
            status={workflow.status}
            versionId={workflow.id}
          />
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
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
