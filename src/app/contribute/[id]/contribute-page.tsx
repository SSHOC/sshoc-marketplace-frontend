"use client";

import type { Toc } from "@stefanprobst/rehype-extract-toc";
import type { ReactNode } from "react";
import { Fragment } from "react";

import { ContributeScreenLayout } from "@/components/contribute/ContributeScreenLayout";
import { ContributeScreenNavigation } from "@/components/contribute/ContributeScreenNavigation";
import { BackgroundImage } from "@/components/contribute/BackgroundImage";
import { Content } from "@/components/contribute/Content";
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

interface ContributePageProps {
  children: ReactNode;
  id: string;
  lastUpdatedTimestamp: string;
  navigationMenu: NavItems;
  tableOfContents: Toc | undefined;
  title: string;
}

export default function ContributePage(
  props: ContributePageProps
): JSX.Element {
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
    { href: routes.ContributePage({ id }), label: title },
  ];

  return (
    <Fragment>
      <PageMetadata title={title} openGraph={{}} twitter={{}} />
      <PageMainContent>
        <ContributeScreenLayout>
          <BackgroundImage />
          <ScreenHeader>
            <ItemSearchBar />
            <Breadcrumbs links={breadcrumbs} />
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <ContributeScreenNavigation navigationMenu={navigationMenu} />
          <Content>
            {tableOfContents ? (
              <TableOfContents tableOfContents={tableOfContents} />
            ) : null}
            <Prose>{children}</Prose>
            <LastUpdatedTimestamp dateTime={lastUpdatedTimestamp} />
          </Content>
          <FundingNotice />
        </ContributeScreenLayout>
      </PageMainContent>
    </Fragment>
  );
}
