import UsersPageContent from "@/app/account/users/users-page";
import type { ReactNode } from "react";
import type { SearchFilters } from "@/components/account/useUserSearchFilters";
import type { Metadata } from "next";
import { createI18n } from "@/lib/core/i18n/createI18n";

export namespace UsersPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = SearchFilters;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["authenticated", "pages", "users"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function UsersPage(): ReactNode {
  return <UsersPageContent />;
}
