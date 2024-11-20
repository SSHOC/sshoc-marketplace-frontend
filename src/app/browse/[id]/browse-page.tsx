"use client";

import { BackgroundImage } from "@/components/browse/BackgroundImage";
import { BrowseFacets } from "@/components/browse/BrowseFacets";
import { BrowseFacetValues } from "@/components/browse/BrowseFacetValues";
import { BrowseScreenLayout } from "@/components/browse/BrowseScreenLayout";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import type { ItemFacet } from "@/lib/data/sshoc/api/item";
import type { ReactNode } from "react";

interface BrowsePageProps {
  id: ItemFacet;
}

export default function BrowsePage(props: BrowsePageProps): ReactNode {
  const { id } = props;

  const { t } = useI18n<"common">();

  const title = t(["common", "browse", "browse-facet"], {
    values: { facet: t(["common", "facets", id, "other"]) },
  });

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    { href: routes.BrowsePage({ id }), label: title },
  ];

  return (
    <PageMainContent>
      <BrowseScreenLayout>
        <BackgroundImage />
        <ScreenHeader>
          <ItemSearchBar />
          <Breadcrumbs links={breadcrumbs} />
          <ScreenTitle>{title}</ScreenTitle>
        </ScreenHeader>
        <BrowseFacets>
          <BrowseFacetValues facet={id} />
        </BrowseFacets>
        <FundingNotice />
      </BrowseScreenLayout>
    </PageMainContent>
  );
}
