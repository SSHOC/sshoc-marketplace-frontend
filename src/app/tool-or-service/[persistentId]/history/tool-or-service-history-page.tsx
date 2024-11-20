"use client";

import { useRouter } from "next/navigation";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-history/BackgroundImage";
import { Content } from "@/components/item-history/Content";
import { ItemHistoryScreenLayout } from "@/components/item-history/ItemHistoryScreenLayout";
import { ToolHistorySearchResults } from "@/components/item-history/ToolHistorySearchResults";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { QueryMetadata } from "@/lib/core/query/types";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { useToolHistory } from "@/lib/data/sshoc/hooks/tool-or-service";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";
import type { ReactNode } from "react";

interface ToolOrServiceHistoryPageProps {
  persistentId: string;
}

export default function ToolOrServiceHistoryPage(
  props: ToolOrServiceHistoryPageProps
): ReactNode {
  const { persistentId } = props;

  const meta: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false;
        return undefined;
      },
    },
  };
  const toolHistory = useToolHistory({ persistentId }, undefined, { meta });

  const router = useRouter();
  const { t } = useI18n<"authenticated" | "common">();

  const tool = toolHistory.data?.find((item) => {
    return item.status === "approved";
  });
  const category = tool?.category ?? "tool-or-service";
  const label =
    tool?.label ?? t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "item-history", "item-history"], {
    values: { item: label },
  });

  const breadcrumbs = [
    { href: routes.HomePage(), label: t(["common", "pages", "home"]) },
    {
      href: routes.SearchPage({ categories: [category], order: ["label"] }),
      label: t(["common", "item-categories", category, "other"]),
    },
    {
      href: routes.ToolOrServicePage({ persistentId }),
      label,
    },
    {
      href: routes.ToolOrServiceHistoryPage({ persistentId }),
      label: t(["authenticated", "pages", "item-version-history"]),
    },
  ];

  return (
    <PageMainContent>
      <ItemHistoryScreenLayout>
        <BackgroundImage />
        <ScreenHeader>
          <ItemSearchBar />
          <Breadcrumbs links={breadcrumbs} />
          <ScreenTitle>{title}</ScreenTitle>
        </ScreenHeader>
        <Content>
          <ToolHistorySearchResults persistentId={persistentId} />
        </Content>
        <FundingNotice />
      </ItemHistoryScreenLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
