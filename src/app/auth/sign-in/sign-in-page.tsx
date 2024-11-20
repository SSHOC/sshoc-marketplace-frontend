"use client";

import { BackgroundGradient } from "@/components/auth/BackgroundGradient";
import { BackgroundImage } from "@/components/auth/BackgroundImageSignIn";
import { SignInCard } from "@/components/auth/SignInCard";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignInScreenLayout } from "@/components/auth/SignInScreenLayout";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { ReactNode } from "react";

export default function SignInPage(): ReactNode {
  const { t } = useI18n<"common">();

  const title = t(["common", "pages", "sign-in"]);

  return (
    <PageMainContent>
      <SignInScreenLayout>
        <BackgroundGradient />
        <BackgroundImage />
        <SignInCard>
          <ScreenHeader>
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <SignInForm />
        </SignInCard>
        <FundingNotice />
      </SignInScreenLayout>
    </PageMainContent>
  );
}
