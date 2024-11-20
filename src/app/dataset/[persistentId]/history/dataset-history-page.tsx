"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ItemSearchBar } from "@/components/common/ItemSearchBar";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-history/BackgroundImage";
import { Content } from "@/components/item-history/Content";
import { DatasetHistorySearchResults } from "@/components/item-history/DatasetHistorySearchResults";
import { ItemHistoryScreenLayout } from "@/components/item-history/ItemHistoryScreenLayout";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { QueryMetadata } from "@/lib/core/query/types";
import { Breadcrumbs } from "@/lib/core/ui/Breadcrumbs/Breadcrumbs";
import { useDatasetHistory } from "@/lib/data/sshoc/hooks/dataset";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";

interface DatasetHistoryPageProps {
  persistentId: string;
}

export default function DatasetHistoryPage(
  props: DatasetHistoryPageProps
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
  const datasetHistory = useDatasetHistory({ persistentId }, undefined, {
    meta,
  });

  const router = useRouter();
  const { t } = useI18n<"authenticated" | "common">();

  const dataset = datasetHistory.data?.find((item) => {
    return item.status === "approved";
  });
  const category = dataset?.category ?? "dataset";
  const label =
    dataset?.label ?? t(["common", "item-categories", category, "one"]);
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
      href: routes.DatasetPage({ persistentId }),
      label,
    },
    {
      href: routes.DatasetHistoryPage({ persistentId }),
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
          <DatasetHistorySearchResults persistentId={persistentId} />
        </Content>
        <FundingNotice />
      </ItemHistoryScreenLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
