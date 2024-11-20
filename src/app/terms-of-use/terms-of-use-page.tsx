"use client";

import { FundingNotice } from "@/components/common/FundingNotice";

import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { LastUpdatedTimestamp } from "@/components/common/LastUpdatedTimestamp";
import { Prose } from "@/components/common/Prose";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/terms-of-use/BackgroundImage";
import { Content } from "@/components/terms-of-use/Content";
import { TermsOfUseScreenLayout } from "@/components/terms-of-use/TermsOfUseScreenLayout";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import type { ReactNode } from "react";

interface TermsOfUsePageProps {
  children: ReactNode;
  lastUpdatedTimestamp: string;
  title: string;
}

export default function TermsOfUsePage(props: TermsOfUsePageProps): ReactNode {
  const { children, lastUpdatedTimestamp, title: pageTitle } = props;

  const { t } = useI18n<"common">();

  const title = t(["common", "pages", "terms-of-use"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.TermsOfUsePage(),
      label: t(["common", "pages", "terms-of-use"]),
    },
  ];

  return (
    <PageMainContent>
      <TermsOfUseScreenLayout>
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
      </TermsOfUseScreenLayout>
    </PageMainContent>
  );
}
