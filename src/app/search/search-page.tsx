"use client";

import { type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundFetchIndicator } from "@/components/search/BackgroundFetchIndicator";
import { BackgroundImage } from "@/components/search/BackgroundImage";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchResultsCount } from "@/components/search/SearchResultsCount";
import { SearchResultsFooter } from "@/components/search/SearchResultsFooter";
import { SearchResultsHeader } from "@/components/search/SearchResultsHeader";
import { SearchScreenLayout } from "@/components/search/SearchScreenLayout";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";

export default function SearchPage(): ReactNode {
  const { t } = useI18n<"common">();

  const title = t(["common", "pages", "search"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    { href: routes.SearchPage(), label: t(["common", "pages", "search"]) },
  ];

  return (
    <PageMainContent>
      <SearchScreenLayout>
        <BackgroundImage />
        <ScreenHeader>
          <ItemSearchBar />
          <Breadcrumbs links={breadcrumbs} />
          <SpacedRow>
            <ScreenTitle>
              {t(["common", "search", "search-results"])}
              <SearchResultsCount />
            </ScreenTitle>
            <BackgroundFetchIndicator />
          </SpacedRow>
        </ScreenHeader>
        <SearchFilters />
        <SearchResultsHeader />
        <SearchResults />
        <SearchResultsFooter />
        <FundingNotice />
      </SearchScreenLayout>
    </PageMainContent>
  );
}
