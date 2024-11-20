import DatasetPageContent from "@/app/dataset/[persistentId]/dataset-page";
import { createI18n } from "@/lib/core/i18n/createI18n";
import type { Dataset } from "@/lib/data/sshoc/api/dataset";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export namespace DatasetPage {
  export interface PathParamsInput extends ParamsInput {
    persistentId: Dataset["persistentId"];
  }
  export type PathParams = StringParams<PathParamsInput>;
  export type SearchParamsInput = Record<string, never>;
  export interface Props {
    params: PathParams;
  }
}

// FIXME: prefetch data and seed react-query cache

export function generateMetadata() {
  const { t } = createI18n();

  // FIXME: set item label as document title
  const title = t(["common", "item-categories", "dataset", "one"]);

  const metadata: Metadata = {
    title,
  };

  return metadata;
}

export default function DatasetPage(props: DatasetPage.Props): ReactNode {
  const { persistentId } = props.params;

  return <DatasetPageContent persistentId={persistentId} />;
}
