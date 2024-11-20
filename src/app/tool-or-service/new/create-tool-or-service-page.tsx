"use client";

import { type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { FormHelpText } from "@/components/item-form/FormHelpText";

import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { ToolOrServiceCreateForm } from "@/components/item-form/ToolOrServiceCreateForm";

import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export default function CreateToolOrServicePage(): ReactNode {
  const { t } = useI18n<"authenticated" | "common">();

  const category = "tool-or-service";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "create-item"], {
    values: { item: label },
  });

  return (
    <PageMainContent>
      <ItemFormScreenLayout>
        <BackgroundImage />
        <ScreenHeader>
          <ScreenTitle>{title}</ScreenTitle>
        </ScreenHeader>
        <Content>
          <FormHelpText />
          <ToolOrServiceCreateForm />
        </Content>
        <FundingNotice />
      </ItemFormScreenLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
