import ContributedItemsPageContent from "@/app/account/contributed-items/contributed-items-page";
import type { SearchFilters } from "@/components/account/useContributedItemsSearchFilters";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export namespace ContributedItemsPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = SearchFilters;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["authenticated", "pages", "contributed-items"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function ContributedItemsPage(): ReactNode {
  return <ContributedItemsPageContent />;
}
