import SourcesPageContent from "@/app/account/sources/sources-page";
import type { ReactNode } from "react";

import type { SearchFilters } from "@/components/account/useSourceSearchFilters";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Metadata } from "next";

export namespace SourcesPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = SearchFilters;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["authenticated", "pages", "sources"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function SourcesPage(): ReactNode {
  return <SourcesPageContent />;
}
