import { useRouter } from "next/navigation";

import { routes } from "@/lib/core/navigation/routes";
import type { Href } from "@/lib/core/navigation/types";
import { sanitizeSearchParams } from "@/lib/utils";
import type { ActorsPage } from "@/pages/account/actors";
import { createHref } from "@/lib/core/navigation/create-href";

export interface UseActorSearchResult {
  getSearchActorsLink: (query: ActorsPage.SearchParamsInput) => {
    href: Href;
    shallow: boolean;
    scroll: boolean;
  };
  searchActors: (query: ActorsPage.SearchParamsInput) => void;
}

export function useActorSearch(): UseActorSearchResult {
  const router = useRouter();

  function getSearchActorsLink(query: ActorsPage.SearchParamsInput) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: routes.ActorsPage(sanitizeSearchParams(query)),
      shallow: true,
      scroll: true,
    };
  }

  function searchActors(query: ActorsPage.SearchParamsInput) {
    return router.push(createHref(getSearchActorsLink(query).href), {
      scroll: true,
    });
  }

  return { getSearchActorsLink, searchActors };
}
