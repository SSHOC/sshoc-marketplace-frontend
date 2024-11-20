import DraftItemsPageContent from "@/app/account/draft-items/draft-items-page";
import type { SearchFilters } from "@/components/account/useDraftItemsSearchFilters";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export namespace DraftItemsPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = SearchFilters;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["authenticated", "pages", "draft-items"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function DraftItemsPage(): ReactNode {
  return <DraftItemsPageContent />;
}
