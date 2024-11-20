import { useRouter } from "next/navigation";

import { routes } from "@/lib/core/navigation/routes";
import type { Href } from "@/lib/core/navigation/types";
import { sanitizeSearchParams } from "@/lib/utils";
import type { VocabulariesPage } from "@/pages/account/vocabularies";
import { createHref } from "@/lib/core/navigation/create-href";

export interface UseVocabularySearchResult {
  getSearchVocabulariesLink: (query: VocabulariesPage.SearchParamsInput) => {
    href: Href;
    shallow: boolean;
    scroll: boolean;
  };
  searchVocabularies: (query: VocabulariesPage.SearchParamsInput) => void;
}

export function useVocabularySearch(): UseVocabularySearchResult {
  const router = useRouter();

  function getSearchVocabulariesLink(
    query: VocabulariesPage.SearchParamsInput
  ) {
    /** Filter out empty values to avoid `key=` query parameters. */
    return {
      href: routes.VocabulariesPage(sanitizeSearchParams(query)),
      shallow: true,
      scroll: true,
    };
  }

  function searchVocabularies(query: VocabulariesPage.SearchParamsInput) {
    return router.push(createHref(getSearchVocabulariesLink(query).href), {
      scroll: true,
    });
  }

  return { getSearchVocabulariesLink, searchVocabularies };
}
