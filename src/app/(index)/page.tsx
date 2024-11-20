import type { ReactNode } from "react";
import IndexPageContent from "@/app/(index)/index-page";
import type { Metadata } from "next";
import { createI18n } from "@/lib/core/i18n/createI18n";

export namespace HomePage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["common", "pages", "home"]);

  const metadata: Metadata = {
    title,
  };

  return metadata;
}

export default function IndexPage(): ReactNode {
  return <IndexPageContent />;
}
