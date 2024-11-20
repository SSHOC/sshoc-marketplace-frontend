"use client";

import { useRouter } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { Alert } from "@/components/common/Alert";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { BackgroundImage } from "@/components/item/BackgroundImage";
import { DatasetContentContributors } from "@/components/item/DatasetContentContributors";
import { DatasetVersionControls } from "@/components/item/DatasetVersionControls";
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
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { routes } from "@/lib/core/navigation/routes";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import { useDataset, useDatasetVersion } from "@/lib/data/sshoc/hooks/dataset";

interface DatasetVersionPageProps {
  persistentId: string;
  versionId: number;
}

export default function DatasetVersionPage(
  props: DatasetVersionPageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const isDraftVersion =
    searchParams != null && searchParams.get("draft") != null;
  const _dataset = !isDraftVersion
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useDatasetVersion({ persistentId, versionId }, undefined, {
        enabled: true,
      })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useDataset({ persistentId, draft: true }, undefined, {
        enabled: true,
      });
  const dataset = _dataset.data;

  const { t } = useI18n<"authenticated" | "common">();

  const category = dataset?.category ?? "dataset";
  const categoryLabel = t(["common", "item-categories", category, "one"]);
  const label = dataset?.label ?? categoryLabel;

  if (dataset == null) {
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
        categories: [dataset.category],
        order: ["label"],
      }),
      label: t(["common", "item-categories", category, "other"]),
    },
    {
      href: routes.DatasetVersionPage({ persistentId, versionId }),
      label,
    },
  ];

  return (
    <Fragment>
      {/* TODO: strip markdown from description (synchronously) */}
      <PageMetadata
        title={dataset.label}
        description={dataset.description}
        openGraph={{}}
        twitter={{}}
      />
      <PageMainContent>
        <ItemVersionScreenLayout>
          <BackgroundImage />
          <Alert color="notice">
            {t(["authenticated", "item-status-alert"], {
              values: {
                category: categoryLabel,
                status: t(["common", "item-status", dataset.status]),
              },
            })}
          </Alert>
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ItemTitle
              category={dataset.category}
              thumbnail={dataset.thumbnail}
            >
              {dataset.label}
            </ItemTitle>
          </ScreenHeader>
          <ItemHeader>
            <DatasetVersionControls
              persistentId={dataset.persistentId}
              status={dataset.status}
              versionId={dataset.id}
            />
            <ItemDescription description={dataset.description} />
          </ItemHeader>
          <ItemInfo>
            <ItemAccessibleAtLinks
              category={dataset.category}
              links={dataset.accessibleAt}
            />
            <ItemMetadata>
              <ItemProperties properties={dataset.properties} />
              <ItemActors actors={dataset.contributors} />
              <ItemSource source={dataset.source} id={dataset.sourceItemId} />
              <ItemExternalIds ids={dataset.externalIds} />
              <ItemDateCreated dateTime={dataset.dateCreated} />
              <ItemDateLastUpdated dateTime={dataset.dateLastUpdated} />
              {/* <Suspense fallback={<LoadingIndicator />}> */}
              <DatasetContentContributors
                persistentId={dataset.persistentId}
                versionId={dataset.id}
              />
              {/* </Suspense> */}
            </ItemMetadata>
          </ItemInfo>
          <ItemDetails>
            <ItemMedia media={dataset.media} />
            <ItemRelatedItems items={dataset.relatedItems} />
          </ItemDetails>
          <FundingNotice />
        </ItemVersionScreenLayout>
      </PageMainContent>
    </Fragment>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
