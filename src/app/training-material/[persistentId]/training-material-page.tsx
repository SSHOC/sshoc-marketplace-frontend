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
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import {
  keys,
  useTrainingMaterial,
} from "@/lib/data/sshoc/hooks/training-material";

interface TrainingMaterialPageProps {
  persistentId: string;
}

export default function TrainingMaterialPage(
  props: TrainingMaterialPageProps
): ReactNode {
  const { persistentId } = props;

  const queryClient = useQueryClient();
  const _trainingMaterial = useTrainingMaterial({ persistentId }, undefined, {
    /** Pre-populate cache with data fetched server-side without authentication in `getStaticProps`. */
    initialData: queryClient.getQueryData(keys.detail({ persistentId })),
  });
  const trainingMaterial = _trainingMaterial.data;

  const router = useRouter();
  const { t } = useI18n<"common">();
  const category = trainingMaterial?.category ?? "training-material";
  const label =
    trainingMaterial?.label ??
    t(["common", "item-categories", category, "one"]);

  if (
    _trainingMaterial.error != null &&
    _trainingMaterial.error instanceof HttpError &&
    _trainingMaterial.error.response.status === 404
  ) {
    router.push("/404");
  }

  if (trainingMaterial == null) {
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
        categories: [trainingMaterial.category],
        order: ["label"],
      }),
      label: t([
        "common",
        "item-categories",
        trainingMaterial.category,
        "other",
      ]),
    },
    {
      href: routes.TrainingMaterialPage({ persistentId }),
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
            category={trainingMaterial.category}
            thumbnail={trainingMaterial.thumbnail}
          >
            {trainingMaterial.label}
          </ItemTitle>
        </ScreenHeader>
        <ItemHeader>
          <TrainingMaterialControls
            persistentId={trainingMaterial.persistentId}
          />
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
            <ItemSource
              source={trainingMaterial.source}
              id={trainingMaterial.sourceItemId}
            />
            <ItemExternalIds ids={trainingMaterial.externalIds} />
            <ItemDateCreated dateTime={trainingMaterial.dateCreated} />
            <ItemDateLastUpdated dateTime={trainingMaterial.dateLastUpdated} />
            <TrainingMaterialContentContributors
              persistentId={trainingMaterial.persistentId}
              versionId={trainingMaterial.id}
            />
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
  );
}
