"use client";

import { FundingNotice } from "@/components/common/FundingNotice";

import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { LastUpdatedTimestamp } from "@/components/common/LastUpdatedTimestamp";
import { Prose } from "@/components/common/Prose";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/privacy-policy/BackgroundImage";
import { Content } from "@/components/privacy-policy/Content";
import { PrivacyPolicyScreenLayout } from "@/components/privacy-policy/PrivacyPolicyScreenLayout";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import type { ReactNode } from "react";

interface PrivacyPolicyPageProps {
  children: ReactNode;
  lastUpdatedTimestamp: string;
  title: string;
}

export default function PrivacyPolicyPage(
  props: PrivacyPolicyPageProps
): ReactNode {
  const { children, lastUpdatedTimestamp, title: pageTitle } = props;

  const { t } = useI18n<"common">();

  const title = t(["common", "pages", "privacy-policy"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.PrivacyPolicyPage(),
      label: t(["common", "pages", "privacy-policy"]),
    },
  ];

  return (
    <PageMainContent>
      <PrivacyPolicyScreenLayout>
        <BackgroundImage />
        <ScreenHeader>
          <ItemSearchBar />
          <Breadcrumbs links={breadcrumbs} />
          <ScreenTitle>{pageTitle}</ScreenTitle>
        </ScreenHeader>
        <Content>
          <Prose>{children}</Prose>
          <LastUpdatedTimestamp dateTime={lastUpdatedTimestamp} />
        </Content>
        <FundingNotice />
      </PrivacyPolicyScreenLayout>
    </PageMainContent>
  );
}
