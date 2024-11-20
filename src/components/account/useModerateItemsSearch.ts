import { useRouter } from "next/navigation";

import { routes } from "@/lib/core/navigation/routes";
import type { Href } from "@/lib/core/navigation/types";
import { sanitizeSearchParams } from "@/lib/utils";
import type { ModerateItemsPage } from "@/pages/account/moderate-items";
import { createHref } from "@/lib/core/navigation/create-href";

export interface UseModerateItemsSearchResult {
  getSearchModerateItemsLink: (query: ModerateItemsPage.SearchParamsInput) => {
    href: Href;
    shallow: boolean;
    scroll: boolean;
  };
  searchModerateItems: (query: ModerateItemsPage.SearchParamsInput) => void;
}

export function useModerateItemsSearch(): UseModerateItemsSearchResult {
  const router = useRouter();

  function getSearchModerateItemsLink(
    query: ModerateItemsPage.SearchParamsInput
  ) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: routes.ModerateItemsPage(sanitizeSearchParams(query)),
      shallow: true,
      scroll: true,
    };
  }

  function searchModerateItems(query: ModerateItemsPage.SearchParamsInput) {
    return router.push(createHref(getSearchModerateItemsLink(query).href), {
      scroll: true,
    });
  }

  return { getSearchModerateItemsLink, searchModerateItems };
}
