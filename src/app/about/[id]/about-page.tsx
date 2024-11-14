"use client";

import type { Toc } from "@stefanprobst/rehype-extract-toc";
import type { ReactNode } from "react";
import { Fragment } from "react";

import { AboutScreenLayout } from "@/components/about/AboutScreenLayout";
import { AboutScreenNavigation } from "@/components/about/AboutScreenNavigation";
import { BackgroundImage } from "@/components/about/BackgroundImage";
import { Content } from "@/components/about/Content";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { LastUpdatedTimestamp } from "@/components/common/LastUpdatedTimestamp";
import { Prose } from "@/components/common/Prose";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { TableOfContents } from "@/components/common/TableOfContents";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMetadata } from "@/lib/core/metadata/PageMetadata";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import type { NavItems } from "@/lib/core/page/types";

interface AboutPageProps {
  children: ReactNode;
  id: string;
  lastUpdatedTimestamp: string;
  navigationMenu: NavItems;
  tableOfContents: Toc | undefined;
  title: string;
}

export default function AboutPage(props: AboutPageProps): JSX.Element {
  const {
    children,
    id,
    lastUpdatedTimestamp,
    navigationMenu,
    tableOfContents,
    title,
  } = props;

  const { t } = useI18n<"common">();

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    { href: routes.AboutPage({ id }), label: title },
  ];

  return (
    <Fragment>
      <PageMetadata title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <AboutScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <AboutScreenNavigation navigationMenu={navigationMenu} />
          <Content>
            {tableOfContents ? (
              <TableOfContents tableOfContents={tableOfContents} />
            ) : null}
            <Prose>{children}</Prose>
            <LastUpdatedTimestamp dateTime={lastUpdatedTimestamp} />
          </Content>
          <FundingNotice />
        </AboutScreenLayout>
      </PageMainContent>
    </Fragment>
  );
}
