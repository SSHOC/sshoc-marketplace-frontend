import VocabulariesPageContent from "@/app/account/vocabularies/vocabularies-page";

import type { ReactNode } from "react";
import type { SearchFilters } from "@/components/account/useVocabularySearchFilters";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Metadata } from "next";

export namespace VocabulariesPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = SearchFilters;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["authenticated", "pages", "vocabularies"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function VocabulariesPage(): ReactNode {
  return <VocabulariesPageContent />;
}
