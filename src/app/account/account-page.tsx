"use client";

import { AccountHelpText } from "@/components/account/AccountHelpText";
import { AccountLinks } from "@/components/account/AccountLinks";
import { AccountScreenLayout } from "@/components/account/AccountScreenLayout";
import { BackgroundImage } from "@/components/account/BackgroundImage";
import { Content } from "@/components/account/Content";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";

export default function AccountPage(): JSX.Element {
  const { t } = useI18n<"authenticated" | "common">();

  const title = t(["authenticated", "pages", "account"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.AccountPage(),
      label: t(["authenticated", "pages", "account"]),
    },
  ];

  return (
    <PageMainContent>
      <AccountScreenLayout>
        <BackgroundImage />
        <ScreenHeader>
          <Breadcrumbs links={breadcrumbs} />
          <ScreenTitle>{title}</ScreenTitle>
        </ScreenHeader>
        <Content>
          <AccountHelpText />
          <AccountLinks />
        </Content>
        <FundingNotice />
      </AccountScreenLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
