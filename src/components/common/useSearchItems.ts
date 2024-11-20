import { useRouter } from "next/navigation";

import { routes } from "@/lib/core/navigation/routes";
import type { Href } from "@/lib/core/navigation/types";
import { sanitizeSearchParams } from "@/lib/utils";
import type { SearchPage } from "@/pages/search/index";
import { createHref } from "@/lib/core/navigation/create-href";

export interface UseSearchItemsResult {
  getSearchItemsLink: (query: SearchPage.SearchParamsInput) => {
    href: Href;
    shallow: boolean;
    scroll: boolean;
  };
  searchItems: (query: SearchPage.SearchParamsInput) => void;
}

export function useSearchItems(): UseSearchItemsResult {
  const router = useRouter();

  function getSearchItemsLink(query: SearchPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: routes.SearchPage(sanitizeSearchParams(query)),
      shallow: true,
      scroll: true,
    };
  }

  function searchItems(query: SearchPage.SearchParamsInput) {
    return router.push(createHref(getSearchItemsLink(query).href), {
      scroll: true,
    });
  }

  return { getSearchItemsLink, searchItems };
}
