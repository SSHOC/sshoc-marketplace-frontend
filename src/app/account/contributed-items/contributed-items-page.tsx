"use client";

import { type ReactNode } from "react";

import { AccountScreenWithoutFiltersLayout } from "@/components/account/AccountScreenWithoutFiltersLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { ContributedItemsBackgroundFetchIndicator } from "@/components/account/ContributedItemsBackgroundFetchIndicator";
import { ContributedItemSearchResults } from "@/components/account/ContributedItemSearchResults";
import { ContributedItemSearchResultsFooter } from "@/components/account/ContributedItemSearchResultsFooter";
import { ContributedItemSearchResultsHeader } from "@/components/account/ContributedItemSearchResultsHeader";
import { ContributedItemsSearchResultsCount } from "@/components/account/ContributedItemsSearchResultsCount";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";

export default function ContributedItemsPage(): ReactNode {
  const { t } = useI18n<"authenticated" | "common">();

  const title = t(["authenticated", "pages", "contributed-items"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.AccountPage(),
      label: t(["authenticated", "pages", "account"]),
    },
    {
      href: routes.ContributedItemsPage(),
      label: t(["authenticated", "pages", "contributed-items"]),
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
              <ContributedItemsSearchResultsCount />
            </ScreenTitle>
            <ContributedItemsBackgroundFetchIndicator />
          </SpacedRow>
        </ScreenHeader>
        <ContributedItemSearchResultsHeader />
        <ContributedItemSearchResults />
        <ContributedItemSearchResultsFooter />
        <FundingNotice />
      </AccountScreenWithoutFiltersLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
