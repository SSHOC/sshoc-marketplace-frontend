"use client";

import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FundingNotice } from "@/components/common/FundingNotice";
import { LinkButton } from "@/components/common/LinkButton";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/error/BackgroundImage";
import { Content } from "@/components/error/Content";
import { ErrorScreenLayout } from "@/components/error/ErrorScreenLayout";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { ReactNode } from "react";

export namespace ErrorPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export default function ErrorPage(): ReactNode {
  const { t } = useI18n<"common">();

  const title = t(["common", "pages", "internal-server-error"]);
  const message = t(["common", "internal-server-error-message"]);

  return (
    <PageMainContent>
      <ErrorScreenLayout>
        <BackgroundImage />
        <Content>
          <ScreenTitle>{title}</ScreenTitle>
          <ErrorMessage message={message} statusCode={500} />
          <div>
            <LinkButton href={routes.HomePage()} color="secondary">
              {t(["common", "go-to-main-page"])}
            </LinkButton>
          </div>
        </Content>
        <FundingNotice />
      </ErrorScreenLayout>
    </PageMainContent>
  );
}
