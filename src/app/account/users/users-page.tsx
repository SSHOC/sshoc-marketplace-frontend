import { type ReactNode } from "react";

import { AccountScreenWithoutFiltersLayout } from "@/components/account/AccountScreenWithoutFiltersLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { UsersBackgroundFetchIndicator } from "@/components/account/UsersBackgroundFetchIndicator";
import { UserSearchResults } from "@/components/account/UserSearchResults";
import { UserSearchResultsFooter } from "@/components/account/UserSearchResultsFooter";
import { UserSearchResultsHeader } from "@/components/account/UserSearchResultsHeader";
import { UsersSearchResultsCount } from "@/components/account/UsersSearchResultsCount";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { SpacedRow } from "@/lib/core/ui/SpacedRow/SpacedRow";

export default function UsersPage(): ReactNode {
  const { t } = useI18n<"authenticated" | "common">();

  const title = t(["authenticated", "pages", "users"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.AccountPage(),
      label: t(["authenticated", "pages", "account"]),
    },
    {
      href: routes.UsersPage(),
      label: t(["authenticated", "pages", "users"]),
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
              <UsersSearchResultsCount />
            </ScreenTitle>
            <UsersBackgroundFetchIndicator />
          </SpacedRow>
        </ScreenHeader>
        <UserSearchResultsHeader />
        <UserSearchResults />
        <UserSearchResultsFooter />
        <FundingNotice />
      </AccountScreenWithoutFiltersLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator"].includes(user.role);
}
