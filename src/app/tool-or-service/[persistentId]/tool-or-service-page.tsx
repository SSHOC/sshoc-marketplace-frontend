"use client";

import { HttpError } from "@stefanprobst/request";
import { useRouter } from "next/navigation";
import { Fragment, type ReactNode } from "react";
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
import { ItemScreenLayout } from "@/components/item/ItemScreenLayout";
import { ItemSource } from "@/components/item/ItemSource";
import { ItemTitle } from "@/components/item/ItemTitle";
import { ToolOrServiceContentContributors } from "@/components/item/ToolOrServiceContentContributors";
import { ToolOrServiceControls } from "@/components/item/ToolOrServiceControls";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import { keys, useTool } from "@/lib/data/sshoc/hooks/tool-or-service";

interface ToolOrServicePageProps {
  persistentId: string;
}

export default function ToolOrServicePage(
  props: ToolOrServicePageProps
): ReactNode {
  const { persistentId } = props;

  const queryClient = useQueryClient();
  const _toolOrService = useTool({ persistentId }, undefined, {
    /** Pre-populate cache with data fetched server-side without authentication in `getStaticProps`. */
    initialData: queryClient.getQueryData(keys.detail({ persistentId })),
  });
  const toolOrService = _toolOrService.data;

  const router = useRouter();
  const { t } = useI18n<"common">();
  const category = toolOrService?.category ?? "tool-or-service";
  const label =
    toolOrService?.label ?? t(["common", "item-categories", category, "one"]);

  if (
    _toolOrService.error != null &&
    _toolOrService.error instanceof HttpError &&
    _toolOrService.error.response.status === 404
  ) {
    router.push("/404");
  }

  if (toolOrService == null) {
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
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.SearchPage({
        categories: [toolOrService.category],
        order: ["label"],
      }),
      label: t(["common", "item-categories", toolOrService.category, "other"]),
    },
    {
      href: routes.ToolOrServicePage({ persistentId }),
      label,
    },
  ];

  return (
    <PageMainContent>
      <ItemScreenLayout>
        <BackgroundImage />
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
            <ItemSource
              source={toolOrService.source}
              id={toolOrService.sourceItemId}
            />
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
  );
}