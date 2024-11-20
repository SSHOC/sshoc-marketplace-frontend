import SearchPageContent from "@/app/search/search-page";
import type { SearchFilters as ItemSearchFilters } from "@/components/search/useSearchFilters";

import type { ReactNode } from "react";

export namespace SearchPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = ItemSearchFilters;
}

export default function SearchPage(): ReactNode {
  return <SearchPageContent />;
}
