"use client";

import { useRouter } from "next/navigation";
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
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { routes } from "@/lib/core/navigation/routes";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import {
  usePublication,
  usePublicationVersion,
} from "@/lib/data/sshoc/hooks/publication";

interface PublicationVersionPageProps {
  persistentId: string;
  versionId: number;
}

export default function PublicationVersionPage(
  props: PublicationVersionPageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const isDraftVersion =
    searchParams != null && searchParams.get("draft") != null;
  const _publication = !isDraftVersion
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      usePublicationVersion({ persistentId, versionId }, undefined, {
        enabled: true,
      })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      usePublication({ persistentId, draft: true }, undefined, {
        enabled: true,
      });
  const publication = _publication.data;

  const { t } = useI18n<"authenticated" | "common">();

  const category = publication?.category ?? "publication";
  const categoryLabel = t(["common", "item-categories", category, "one"]);
  const label = publication?.label ?? categoryLabel;

  if (publication == null) {
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
        categories: [publication.category],
        order: ["label"],
      }),
      label: t(["common", "item-categories", category, "other"]),
    },
    {
      href: routes.PublicationVersionPage({ persistentId, versionId }),
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
              status: t(["common", "item-status", publication.status]),
            },
          })}
        </Alert>
        <ScreenHeader>
          <ItemSearchBar />
          <Breadcrumbs links={breadcrumbs} />
          <ItemTitle
            category={publication.category}
            thumbnail={publication.thumbnail}
          >
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
            <ItemSource
              source={publication.source}
              id={publication.sourceItemId}
            />
            <ItemExternalIds ids={publication.externalIds} />
            <ItemDateCreated dateTime={publication.dateCreated} />
            <ItemDateLastUpdated dateTime={publication.dateLastUpdated} />
            <PublicationContentContributors
              persistentId={publication.persistentId}
              versionId={publication.id}
            />
          </ItemMetadata>
        </ItemInfo>
        <ItemDetails>
          <ItemMedia media={publication.media} />
          <ItemRelatedItems items={publication.relatedItems} />
        </ItemDetails>
        <FundingNotice />
      </ItemVersionScreenLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
