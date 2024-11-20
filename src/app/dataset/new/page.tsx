import CreateDatasetPageContent from "@/app/dataset/new/create-dataset-page";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Metadata } from "next";

import type { ReactNode } from "react";

export namespace CreateDatasetPage {
  export type PathParamsInput = Record<string, never>;
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
}

export function generateMetadata() {
  const { t } = createI18n();

  const category = "dataset";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "create-item"], {
    values: { item: label },
  });

  const metadata: Metadata = {
    robots: {
      index: false,
    },
    title,
  };

  return metadata;
}

export default function CreateDatasetPage(): ReactNode {
  return <CreateDatasetPageContent />;
}
