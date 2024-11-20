import SuccessPageContent from "@/app/success/success-page";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export namespace SuccessPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export function generateMetadata() {
  const { t } = createI18n();

  const title = t(["common", "pages", "success"]);

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function SuccessPage(): ReactNode {
  return <SuccessPageContent />;
}
