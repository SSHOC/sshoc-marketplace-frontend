"use client";

import { type ReactNode } from "react";

import { AccountScreenWithFiltersLayout } from "@/components/account/AccountScreenWithFiltersLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { ModerateItemsBackgroundFetchIndicator } from "@/components/account/ModerateItemsBackgroundFetchIndicator";
import { ModerateItemSearchFilters } from "@/components/account/ModerateItemSearchFilters";
import { ModerateItemSearchResults } from "@/components/account/ModerateItemSearchResults";
import { ModerateItemSearchResultsFooter } from "@/components/account/ModerateItemSearchResultsFooter";
import { ModerateItemSearchResultsHeader } from "@/components/account/ModerateItemSearchResultsHeader";
import { ModerateItemsSearchResultsCount } from "@/components/account/ModerateItemsSearchResultsCount";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";

export default function ModerateItemsPage(): ReactNode {
  const { t } = useI18n<"authenticated" | "common">();

  const title = t(["authenticated", "pages", "moderate-items"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.AccountPage(),
      label: t(["authenticated", "pages", "account"]),
    },
    {
      href: routes.ModerateItemsPage(),
      label: t(["authenticated", "pages", "moderate-items"]),
    },
  ];

  return (
    <PageMainContent>
      <AccountScreenWithFiltersLayout>
        <BackgroundImage />
        <ScreenHeader>
          <Breadcrumbs links={breadcrumbs} />
          <SpacedRow>
            <ScreenTitle>
              {title}
              <ModerateItemsSearchResultsCount />
            </ScreenTitle>
            <ModerateItemsBackgroundFetchIndicator />
          </SpacedRow>
        </ScreenHeader>
        <ModerateItemSearchFilters />
        <ModerateItemSearchResultsHeader />
        <ModerateItemSearchResults />
        <ModerateItemSearchResultsFooter />
        <FundingNotice />
      </AccountScreenWithFiltersLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator"].includes(user.role);
}
