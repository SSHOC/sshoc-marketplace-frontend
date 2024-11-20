"use client";

import { type ReactNode } from "react";

import { BackgroundGradient } from "@/components/auth/BackgroundGradient";
import { BackgroundImage } from "@/components/auth/BackgroundImageSignUp";
import { SignUpCard } from "@/components/auth/SignUpCard";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { SignUpScreenLayout } from "@/components/auth/SignUpScreenLayout";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export default function SignUpPage(): ReactNode {
  const { t } = useI18n<"common">();

  const title = t(["common", "pages", "sign-up"]);

  return (
    <PageMainContent>
      <SignUpScreenLayout>
        <BackgroundGradient />
        <BackgroundImage />
        <SignUpCard>
          <ScreenHeader>
            <ScreenTitle>{title}</ScreenTitle>
          </ScreenHeader>
          <SignUpForm />
        </SignUpCard>
        <FundingNotice />
      </SignUpScreenLayout>
    </PageMainContent>
  );
}
