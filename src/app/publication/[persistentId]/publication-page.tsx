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
import { PublicationContentContributors } from "@/components/item/PublicationContentContributors";
import { PublicationControls } from "@/components/item/PublicationControls";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import { keys, usePublication } from "@/lib/data/sshoc/hooks/publication";
import type { ReactNode } from "react";

interface PublicationPageProps {
  persistentId: string;
}

export default function PublicationPage(
  props: PublicationPageProps
): ReactNode {
  const { persistentId } = props;

  const queryClient = useQueryClient();
  const _publication = usePublication({ persistentId }, undefined, {
    /** Pre-populate cache with data fetched server-side without authentication in `getStaticProps`. */
    initialData: queryClient.getQueryData(keys.detail({ persistentId })),
  });
  const publication = _publication.data;

  const router = useRouter();
  const { t } = useI18n<"common">();
  const category = publication?.category ?? "publication";
  const label =
    publication?.label ?? t(["common", "item-categories", category, "one"]);

  if (
    _publication.error != null &&
    _publication.error instanceof HttpError &&
    _publication.error.response.status === 404
  ) {
    router.push("/404");
  }

  if (publication == null) {
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
        categories: [publication.category],
        order: ["label"],
      }),
      label: t(["common", "item-categories", publication.category, "other"]),
    },
    {
      href: routes.PublicationPage({ persistentId }),
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
            category={publication.category}
            thumbnail={publication.thumbnail}
          >
            {publication.label}
          </ItemTitle>
        </ScreenHeader>
        <ItemHeader>
          <PublicationControls persistentId={publication.persistentId} />
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
            <ItemCitation item={publication} />
          </ItemMetadata>
        </ItemInfo>
        <ItemDetails>
          <ItemMedia media={publication.media} />
          <ItemRelatedItems items={publication.relatedItems} />
        </ItemDetails>
        <ItemComments persistentId={publication.persistentId} />
        <FundingNotice />
      </ItemScreenLayout>
    </PageMainContent>
  );
}
