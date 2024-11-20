"use client";

import { type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { LinkButton } from "@/components/common/LinkButton";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundGradient } from "@/components/success/BackgroundGradient";
import { SuccessCard } from "@/components/success/SuccessCard";
import { SuccessCardControls } from "@/components/success/SuccessCardControls";
import { SuccessScreenLayout } from "@/components/success/SuccessScreenLayout";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export default function SuccessPage(): ReactNode {
  const { t } = useI18n<"common">();

  const title = t(["common", "pages", "success"]);

  return (
    <PageMainContent>
      <SuccessScreenLayout>
        <BackgroundGradient />
        <SuccessCard>
          <ScreenHeader>
            <ScreenTitle>{t(["common", "success", "title"])}</ScreenTitle>
          </ScreenHeader>
          <p>{t(["common", "success", "message"])}</p>
          <SuccessCardControls>
            <LinkButton href={routes.HomePage()}>
              {t(["common", "success", "back-home"])}
            </LinkButton>
          </SuccessCardControls>
        </SuccessCard>
        <FundingNotice />
      </SuccessScreenLayout>
    </PageMainContent>
  );
}
