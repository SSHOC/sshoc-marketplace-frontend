"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

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
import { ToolOrServiceContentContributors } from "@/components/item/ToolOrServiceContentContributors";
import { ToolOrServiceVersionControls } from "@/components/item/ToolOrServiceVersionControls";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import {
  useTool,
  useToolVersion,
} from "@/lib/data/sshoc/hooks/tool-or-service";

interface ToolOrServiceVersionPageProps {
  persistentId: string;
  versionId: number;
}

export default function ToolOrServiceVersionPage(
  props: ToolOrServiceVersionPageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const isDraftVersion =
    searchParams != null && searchParams.get("draft") != null;
  const _toolOrService = !isDraftVersion
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useToolVersion({ persistentId, versionId }, undefined, {
        enabled: true,
      })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useTool({ persistentId, draft: true }, undefined, {
        enabled: true,
      });
  const toolOrService = _toolOrService.data;

  const { t } = useI18n<"authenticated" | "common">();

  const category = toolOrService?.category ?? "tool-or-service";
  const categoryLabel = t(["common", "item-categories", category, "one"]);
  const label = toolOrService?.label ?? categoryLabel;

  if (toolOrService == null) {
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
        categories: [toolOrService.category],
        order: ["label"],
      }),
      label: t(["common", "item-categories", category, "other"]),
    },
    {
      href: routes.ToolOrServiceVersionPage({ persistentId, versionId }),
      label,
    },
  ];

  return (
    <PageMainContent>
      <ItemVersionScreenLayout>
        <BackgroundImage />
        <Alert color="notice">
          {t(["authenticated", "item-status-alert"], {
            values: {
              category: categoryLabel,
              status: t(["common", "item-status", toolOrService.status]),
            },
          })}
        </Alert>
        <ScreenHeader>
          <ItemSearchBar />
          <Breadcrumbs links={breadcrumbs} />
          <ItemTitle
            category={toolOrService.category}
            thumbnail={toolOrService.thumbnail}
          >
            {toolOrService.label}
          </ItemTitle>
        </ScreenHeader>
        <ItemHeader>
          <ToolOrServiceVersionControls
            persistentId={toolOrService.persistentId}
            status={toolOrService.status}
            versionId={toolOrService.id}
          />
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
            <ItemSource
              source={toolOrService.source}
              id={toolOrService.sourceItemId}
            />
            <ItemExternalIds ids={toolOrService.externalIds} />
            <ItemDateCreated dateTime={toolOrService.dateCreated} />
            <ItemDateLastUpdated dateTime={toolOrService.dateLastUpdated} />
            {/* <Suspense fallback={<LoadingIndicator />}> */}
            <ToolOrServiceContentContributors
              persistentId={toolOrService.persistentId}
              versionId={toolOrService.id}
            />
            {/* </Suspense> */}
          </ItemMetadata>
        </ItemInfo>
        <ItemDetails>
          <ItemMedia media={toolOrService.media} />
          <ItemRelatedItems items={toolOrService.relatedItems} />
        </ItemDetails>
        <FundingNotice />
      </ItemVersionScreenLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
