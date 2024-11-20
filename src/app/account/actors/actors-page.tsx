"use client";

import { type ReactNode } from "react";

import { AccountScreenWithoutFiltersLayout } from "@/components/account/AccountScreenWithoutFiltersLayout";
import { ActorsBackgroundFetchIndicator } from "@/components/account/ActorsBackgroundFetchIndicator";
import { ActorSearchResults } from "@/components/account/ActorSearchResults";
import { ActorSearchResultsFooter } from "@/components/account/ActorSearchResultsFooter";
import { ActorSearchResultsHeader } from "@/components/account/ActorSearchResultsHeader";
import { ActorsSearchResultsCount } from "@/components/account/ActorsSearchResultsCount";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";

export default function ActorsPage(): ReactNode {
  const { t } = useI18n<"authenticated" | "common">();

  const title = t(["authenticated", "pages", "actors"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.AccountPage(),
      label: t(["authenticated", "pages", "account"]),
    },
    {
      href: routes.ActorsPage(),
      label: t(["authenticated", "pages", "actors"]),
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
              <ActorsSearchResultsCount />
            </ScreenTitle>
            <ActorsBackgroundFetchIndicator />
          </SpacedRow>
        </ScreenHeader>
        <ActorSearchResultsHeader />
        <ActorSearchResults />
        <ActorSearchResultsFooter />
        <FundingNotice />
      </AccountScreenWithoutFiltersLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator"].includes(user.role);
}
