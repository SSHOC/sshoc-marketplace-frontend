"use client";

import { AccountScreenWithoutFiltersLayout } from "@/components/account/AccountScreenWithoutFiltersLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { SourcesBackgroundFetchIndicator } from "@/components/account/SourcesBackgroundFetchIndicator";
import { SourceSearchResults } from "@/components/account/SourceSearchResults";
import { SourceSearchResultsFooter } from "@/components/account/SourceSearchResultsFooter";
import { SourceSearchResultsHeader } from "@/components/account/SourceSearchResultsHeader";
import { SourcesSearchResultsCount } from "@/components/account/SourcesSearchResultsCount";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";
import type { ReactNode } from "react";

export default function SourcesPage(): ReactNode {
  const { t } = useI18n<"authenticated" | "common">();

  const title = t(["authenticated", "pages", "sources"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.AccountPage(),
      label: t(["authenticated", "pages", "account"]),
    },
    {
      href: routes.SourcesPage(),
      label: t(["authenticated", "pages", "sources"]),
    },
  ];

  return (
    <PageMainContent>
      <AccountScreenWithoutFiltersLayout>
        <BackgroundImage />
        <ScreenHeader>
          <Breadcrumbs links={breadcrumbs} />
          <SpacedRow>
            <ScreenTitle>
              {title}
              <SourcesSearchResultsCount />
            </ScreenTitle>
            <SourcesBackgroundFetchIndicator />
          </SpacedRow>
        </ScreenHeader>
        <SourceSearchResultsHeader />
        <SourceSearchResults />
        <SourceSearchResultsFooter />
        <FundingNotice />
      </AccountScreenWithoutFiltersLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator"].includes(user.role);
}
