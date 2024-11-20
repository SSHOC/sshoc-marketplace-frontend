"use client";

import { type ReactNode } from "react";

import { AccountScreenWithoutFiltersLayout } from "@/components/account/AccountScreenWithoutFiltersLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { DraftItemsBackgroundFetchIndicator } from "@/components/account/DraftItemsBackgroundFetchIndicator";
import { DraftItemSearchResults } from "@/components/account/DraftItemSearchResults";
import { DraftItemSearchResultsFooter } from "@/components/account/DraftItemSearchResultsFooter";
import { DraftItemSearchResultsHeader } from "@/components/account/DraftItemSearchResultsHeader";
import { DraftItemsSearchResultsCount } from "@/components/account/DraftItemsSearchResultsCount";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";

export default function DraftItemsPage(): ReactNode {
  const { t } = useI18n<"authenticated" | "common">();

  const title = t(["authenticated", "pages", "draft-items"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.AccountPage(),
      label: t(["authenticated", "pages", "account"]),
    },
    {
      href: routes.DraftItemsPage(),
      label: t(["authenticated", "pages", "draft-items"]),
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
              <DraftItemsSearchResultsCount />
            </ScreenTitle>
            <DraftItemsBackgroundFetchIndicator />
          </SpacedRow>
        </ScreenHeader>
        <DraftItemSearchResultsHeader />
        <DraftItemSearchResults />
        <DraftItemSearchResultsFooter />
        <FundingNotice />
      </AccountScreenWithoutFiltersLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
