"use client";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { FormHelpText } from "@/components/item-form/FormHelpText";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { useWorkflowFormPage } from "@/components/item-form/useWorkflowFormPage";
import { WorkflowCreateForm } from "@/components/item-form/WorkflowCreateForm";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { ReactNode } from "react";

export default function CreateWorkflowPage(): ReactNode {
  const { t } = useI18n<"authenticated" | "common">();

  const { page, setPage } = useWorkflowFormPage();

  const category = "workflow";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "create-item"], {
    values: {
      item:
        page.type === "workflow"
          ? label
          : page.type === "steps"
          ? t(["common", "item-categories", "step", "other"])
          : t(["common", "item-categories", "step", "one"]),
    },
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
          <WorkflowCreateForm page={page} setPage={setPage} />
        </Content>
        <FundingNotice />
      </ItemFormScreenLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
