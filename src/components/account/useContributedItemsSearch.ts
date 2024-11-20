import { useRouter } from "next/navigation";

import { routes } from "@/lib/core/navigation/routes";
import type { Href } from "@/lib/core/navigation/types";
import { sanitizeSearchParams } from "@/lib/utils";
import type { ContributedItemsPage } from "@/pages/account/contributed-items";
import { createHref } from "@/lib/core/navigation/create-href";

export interface UseContributedItemsSearchResult {
  getSearchContributedItemsLink: (
    query: ContributedItemsPage.SearchParamsInput
  ) => {
    href: Href;
    shallow: boolean;
    scroll: boolean;
  };
  searchContributedItems: (
    query: ContributedItemsPage.SearchParamsInput
  ) => void;
}

export function useContributedItemsSearch(): UseContributedItemsSearchResult {
  const router = useRouter();

  function getSearchContributedItemsLink(
    query: ContributedItemsPage.SearchParamsInput
  ) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: routes.ContributedItemsPage(sanitizeSearchParams(query)),
      shallow: true,
      scroll: true,
    };
  }

  function searchContributedItems(
    query: ContributedItemsPage.SearchParamsInput
  ) {
    return router.push(createHref(getSearchContributedItemsLink(query).href), {
      scroll: true,
    });
  }

  return { getSearchContributedItemsLink, searchContributedItems };
}
