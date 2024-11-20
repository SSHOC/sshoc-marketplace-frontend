import type { ReactNode } from "react";
import AccountPageContent from "@/app/account/account-page";
import type { Metadata } from "next";
import { createI18n } from "@/lib/core/i18n/createI18n";

export namespace AccountPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["authenticated", "pages", "account"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function AccountPage(): ReactNode {
  return <AccountPageContent />;
}
