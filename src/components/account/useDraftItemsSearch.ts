import { useRouter } from "next/navigation";

import { routes } from "@/lib/core/navigation/routes";
import type { Href } from "@/lib/core/navigation/types";
import { sanitizeSearchParams } from "@/lib/utils";
import type { DraftItemsPage } from "@/pages/account/draft-items";
import { createHref } from "@/lib/core/navigation/create-href";

export interface UseDraftItemsSearchResult {
  getSearchDraftItemsLink: (query: DraftItemsPage.SearchParamsInput) => {
    href: Href;
    shallow: boolean;
    scroll: boolean;
  };
  searchDraftItems: (query: DraftItemsPage.SearchParamsInput) => void;
}

export function useDraftItemsSearch(): UseDraftItemsSearchResult {
  const router = useRouter();

  function getSearchDraftItemsLink(query: DraftItemsPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: routes.DraftItemsPage(sanitizeSearchParams(query)),
      shallow: true,
      scroll: true,
    };
  }

  function searchDraftItems(query: DraftItemsPage.SearchParamsInput) {
    return router.push(createHref(getSearchDraftItemsLink(query).href), {
      scroll: true,
    });
  }

  return { getSearchDraftItemsLink, searchDraftItems };
}
