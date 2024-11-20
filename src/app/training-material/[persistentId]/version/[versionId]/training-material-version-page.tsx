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
import { TrainingMaterialContentContributors } from "@/components/item/TrainingMaterialContentContributors";
import { TrainingMaterialVersionControls } from "@/components/item/TrainingMaterialVersionControls";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import {
  useTrainingMaterial,
  useTrainingMaterialVersion,
} from "@/lib/data/sshoc/hooks/training-material";

interface TrainingMaterialVersionPageProps {
  persistentId: string;
  versionId: number;
}

export default function TrainingMaterialVersionPage(
  props: TrainingMaterialVersionPageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const isDraftVersion =
    searchParams != null && searchParams.get("draft") != null;
  const _trainingMaterial = !isDraftVersion
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useTrainingMaterialVersion({ persistentId, versionId }, undefined, {
        enabled: true,
      })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useTrainingMaterial({ persistentId, draft: true }, undefined, {
        enabled: true,
      });
  const trainingMaterial = _trainingMaterial.data;

  const { t } = useI18n<"authenticated" | "common">();

  const category = trainingMaterial?.category ?? "training-material";
  const categoryLabel = t(["common", "item-categories", category, "one"]);
  const label = trainingMaterial?.label ?? categoryLabel;

  if (trainingMaterial == null) {
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
        categories: [trainingMaterial.category],
        order: ["label"],
      }),
      label: t(["common", "item-categories", category, "other"]),
    },
    {
      href: routes.TrainingMaterialVersionPage({ persistentId, versionId }),
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
              status: t(["common", "item-status", trainingMaterial.status]),
            },
          })}
        </Alert>
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
          <TrainingMaterialVersionControls
            persistentId={trainingMaterial.persistentId}
            status={trainingMaterial.status}
            versionId={trainingMaterial.id}
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
            {/* <Suspense fallback={<LoadingIndicator />}> */}
            <TrainingMaterialContentContributors
              persistentId={trainingMaterial.persistentId}
              versionId={trainingMaterial.id}
            />
            {/* </Suspense> */}
          </ItemMetadata>
        </ItemInfo>
        <ItemDetails>
          <ItemMedia media={trainingMaterial.media} />
          <ItemRelatedItems items={trainingMaterial.relatedItems} />
        </ItemDetails>
        <FundingNotice />
      </ItemVersionScreenLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
