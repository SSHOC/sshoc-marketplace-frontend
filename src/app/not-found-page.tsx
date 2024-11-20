"use client";

import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FundingNotice } from "@/components/common/FundingNotice";
import { LinkButton } from "@/components/common/LinkButton";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/error/BackgroundImage";
import { Content } from "@/components/error/Content";
import { ErrorScreenLayout } from "@/components/error/ErrorScreenLayout";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { ReactNode } from "react";

export namespace NotFoundPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export type Props = WithDictionaries<"common">;
}

export default function NotFoundPage(): ReactNode {
  const { t } = useI18n<"common">();

  const title = t(["common", "pages", "page-not-found"]);
  const message = t(["common", "page-not-found-error-message"]);

  return (
    <PageMainContent>
      <ErrorScreenLayout>
        <BackgroundImage />
        <Content>
          <ScreenTitle>{title}</ScreenTitle>
          <ErrorMessage message={message} statusCode={404} />
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
