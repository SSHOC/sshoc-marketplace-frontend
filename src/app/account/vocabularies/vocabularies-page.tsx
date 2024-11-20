"use client";

import { type ReactNode } from "react";

import { AccountScreenWithFiltersLayout } from "@/components/account/AccountScreenWithFiltersLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { VocabulariesBackgroundFetchIndicator } from "@/components/account/VocabulariesBackgroundFetchIndicator";
import { VocabulariesSearchResultsCount } from "@/components/account/VocabulariesSearchResultsCount";
import { VocabularySearchFilters } from "@/components/account/VocabularySearchFilters";
import { VocabularySearchResults } from "@/components/account/VocabularySearchResults";
import { VocabularySearchResultsFooter } from "@/components/account/VocabularySearchResultsFooter";
import { VocabularySearchResultsHeader } from "@/components/account/VocabularySearchResultsHeader";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";

export default function VocabulariesPage(): ReactNode {
  const { t } = useI18n<"authenticated" | "common">();

  const title = t(["authenticated", "pages", "vocabularies"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.AccountPage(),
      label: t(["authenticated", "pages", "account"]),
    },
    {
      href: routes.VocabulariesPage(),
      label: t(["authenticated", "pages", "vocabularies"]),
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
              <VocabulariesSearchResultsCount />
            </ScreenTitle>
            <VocabulariesBackgroundFetchIndicator />
          </SpacedRow>
        </ScreenHeader>
        <VocabularySearchFilters />
        <VocabularySearchResultsHeader />
        <VocabularySearchResults />
        <VocabularySearchResultsFooter />
        <FundingNotice />
      </AccountScreenWithFiltersLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator"].includes(user.role);
}
