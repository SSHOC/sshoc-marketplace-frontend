import ModerateItemsPageContent from "@/app/account/moderate-items/moderate-items-page";
import { type ReactNode } from "react";

import type { SearchFilters } from "@/components/account/useModerateItemsSearchFilters";
import type { Metadata } from "next";
import { createI18n } from "@/lib/core/i18n/createI18n";

export namespace ModerateItemsPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = SearchFilters;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["authenticated", "pages", "moderate-items"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function ModerateItemsPage(): ReactNode {
  return <ModerateItemsPageContent />;
}
