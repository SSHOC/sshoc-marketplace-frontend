import type { ReactNode } from "react";
import type { SearchFilters } from "@/components/account/useActorSearchFilters";
import ActorsPageContent from "@/app/account/actors/actors-page";
import type { Metadata } from "next";
import { createI18n } from "@/lib/core/i18n/createI18n";

export namespace ActorsPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = SearchFilters;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["authenticated", "pages", "actors"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function ActorsPage(): ReactNode {
  return <ActorsPageContent />;
}
