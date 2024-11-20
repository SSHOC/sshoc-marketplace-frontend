"use client";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { Prose } from "@/components/common/Prose";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/contact/BackgroundImage";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactScreenLayout } from "@/components/contact/ContactScreenLayout";
import { Content } from "@/components/contact/Content";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import type { ReactNode } from "react";

interface ContactPageProps {
  children: ReactNode;
  title: string;
}

export default function ContactPage(props: ContactPageProps): ReactNode {
  const { children, title: pageTitle } = props;

  const { t } = useI18n<"common">();

  const title = t(["common", "pages", "contact"]);

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    { href: routes.ContactPage(), label: t(["common", "pages", "contact"]) },
  ];

  return (
    <PageMainContent>
      <ContactScreenLayout>
        <BackgroundImage />
        <ScreenHeader>
          <ItemSearchBar />
          <Breadcrumbs links={breadcrumbs} />
          <ScreenTitle>{pageTitle}</ScreenTitle>
        </ScreenHeader>
        <Content>
          <Prose>{children}</Prose>
        </Content>
        <ContactForm />
        <FundingNotice />
      </ContactScreenLayout>
    </PageMainContent>
  );
}
