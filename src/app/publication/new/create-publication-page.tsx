"use client";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { FormHelpText } from "@/components/item-form/FormHelpText";
import type { ItemFormValues } from "@/components/item-form/ItemForm";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { PublicationCreateForm } from "@/components/item-form/PublicationCreateForm";
import type { WithDictionaries } from "@/lib/core/i18n/types";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { PublicationInput } from "@/lib/data/sshoc/api/publication";
import type { ReactNode } from "react";

export type CreatePublicationFormValues = ItemFormValues<PublicationInput>;

export namespace CreatePublicationPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export default function CreatePublicationPage(): ReactNode {
  const { t } = useI18n<"authenticated" | "common">();

  const category = "publication";
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
          <PublicationCreateForm />
        </Content>
        <FundingNotice />
      </ItemFormScreenLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
